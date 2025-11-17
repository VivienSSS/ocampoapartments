---
name: Admin Verification & Account Approval
about: Implement admin inquiry verification and approval/rejection workflow
title: '[FEATURE] Admin Verification & Account Approval Phase'
labels: ['type: feature']
assignees: []
---

## User Story
As an administrator, I want to verify tenant emails via OTP and approve or reject their inquiries so that I can control who gains access to the system.

## Overview
Admin reviews tenant inquiries, verifies email, and makes an accept/reject decision with corresponding notifications. This is a critical quality gate before account creation.

### Related Workflow Steps
- Step 3: Admin Verification
- Step 4: Admin Decision (Accept/Reject)

## Acceptance Criteria
- [ ] Admin can view list of pending inquiries with tenant details
- [ ] Admin can send OTP verification email to tenant
- [ ] Admin can verify tenant's email address has been confirmed
- [ ] Admin can accept inquiry with optional reason
- [ ] Admin can reject inquiry with required rejection reason
- [ ] If rejected:
  - [ ] System sends rejection email to tenant with reason
  - [ ] Inquiry status is set to "rejected"
  - [ ] Tenant account remains inactive
- [ ] If accepted:
  - [ ] Inquiry status is set to "approved"
  - [ ] Triggers Phase 3: Account Creation & Tenant Activation
- [ ] Email templates are professional and include all necessary information
- [ ] Rejection reason is logged for audit trail

## Test Cases

### Test Case 1: Admin Accepts Inquiry
- **Given:** Admin is viewing a pending inquiry with verified email
- **When:** Admin clicks accept button
- **Then:** Inquiry status changes to "approved" and proceeds to account creation phase

### Test Case 2: Admin Rejects Inquiry with Reason
- **Given:** Admin is viewing a pending inquiry
- **When:** Admin clicks reject and provides rejection reason
- **Then:** System sends rejection email with reason, status set to "rejected", tenant remains inactive

### Test Case 3: Email OTP Verification
- **Given:** Admin has sent OTP to tenant
- **When:** Tenant receives and confirms OTP
- **Then:** Email verification status is updated in user record

### Test Case 4: Edge Case - Rejection Reason Required
- **Given:** Admin attempts to reject inquiry
- **When:** Admin tries to reject without providing reason
- **Then:** System displays validation error and prevents rejection

## Priority
- [x] Critical (Blocking other work, security-related)
- [ ] High (Important for business/UX)
- [ ] Medium (Nice to have, improves user experience)
- [ ] Low (Future enhancement, low impact)

## Affected Components
- [x] Dashboard
- [ ] Billing
- [ ] Properties
- [ ] Tenancies
- [ ] Maintenance
- [ ] Announcements
- [x] Authentication
- [ ] Database Schema
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
- Permissions: Admin full CRUD; Tenant cannot access this phase
- OTP email verification confirms tenant's email is valid before proceeding
- Rejection reason is crucial for audit trail and tenant communication
