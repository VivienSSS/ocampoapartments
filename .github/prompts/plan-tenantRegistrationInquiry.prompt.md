# Plan: Tenant Registration & Inquiry Submission

**TL;DR:** Build a complete tenant registration flow with custom OTP management for n8n integration. Create a public registration page collecting tenant info, add `status` and `emailVerified` fields to the inquiry collection with `rejectionReason` field, create a one-per-inquiry OTP table with auto-generated 6-digit codes via Go hook (5-minute expiry, auto-reset on `hasSent` trigger), build admin dashboard for inquiry management with resend OTP capability, and create a dedicated OTP verification page with post-verification redirect to login. Flow: tenant registers (error: "An inquiry with this email already exists. Please verify your email or contact support" if exists) → inquiry created in pending status + OTP auto-generated → n8n monitors and sends email + sets `hasSent=true` (resets expiry to `now + 5 min`) → tenant verifies OTP via custom page (can resend) → inquiry marked verified → redirected to login. Admin reviews inquiry and can approve/reject; on rejection, n8n reads `rejectionReason` and notifies applicant.

## Steps

1. **Create OTP migration** with fields: `id`, `inquiry` (relation, unique constraint one-per-inquiry), `code` (text), `expiresAt` (date), `hasSent` (boolean, default false), `sentAt` (date), `verifiedAt` (date), `attemptCount` (number, default 0); set permissions: admin + super user can view, only n8n webhook and super user can update `hasSent` field.

2. **Create Go hooks** in PocketBase: (a) on OTP creation, auto-generate 6-digit code and set `expiresAt = now + 5 minutes`; (b) on `hasSent` field update to true, reset `expiresAt = now + 5 minutes` to give fresh 5-minute window.

3. **Update inquiry migration** to add: `status` (select: pending/verified/approved/rejected, default "pending"), `emailVerified` (boolean, default false), `verifiedAt` (date), `rejectionReason` (text, for n8n to read on rejection); set permissions: public create (unauthenticated), admin full CRUD, applicant role read own.

4. **Create registration page** (`src/routes/register.tsx`) with form for first name, last name, phone, email, age, number of occupants; validate all required fields, **check for existing inquiry with same email and error out with message: "An inquiry with this email already exists. Please verify your email or contact support"**, create inquiry with pending status (OTP auto-creates via hook), show success toast with verification instructions and link to verify-otp page.

5. **Add OTP schema** (`src/pocketbase/schemas/otp.ts`) with Zod validation for inquiry relation, code (6-digit regex), hasSent boolean; update inquiry schema (`src/pocketbase/schemas/inquiry.ts`) with status enum, emailVerified, verifiedAt, rejectionReason fields.

6. **Create OTP verification page** (`src/routes/verify-otp.tsx`) accepting inquiry ID as query param; display applicant's email from inquiry, input field for 6-digit OTP code, verify code matches OTP record and hasn't expired, increment `attemptCount`, add **"Resend OTP" button** (regenerates code, resets `expiresAt`, clears `attemptCount`), update inquiry `emailVerified=true` and `verifiedAt=now` on success, redirect to `/login` on success with success toast, show error on expiry/mismatch with attempt counter.

7. **Enhance admin inquiry dashboard** (`src/routes/dashboard/inquiries/`) to display inquiries grouped/filtered by status (pending/verified/approved/rejected), show OTP `hasSent` status as read-only badge, show `emailVerified` status, allow approve/reject actions with rejection reason field (n8n will read and send to applicant), fetch inquiries with OTP data expansion.

8. **Update PocketBase types** (`src/pocketbase/types.ts`): add `OtpRecord`, `OtpResponse`, update `InquiryRecord` with status/emailVerified/verifiedAt/rejectionReason, add `Collections.Otp` enum, add inquiry status enum type.

9. **Create inquiry & OTP queries/mutations** (`src/pocketbase/queries/inquries.ts`, new `src/pocketbase/queries/otp.ts`): register inquiry with duplicate email check (exact error message), verify OTP code (validate code, check expiry, update inquiry status), resend OTP (regenerate code, reset expiry, clear attempt count), fetch inquiries with OTP expansion, update inquiry status and rejectionReason (approve/reject).

## Further Considerations

1. **Resend OTP implementation:** When user clicks resend, should frontend call mutation to regenerate code, or should Go hook handle this? Recommend frontend mutation to trigger code regeneration for clarity.

