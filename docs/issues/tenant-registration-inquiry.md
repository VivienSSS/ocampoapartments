---
name: Tenant Registration & Inquiry
about: Implement initial tenant registration and inquiry submission
title: '[FEATURE] Tenant Registration & Inquiry Phase'
labels: ['type: feature']
assignees: []
---

## User Story
As a potential tenant, I want to register with my information (name, phone, email, age, occupants) so that I can submit an inquiry and management can review it.

## Overview
Initial tenant registration and inquiry submission. Potential tenants register with required information, and the system notifies admins of new inquiries. This is the entry point for the entire rental workflow.

### Related Workflow Steps
- Step 1: Initial Registration (Tenant)
- Step 2: Admin Receives Inquiry

## Acceptance Criteria
- [ ] Registration form collects required information:
  - [ ] Full name
  - [ ] Phone number
  - [ ] Email address
  - [ ] Age
  - [ ] Number of occupants
- [ ] Validation ensures all fields are completed before submission
- [ ] Email verification is required (OTP sent to provided email)
- [ ] Registration data is stored in the `tenants` and `users` collections
- [ ] Admin is notified of new inquiry via dashboard or email notification
- [ ] Inquiry status is set to "pending" awaiting admin review
- [ ] New registrations appear in admin's inquiry queue
- [ ] Email verification is a prerequisite before admin review begins

## Test Cases

### Test Case 1: Successful Registration Submission
- **Given:** User is on the registration page
- **When:** User completes all required fields and submits the form
- **Then:** Registration is saved, OTP email is sent, and inquiry appears in admin queue with "pending" status

### Test Case 2: Registration Validation
- **Given:** User is on the registration page
- **When:** User attempts to submit with missing required fields
- **Then:** Form shows validation errors and prevents submission

### Test Case 3: Email Verification
- **Given:** User has submitted registration
- **When:** User receives OTP email and verifies email address
- **Then:** Email verification status is updated in user record

### Test Case 4: Edge Case - Duplicate Email
- **Given:** Email already exists in system
- **When:** User attempts to register with duplicate email
- **Then:** System displays error and prevents registration

## Priority
- [x] Critical (Blocking other work, security-related)
- [ ] High (Important for business/UX)
- [ ] Medium (Nice to have, improves user experience)
- [ ] Low (Future enhancement, low impact)

## Affected Components
- [ ] Dashboard
- [ ] Billing
- [ ] Properties
- [ ] Tenancies
- [x] Maintenance
- [ ] Announcements
- [x] Authentication
- [x] Database Schema
- [ ] Docker/Deployment
- [ ] Other (please specify below)

## Estimated Effort
- [ ] 1 (Very quick implementation)
- [ ] 2 (Quick implementation)
- [x] 3 (Small feature)
- [ ] 5 (Medium effort)
- [ ] 8 (Significant effort)
- [ ] 13 (Major feature)

## Implementation Notes
- Database entities: `users`, `tenants`
- Permissions: Tenant can create registration; Admin can view all inquiries
- Email verification is a prerequisite before admin review begins
- Consider rate limiting on registration submissions to prevent spam
