---
name: Unit Selection & Payment Setup
about: Implement tenant dashboard with unit selection and payment setup
title: '[FEATURE] Unit Selection & Payment Setup Phase'
labels: ['type: feature']
assignees: []
---

## User Story
As a tenant, I want to view available apartment units and their details so that I can choose where to live. As a tenant, I want to see the payment breakdown and submit payment so that I can secure my chosen unit.

## Overview
Active tenant accesses their dashboard, views available units, schedules visits, and sets up initial payment with deposit/advance/rent breakdown. This is a critical user experience phase where tenant commits to unit choice.

### Related Workflow Steps
- Step 8: Tenant Dashboard
- Step 9: Schedule Visit

## Acceptance Criteria
- [ ] Tenant dashboard displays all available apartment units
- [ ] Each unit shows: name, location, floor, price, capacity, status, photo gallery
- [ ] Tenant can view detailed unit information and contract/lease terms
- [ ] Payment breakdown displays deposit, advance rent, full rent, and total due
- [ ] Tenant can input/confirm deposit, advance, payment method, and reference number
- [ ] QR code generated for payment (if applicable)
- [ ] Payment submission creates record in `payments` collection
- [ ] Tenant can schedule visit with preferred date, time, and contact info
- [ ] Scheduled visit reflected on admin dashboard
- [ ] Tenant receives visit confirmation
- [ ] Refund button available for cancellations
- [ ] Refund requires proof of payment and reason
- [ ] Refund status tracked for admin review

## Test Cases

### Test Case 1: Tenant Browses Available Units
- **Given:** Tenant is logged in on dashboard
- **When:** Tenant views available units list
- **Then:** All available units display with complete information and photo galleries

### Test Case 2: Tenant Views Unit Details and Contract
- **Given:** Tenant has selected a unit
- **When:** Tenant clicks view details button
- **Then:** Detailed unit info and lease terms display

### Test Case 3: Tenant Submits Payment
- **Given:** Tenant has completed payment form
- **When:** Tenant submits payment with all required information
- **Then:** Payment record created in pending status, QR code displayed

### Test Case 4: Tenant Schedules Unit Visit
- **Given:** Tenant has selected a unit
- **When:** Tenant schedules visit with date, time, and contact info
- **Then:** Visit appears on admin dashboard and tenant receives confirmation

### Test Case 5: Tenant Requests Refund
- **Given:** Tenant has submitted payment
- **When:** Tenant uploads proof and provides refund reason
- **Then:** Refund request created for admin review

## Priority
- [ ] Critical (Blocking other work, security-related)
- [x] High (Important for business/UX)
- [ ] Medium (Nice to have, improves user experience)
- [ ] Low (Future enhancement, low impact)

## Affected Components
- [x] Dashboard
- [x] Billing
- [x] Properties
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
- Database entities: `apartment_units`, `tenancies`, `bills`, `payments`
- Permissions: Tenant read units, read/write own payments; Admin read/write all
- Payment submission is not final until admin verification (Phase 5)
- Visit scheduling helps admins coordinate property tours
- Refund process ensures tenant protection if they change mind before verification