2. **OTP code storage security:** Storing plain 6-digit codes—acceptable for this use case, or should codes be hashed? Given n8n reads raw codes to send, recommend keeping plain for now but could hash with comparison logic later.

3. **Registration success UX:** After successful registration, should page display "Check your email for OTP" link, or auto-redirect to verify-otp page with inquiry ID? Recommend displaying message + link for clarity.

## Implementation Details

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Tenant Registration Flow                        │
└─────────────────────────────────────────────────────────────────────┘

1. Registration Page (Public)
   ↓
   - Form: firstName, lastName, phone, email, age, numberOfOccupants
   - Validate all fields
   - Check: email exists in inquiry? → Error + message
   - Create inquiry (status: pending, emailVerified: false)
   - Go hook auto-creates OTP with 6-digit code & expiresAt
   - Show success toast + link to verify-otp?inquiryId=XXX
   ↓
2. n8n Automation (External)
   ↓
   - Monitor OTP table for hasSent=false
   - Send OTP email to inquiry.email
   - Update OTP.hasSent=true
   - Go hook resets expiresAt (now + 5 min)
   ↓
3. OTP Verification Page (Tenant)
   ↓
   - Accept inquiry ID as query param
   - Display applicant email (from inquiry)
   - Input 6-digit code
   - Verify: code matches OTP.code AND now < OTP.expiresAt
   - On success: inquiry.emailVerified=true, inquiry.verifiedAt=now
   - Redirect to /login
   - "Resend OTP" button: regenerate code, reset expiresAt, clear attemptCount
   ↓
4. Admin Dashboard (Inquiries)
   ↓
   - Filter by status: pending/verified/approved/rejected
   - Show OTP.hasSent status (read-only badge)
   - Show inquiry.emailVerified status
   - Approve button: inquiry.status=approved
   - Reject button: inquiry.status=rejected + set inquiry.rejectionReason
   ↓
5. n8n Notification (External)
   ↓
   - Monitor inquiry.status=rejected
   - Read inquiry.rejectionReason
   - Send rejection email to inquiry.email with reason
