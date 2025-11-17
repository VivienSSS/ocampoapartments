---
name: Account Creation & Tenant Activation
about: Implement admin account creation and tenant access setup
title: '[FEATURE] Account Creation & Tenant Activation Phase'
labels: ['type: feature']
assignees: []
---

## User Story
As an administrator, I want to create a functional account with credentials for approved tenants so that they can access the system. As a tenant, I want to receive my login credentials via email so that I can access my account.

## Overview
Admin creates a functional tenant account with credentials and the system sends access confirmation. Tenant receives login credentials and can access the system for the first time. This is the bridge between inquiry phase and active usage.

### Related Workflow Steps
- Step 5: Account Creation (Admin)
- Step 6: Acceptance Email (System)
- Step 7: Tenant Access & Selection

## Acceptance Criteria
- [ ] Admin can create account for approved tenant inquiry
- [ ] System generates temporary or permanent password
- [ ] Account creation links user credentials to tenant profile
- [ ] System sends acceptance email containing:
  - [ ] Confirmation of approved registration
  - [ ] Email address for login
  - [ ] Temporary/permanent password
  - [ ] Link to access the system
  - [ ] Instructions for first login
- [ ] Tenant account status is set to "active"
- [ ] Tenant user role is set correctly (tenant role)
- [ ] Tenant can log in with provided credentials
- [ ] First-time login guides tenant to unit selection
- [ ] Optional: First-time login triggers password change requirement

## Test Cases

### Test Case 1: Admin Creates Account Successfully
- **Given:** Admin is viewing approved inquiry
- **When:** Admin clicks create account button
- **Then:** Credentials are generated, account status set to "active", acceptance email sent

### Test Case 2: Tenant Receives Credentials Email
- **Given:** Account has been created
- **When:** Tenant receives acceptance email
- **Then:** Email contains login credentials and access link

### Test Case 3: Tenant Logs in with Credentials
- **Given:** Tenant has received credentials
- **When:** Tenant logs in with provided credentials
- **Then:** Tenant is logged in and directed to unit selection page

### Test Case 4: First-time Login - Password Change
- **Given:** Tenant logs in for first time
- **When:** System prompts for password change
- **Then:** Tenant can set permanent password and proceed

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
- Permissions: Admin full CRUD; Tenant can view own profile
- Credentials should be delivered securely via email
- First-time login may trigger password change requirement for security
- Tenant is now ready to access unit selection and payment features
