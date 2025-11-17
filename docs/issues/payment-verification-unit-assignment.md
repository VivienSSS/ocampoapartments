---
name: Payment Verification & Unit Assignment
about: Implement payment verification, unit assignment, and rent calculation
title: '[FEATURE] Payment Verification & Unit Assignment Phase'
labels: ['type: feature']
assignees: []
---

## User Story
As an administrator, I want to verify tenant payments and assign units so that I can confirm tenancy. As a system, I want to calculate rent for the full tenancy period so that billing is accurate. As a tenant, I want to receive final confirmation with contract and payment receipt so that I have documentation of my tenancy.

## Overview
Admin verifies tenant payment, officially assigns the unit, calculates rent for full tenancy period, and sends final confirmation with all details. This is the final phase completing the entire rental workflow.

### Related Workflow Steps
- Step 10: Payment Verification (Admin)
- Step 11: Unit Assignment (Admin)
- Step 12: Rent Calculation (System)
- Step 13: Final Confirmation (Admin)

## Acceptance Criteria
- [ ] Admin can view pending payments in dashboard
- [ ] Admin can view payment details: tenant, unit, amount, breakdown, proof, method, ref number
- [ ] Admin can verify payment as "complete" or reject with reason
- [ ] Payment status updates in `payments` collection
- [ ] Upon verification, admin can assign unit to tenant
- [ ] Unit assignment creates/updates tenancy record with tenant, unit, start/end dates, lease terms
- [ ] Unit status changes from "available" to "occupied"
- [ ] Unit cannot be assigned to another tenant while occupied
- [ ] System automatically calculates total rent for lease period (6 months / 1 year configurable)
- [ ] Rent breakdown includes monthly amounts and payment due dates
- [ ] Initial bill generated with advance deposit, first month rent, utilities
- [ ] Subsequent bills scheduled for auto-generation on due dates
- [ ] System sends comprehensive confirmation email with:
  - [ ] Payment confirmation and receipt
  - [ ] Signed contract/lease copy
  - [ ] Unit assignment details (number, address, move-in, lease end)
  - [ ] First rent due date reminder
  - [ ] Contact information and access instructions
- [ ] Email template is professional and includes documentation links

## Test Cases

### Test Case 1: Admin Verifies Payment
- **Given:** Admin is viewing pending payment with proof uploaded
- **When:** Admin reviews proof and marks payment as verified
- **Then:** Payment status set to "verified" and unit assignment becomes available

### Test Case 2: Admin Rejects Payment
- **Given:** Admin is reviewing payment with insufficient proof
- **When:** Admin rejects payment with reason
- **Then:** Payment status set to "rejected", admin provides feedback to tenant

### Test Case 3: Admin Assigns Unit to Tenant
- **Given:** Payment is verified
- **When:** Admin clicks assign unit button
- **Then:** Tenancy record created, unit status changed to "occupied"

### Test Case 4: System Calculates Rent
- **Given:** Unit has been assigned
- **When:** System processes assignment
- **Then:** Rent calculated for lease period, bills scheduled for due dates

### Test Case 5: Tenant Receives Final Confirmation
- **Given:** Unit assignment complete
- **When:** System sends confirmation email
- **Then:** Tenant receives email with receipt, contract, unit details, and due dates

## Priority
- [x] Critical (Blocking other work, security-related)
- [ ] High (Important for business/UX)
- [ ] Medium (Nice to have, improves user experience)
- [ ] Low (Future enhancement, low impact)

## Affected Components
- [x] Dashboard
- [x] Billing
- [ ] Properties
- [x] Tenancies
- [ ] Maintenance
- [ ] Announcements
- [ ] Authentication
- [ ] Database Schema
- [ ] Docker/Deployment
- [ ] Other (please specify below)

## Estimated Effort
- [ ] 1 (Very quick implementation)
- [ ] 2 (Quick implementation)
- [ ] 3 (Small feature)
- [x] 5 (Medium effort)
- [ ] 8 (Significant effort)
- [ ] 13 (Major feature)

## Implementation Notes
- Database entities: `payments`, `tenancies`, `apartment_units`, `bills`
- Permissions: Admin full CRUD; Tenant read own tenancy, payments, bills
- Payment verification is critical quality gate; proof must be authentic
- Rent calculation must account for partial months or promotional periods
- Final confirmation email serves as legal documentation
- Once assigned, unit is locked to tenant for lease duration
