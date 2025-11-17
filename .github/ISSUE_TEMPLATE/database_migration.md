---
name: Database Migration
about: Request a database schema change or migration
title: '[DB] Brief description of schema change'
labels: ['type: database', 'area: backend']
assignees: []
---

## Overview
<!-- Clear and concise description of the database change -->

## Schema Changes
<!-- Describe the specific schema modifications needed -->

### Tables to Create/Modify
- 
- 

### Columns to Add/Remove/Modify
- 

### Indexes to Add/Modify
- 

### Relationships/Constraints to Add/Modify
- 

## Migration Impact Assessment
<!-- Describe how this change impacts existing data and functionality -->

### Data Migration Strategy
<!-- How will existing data be handled? Any data transformation needed? -->

### Backward Compatibility
<!-- Will this break existing functionality? Any deprecation period needed? -->

### Performance Implications
<!-- Any performance considerations for the database or application? -->

## Acceptance Criteria
<!-- List the criteria that define when this migration is complete -->
- [ ] Migration file created and tested
- [ ] Data migration handled correctly
- [ ] Backup created before deployment
- [ ] Performance impact validated
- [ ] Documentation updated
- [ ] Rollback plan documented

## Test Cases
<!-- Describe test scenarios that validate the migration works correctly -->

### Test Case 1: Data Integrity
- **Given:** Existing data in the affected tables
- **When:** Migration is applied
- **Then:** All data is correctly preserved/transformed

### Test Case 2: Functionality After Migration
- **Given:** System after migration
- **When:** Running affected features
- **Then:** All features work as expected

### Test Case 3: Rollback Scenario
- **Given:** Migrated database
- **When:** Rollback is needed
- **Then:** Database returns to previous state without data loss

## Priority
<!-- Select the priority level -->
- [ ] Critical (Required for deployment, security/data integrity issue)
- [ ] High (Urgent schema change, blocking features)
- [ ] Medium (Important improvement, can wait for next release)
- [ ] Low (Future enhancement, no immediate need)

## Estimated Effort
<!-- Select estimated effort in story points -->
- [ ] 1 (Simple schema change)
- [ ] 2 (Straightforward migration)
- [ ] 3 (Moderate complexity)
- [ ] 5 (Complex data transformation)
- [ ] 8 (Major schema restructuring)
- [ ] 13 (Very complex migration strategy)

## Related Issues
<!-- Link any related feature requests, bugs, or PRs -->
Closes #
Related to #

## Deployment Notes
<!-- Any special considerations for deployment -->

### Downtime Required
- [ ] No downtime
- [ ] Brief downtime acceptable
- [ ] Careful timing required (off-peak hours)

### Data Backup
<!-- Confirm backup procedures -->
- [ ] Full backup created
- [ ] Tested restore procedure

### Rollback Plan
<!-- Describe the rollback procedure -->

<!-- Labels that will be auto-assigned: type: database, area: backend -->