```

### Database Schema Changes

#### OTP Collection
```
{
  id: string (primary key)
  inquiry: relation (unique, one-per-inquiry)
  code: string (6-digit, auto-generated by Go hook)
  expiresAt: date (auto-set to now + 5 min on creation & hasSent update)
  hasSent: boolean (default false, read-only for admin/super user, updatable by n8n)
  sentAt: date (set by n8n when hasSent becomes true)
  verifiedAt: date (set when tenant verifies code)
  attemptCount: number (default 0, incremented on verification attempt)
  created: date (system field)
  updated: date (system field)
}
```

#### Inquiry Collection Updates
```
New fields to add:
  status: select (pending|verified|approved|rejected) - default: pending
  emailVerified: boolean - default: false
  verifiedAt: date
  rejectionReason: text (stores admin's rejection reason for n8n to read)
  
Existing fields already present:
  firstName, lastName, age, email, phone, numberOfOccupants, unitInterested, message, submission_type, qr_image_proof
```

### PocketBase Permissions

#### OTP Collection
- **Create**: Only n8n webhook (or programmatically on inquiry creation)
- **Read**: Admin, Super User
- **Update**: Super User, n8n webhook (specifically for `hasSent` field)
- **Delete**: Super User only

#### Inquiry Collection
- **Create**: Public (unauthenticated)
- **Read**: Admin (all), Super User (all), Applicant role (own records only), public (own with inquiry ID)
- **Update**: Admin (all fields), Super User (all fields)
- **Delete**: Super User only

### Frontend Components

#### `src/routes/register.tsx`
- Public registration form
- Fields: firstName, lastName, phone, email, age, numberOfOccupants
- Validation: all required
- Duplicate email check: query inquiry collection for existing email
- On submit: create inquiry via mutation
- Error handling: show exact error message if email exists
- Success: toast + redirect to verify-otp page or show message with link

#### `src/routes/verify-otp.tsx`
- Query param: inquiryId
- Display: applicant email (from inquiry expand)
- Input: 6-digit OTP code
- Resend OTP button: regenerate code mutation
- Verify button: verify code mutation
- Success: update inquiry emailVerified, redirect to /login
- Error: display error with attempt counter
- Expiry check: show message if code expired

#### `src/routes/dashboard/inquiries/index.tsx` (Enhanced)
- Status filters: pending, verified, approved, rejected
- Display columns: applicant name, email, status badge, emailVerified badge, hasSent badge, createdAt
- Approve action: button to approve inquiry
- Reject action: button + modal for rejection reason input
- Expand: show OTP details when clicking inquiry row

### Zod Schemas

#### `src/pocketbase/schemas/otp.ts`
```typescript
export const otpSchema = z.object({
  id: z.string(),
  inquiry: z.string().nonempty('Inquiry is required'),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  expiresAt: z.date(),
  hasSent: z.boolean(),
  sentAt: z.date().optional(),
  verifiedAt: z.date().optional(),
  attemptCount: z.number().int().nonnegative(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertOtpSchema = otpSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const verifyOtpSchema = z.object({
  inquiryId: z.string(),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});
```

#### `src/pocketbase/schemas/inquiry.ts` (Updated)
```typescript
export const inquirySchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z.number().int().positive('Age must be a positive number'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  numberOfOccupants: z.number().int().positive('Number of occupants must be a positive number'),
  message: z.string().optional(),
  unitInterested: z.string().min(1, 'Unit interested is required'),
  qr_image_proof: z.instanceof(File).optional(),
  submission_type: z.string().optional(),
  // New fields
  status: z.enum(['pending', 'verified', 'approved', 'rejected']),
  emailVerified: z.boolean(),
  verifiedAt: z.date().optional(),
  rejectionReason: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertInquirySchema = inquirySchema.omit({
  id: true,
  created: true,
  updated: true,
  status: true, // set by backend to 'pending'
  emailVerified: true, // set by backend to false
  verifiedAt: true,
});

export const updateInquiryStatusSchema = z.object({
  inquiryId: z.string(),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});
```

### Query/Mutation Implementations

#### `src/pocketbase/queries/inquries.ts` (Updated/New)
```typescript
// Register inquiry (creates inquiry + auto-creates OTP via hook)
export const registerInquiryMutation = mutationOptions({
  mutationFn: async (data: z.infer<typeof insertInquirySchema>) => {
    // Check for duplicate email
    const existing = await pb.collection(Collections.Inquiry).getFullList({
      filter: `email = '${data.email}'`,
    });
    
    if (existing.length > 0) {
      throw new Error('An inquiry with this email already exists. Please verify your email or contact support');
    }
    
    // Create inquiry with default values
    return pb.collection(Collections.Inquiry).create({
      ...data,
      status: 'pending',
      emailVerified: false,
    });
  },
});

// Verify OTP code
export const verifyOtpMutation = mutationOptions({
  mutationFn: async (data: z.infer<typeof verifyOtpSchema>) => {
    const otp = await pb.collection(Collections.Otp).getFirstListItem(
      `inquiry = '${data.inquiryId}'`
    );
    
    // Check if expired
    if (new Date() > new Date(otp.expiresAt)) {
      throw new Error('OTP has expired. Please request a new one.');
    }
    
    // Check if code matches
    if (otp.code !== data.code) {
      // Increment attempt count
      await pb.collection(Collections.Otp).update(otp.id, {
        attemptCount: otp.attemptCount + 1,
      });
      throw new Error('Invalid OTP code. Please try again.');
    }
    
    // Update OTP and inquiry
    await pb.collection(Collections.Otp).update(otp.id, {
      verifiedAt: new Date().toISOString(),
    });
    
    await pb.collection(Collections.Inquiry).update(data.inquiryId, {
      emailVerified: true,
      verifiedAt: new Date().toISOString(),
      status: 'verified',
    });
  },
});

// Resend OTP (regenerate code)
export const resendOtpMutation = mutationOptions({
  mutationFn: async (inquiryId: string) => {
    const otp = await pb.collection(Collections.Otp).getFirstListItem(
      `inquiry = '${inquiryId}'`
    );
    
    // Go hook will regenerate code and reset expiresAt on update
    await pb.collection(Collections.Otp).update(otp.id, {
      attemptCount: 0,
    });
  },
});

// Update inquiry status (approve/reject)
export const updateInquiryStatusMutation = mutationOptions({
  mutationFn: async (data: z.infer<typeof updateInquiryStatusSchema>) => {
    return pb.collection(Collections.Inquiry).update(data.inquiryId, {
      status: data.status,
      rejectionReason: data.rejectionReason || null,
    });
  },
});

// List inquiries with OTP data
export const listInquiriesQuery = (page: number, perPage: number, status?: string) =>
  queryOptions({
    queryKey: [Collections.Inquiry, page, perPage, status],
    queryFn: () => {
      const filter = status ? `status = '${status}'` : '';
      return pb.collection(Collections.Inquiry).getList(page, perPage, {
        expand: 'otp', // relation to OTP
        filter,
        sort: '-created',
      });
    },
  });
```

#### `src/pocketbase/queries/otp.ts` (New)
```typescript
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { pb } from '..';
import type { verifyOtpSchema } from '../schemas/otp';
import type { OtpResponse } from '../types';
import { Collections } from '../types';
import type z from 'zod';

export const getOtpByInquiryQuery = (inquiryId: string) =>
  queryOptions({
    queryKey: [Collections.Otp, inquiryId],
    queryFn: () =>
      pb.collection(Collections.Otp).getFirstListItem(
        `inquiry = '${inquiryId}'`,
      ) as Promise<OtpResponse>,
  });
```

### PocketBase Types Updates

#### `src/pocketbase/types.ts` (Additions)
```typescript
// Add to Collections enum
export enum Collections {
  // ... existing
  Otp = 'otp',
}

// Add OTP types
export type OtpRecord = {
  id: string;
  inquiry: string;
  code: string;
  expiresAt: string;
  hasSent: boolean;
  sentAt?: string;
  verifiedAt?: string;
  attemptCount: number;
};

export type OtpResponse<Texpand = unknown> = Required<OtpRecord> & BaseSystemFields<Texpand>;

// Update Inquiry types
export type InquiryRecord = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  numberOfOccupants: number;
  message?: string;
  unitInterested: string;
  qr_image_proof?: string;
  submission_type?: string;
  // New fields
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  emailVerified: boolean;
  verifiedAt?: string;
  rejectionReason?: string;
};

export type InquiryResponse<Texpand = unknown> = Required<InquiryRecord> & BaseSystemFields<Texpand>;
```

### Go Hooks (PocketBase)

The hooks should be added to the PocketBase main.go file. Example structure:

```go
// Hook 1: Auto-generate OTP code on creation
app.OnRecordCreate("otp").Add(func(e *core.RecordCreateEvent) error {
  // Generate 6-digit code
  code := fmt.Sprintf("%06d", rand.Intn(1000000))
  e.Record.Set("code", code)
  
  // Set expiresAt to now + 5 minutes
  expiresAt := time.Now().Add(5 * time.Minute)
  e.Record.Set("expiresAt", expiresAt)
  
  return nil
})

// Hook 2: Reset expiresAt when hasSent is updated to true
app.OnRecordUpdate("otp").Add(func(e *core.RecordUpdateEvent) error {
  hasSent := e.Record.GetBool("hasSent")
  if hasSent && e.Record.GetBool("hasSent") != e.Request.Data().GetBool("hasSent") {
    // hasSent was just set to true
    expiresAt := time.Now().Add(5 * time.Minute)
    e.Record.Set("expiresAt", expiresAt)
  }
  
  return nil
})
```

## Testing Checklist

- [ ] Registration form validation (all fields required)
- [ ] Duplicate email error displays correct message
- [ ] Inquiry created with pending status
- [ ] OTP auto-created with 6-digit code
- [ ] OTP expires in 5 minutes
- [ ] Verify OTP page displays correct inquiry email
- [ ] OTP verification success updates inquiry emailVerified
- [ ] Success redirect to login works
- [ ] Resend OTP regenerates new code
- [ ] Resend OTP resets expiresAt
- [ ] Admin can view inquiries by status
- [ ] Admin can approve/reject inquiry
- [ ] Rejection reason saves correctly
- [ ] OTP hasSent is read-only for non-super-users
- [ ] n8n can update hasSent field
- [ ] n8n can read rejectionReason

## n8n Integration Points

1. **Monitor OTP table** for `hasSent = false` records
2. **Send OTP email** to inquiry.email with otp.code
3. **Update OTP** set `hasSent = true` and `sentAt = now` (Go hook resets expiresAt)
4. **Monitor inquiry table** for `status = rejected` records
5. **Read rejectionReason** and send rejection email with reason to inquiry.email
