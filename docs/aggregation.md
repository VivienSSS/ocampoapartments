# Data Aggregation & Analytics Queries

Analytics queries for the OcampoApartments database, focusing on properties, tenancies, financial data, and maintenance operations.

---

## STAT CARDS (KPI Aggregations)

Queries that return single-row results for dashboard stat cards and key performance indicators.

### Overall Portfolio Statistics
High-level business metrics snapshot.

```sql
SELECT 
  1 as id,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT au.id) as total_units,
  COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) as occupied_units,
  ROUND(COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) * 100.0 / COUNT(DISTINCT au.id), 2) as overall_occupancy_rate,
  COUNT(DISTINCT t.id) as total_active_tenants,
  ROUND(SUM(au.price), 2) as total_monthly_potential_revenue
FROM properties p
LEFT JOIN apartment_units au ON p.id = au.property
LEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now');
```

### Financial Summary Card
Comprehensive financial KPIs for the dashboard.

```sql
SELECT 
  1 as id,
  COUNT(DISTINCT b.id) as total_bills,
  COUNT(DISTINCT CASE WHEN b.status = 'paid' THEN b.id END) as paid_bills,
  COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) as pending_bills,
  COUNT(DISTINCT CASE WHEN b.status = 'overdue' THEN b.id END) as overdue_bills,
  ROUND(SUM(bi.amount), 2) as total_bill_amount,
  ROUND(SUM(CASE WHEN b.status = 'paid' THEN bi.amount ELSE 0 END), 2) as total_paid,
  ROUND(SUM(CASE WHEN b.status = 'pending' OR b.status = 'overdue' THEN bi.amount ELSE 0 END), 2) as total_outstanding,
  ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END), 2) as total_received,
  ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END) * 100.0 / NULLIF(SUM(bi.amount), 0), 2) as payment_collection_rate
FROM bills b
LEFT JOIN bill_items bi ON b.id = bi.bill
LEFT JOIN payments p ON b.id = p.bill;
```

### Maintenance Operations Summary
Key maintenance metrics snapshot.

```sql
SELECT 
  1 as id,
  COUNT(DISTINCT mr.id) as total_requests,
  COUNT(DISTINCT CASE WHEN mr.status = 'completed' THEN mr.id END) as completed_requests,
  COUNT(DISTINCT CASE WHEN mr.status != 'completed' THEN mr.id END) as pending_requests,
  COUNT(DISTINCT CASE WHEN mr.urgency IN ('critical', 'high') AND mr.status != 'completed' THEN mr.id END) as critical_pending,
  COUNT(DISTINCT mw.id) as total_workers,
  COUNT(DISTINCT CASE WHEN mw.isAvailable = 1 THEN mw.id END) as available_workers
FROM maintenance_requests mr
LEFT JOIN maintenance_workers mw ON mr.worker = mw.id OR 1=1;
```

### Tenancy Health Snapshot
Current lease and occupancy metrics.

```sql
SELECT 
  1 as id,
  COUNT(*) as total_tenancies,
  COUNT(CASE WHEN t.leaseEndDate >= date('now') THEN 1 END) as active_tenancies,
  COUNT(CASE WHEN t.leaseEndDate < date('now') THEN 1 END) as expired_tenancies,
  COUNT(CASE WHEN t.leaseEndDate < date('now', '+30 days') AND t.leaseEndDate >= date('now') THEN 1 END) as expiring_soon,
  ROUND(AVG((julianday(t.leaseEndDate) - julianday(t.leaseStartDate)) / 365.25), 2) as avg_lease_duration_years
FROM tenancies t;
```

---

## CHARTS (Multi-Row Data for Visualization)

Queries that return multiple rows for charting, tables, and detailed analytics.

### Property Summary Chart
Get an overview of all properties including unit count and occupancy status.

```sql
SELECT 
  p.id,
  p.address,
  p.branch,
  COUNT(au.id) as totalUnits,
  SUM(CASE WHEN au.isAvailable = 1 THEN 1 ELSE 0 END) as availableUnits,
  SUM(CASE WHEN au.isAvailable = 0 THEN 1 ELSE 0 END) as occupiedUnits,
  (ROUND(SUM(CASE WHEN au.isAvailable = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(au.id), 2)) as occupancyRate,
  p.created,
  p.updated
FROM properties p
LEFT JOIN apartment_units au ON p.id = au.property
GROUP BY p.id, p.address, p.branch
ORDER BY p.address;
```

### Revenue Per Property Chart
Calculate total revenue and potential revenue per property.

```sql
SELECT 
  p.id,
  p.address,
  COUNT(DISTINCT au.id) as totalUnits,
  SUM(au.price) as totalPotentialMonthlyRevenue,
  SUM(CASE WHEN au.isAvailable = 0 THEN au.price ELSE 0 END) as currentMonthlyRevenue,
  (ROUND(SUM(CASE WHEN au.isAvailable = 0 THEN au.price ELSE 0 END) * 100.0 / SUM(au.price), 2)) as revenueUtilizationRate
FROM properties p
LEFT JOIN apartment_units au ON p.id = au.property
GROUP BY p.id, p.address
ORDER BY currentMonthlyRevenue DESC;
```

### Unit Inventory Table
Detailed breakdown of all apartment units with pricing and availability.

```sql
SELECT 
  au.id,
  au.unitLetter,
  au.floorNumber,
  au.capacity,
  au.price,
  au.isAvailable,
  (CASE WHEN au.isAvailable = 1 THEN 'Available' ELSE 'Occupied' END) as status,
  p.address as propertyAddress,
  au.created,
  au.updated
FROM apartment_units au
LEFT JOIN properties p ON au.property = p.id
ORDER BY p.address, au.floorNumber, au.unitLetter;
```

### Unit Price Statistics Chart
Statistical analysis of unit pricing across properties.

```sql
SELECT 
  ROW_NUMBER()OVER(ORDER BY p.address) as id,
  p.address as property,
  COUNT(au.id) as unitCount,
  MIN(au.price) as minPrice,
  MAX(au.price) as maxPrice,
  (ROUND(AVG(au.price), 2)) as avgPrice,
  (ROUND(SUM(au.price), 2)) as totalMonthlyPotential
FROM apartment_units au
LEFT JOIN properties p ON au.property = p.id
GROUP BY p.address
ORDER BY avgPrice DESC;
```

### Active Tenancies Table
Overview of current lease agreements with tenant and unit information.

```sql
SELECT 
  t.id,
  tn.id as tenantId,
  u.username as tenantUsername,
  u.firstName,
  u.lastName,
  au.unitLetter,
  au.floorNumber,
  p.address as property,
  t.leaseStartDate,
  t.leaseEndDate,
  (CASE 
    WHEN t.leaseEndDate < date('now') THEN 'Expired'
    WHEN t.leaseEndDate < date('now', '+30 days') THEN 'Expiring Soon'
    ELSE 'Active'
  END) as leaseStatus,
  t.created,
  t.updated
FROM tenancies t
LEFT JOIN tenants tn ON t.tenant = tn.id
LEFT JOIN users u ON tn.user = u.id
LEFT JOIN apartment_units au ON t.unit = au.id
LEFT JOIN properties p ON au.property = p.id
ORDER BY t.leaseEndDate;
```

### Tenants Per Property Chart
Distribution of tenants across properties.

```sql
SELECT 
  p.id,
  p.address,
  COUNT(DISTINCT t.id) as totalTenants,
  COUNT(DISTINCT au.id) as totalUnits,
  (ROUND(COUNT(DISTINCT t.id) * 100.0 / COUNT(DISTINCT au.id), 2)) as occupancyPercentage
FROM properties p
LEFT JOIN apartment_units au ON p.id = au.property
LEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now')
GROUP BY p.id, p.address
ORDER BY occupancyPercentage DESC;
```

### Bills by Status Chart
Detailed breakdown of bills categorized by payment status.

```sql
SELECT 
  b.status as id,
  b.status,
  COUNT(b.id) as billCount,
  (ROUND(SUM(bi.amount), 2)) as totalAmount,
  (ROUND(AVG(bi.amount), 2)) as avgAmount,
  COUNT(DISTINCT b.tenancy) as tenanciesAffected,
  COUNT(DISTINCT CASE WHEN b.dueDate < date('now') THEN b.id END) as overdueCount
FROM bills b
LEFT JOIN bill_items bi ON b.id = bi.bill
GROUP BY b.status
ORDER BY billCount DESC;
```

### Outstanding Receivables Table
Detailed list of unpaid bills and outstanding amounts per tenant.

```sql
SELECT 
  tn.id,
  u.firstName,
  u.lastName,
  u.email,
  tn.phoneNumber,
  au.unitLetter,
  p.address as property,
  COUNT(b.id) as unpaidBills,
  (ROUND(SUM(bi.amount), 2)) as totalOutstanding,
  MAX(b.dueDate) as mostRecentDueDate,
  (CASE 
    WHEN MAX(b.dueDate) < date('now') THEN 'OVERDUE'
    WHEN MAX(b.dueDate) < date('now', '+7 days') THEN 'DUE SOON'
    ELSE 'UPCOMING'
  END) as urgencyLevel
FROM bills b
LEFT JOIN tenancies t ON b.tenancy = t.id
LEFT JOIN tenants tn ON t.tenant = tn.id
LEFT JOIN users u ON tn.user = u.id
LEFT JOIN apartment_units au ON t.unit = au.id
LEFT JOIN properties p ON au.property = p.id
LEFT JOIN bill_items bi ON b.id = bi.bill
WHERE b.status IN ('pending', 'overdue')
GROUP BY tn.id, u.firstName, u.lastName, u.email, tn.phoneNumber, au.unitLetter, p.address
ORDER BY totalOutstanding DESC;
```

### Payment Methods Distribution Chart
Analyze payment methods used and their success rates.

```sql
SELECT 
  p.paymentMethod as id,
  p.paymentMethod,
  COUNT(p.id) as paymentCount,
  (ROUND(SUM(p.amountPaid), 2)) as totalAmountPaid,
  (ROUND(AVG(p.amountPaid), 2)) as avgPaymentAmount,
  (ROUND(COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM payments), 2)) as paymentMethodPercentage
FROM payments p
GROUP BY p.paymentMethod
ORDER BY totalAmountPaid DESC;
```

### Monthly Revenue Trend Chart
Revenue trends over time by month.

```sql
SELECT 
  strftime('%Y-%m', p.paymentDate) as id,
  strftime('%Y-%m', p.paymentDate) as month,
  COUNT(p.id) as paymentCount,
  (ROUND(SUM(p.amountPaid), 2)) as monthlyRevenue,
  (ROUND(AVG(p.amountPaid), 2)) as avgPaymentSize,
  COUNT(DISTINCT p.tenant) as uniqueTenants
FROM payments p
WHERE p.paymentDate IS NOT NULL
GROUP BY strftime('%Y-%m', p.paymentDate)
ORDER BY month DESC;
```

### Bill Item Analysis Chart
Breakdown of charges by type and their contribution to total revenue.

```sql
SELECT 
  bi.chargeType as id,
  bi.chargeType,
  COUNT(bi.id) as itemCount,
  COUNT(DISTINCT bi.bill) as billCount,
  (ROUND(SUM(bi.amount), 2)) as totalAmount,
  (ROUND(AVG(bi.amount), 2)) as avgAmount,
  (ROUND(SUM(bi.amount) * 100.0 / (SELECT SUM(amount) FROM bill_items), 2)) as percentageOfTotal
FROM bill_items bi
GROUP BY bi.chargeType
ORDER BY totalAmount DESC;
```

### Maintenance Request Status Chart
Detailed count of requests by status and metrics.

```sql
SELECT 
  mr.status as id,
  mr.status,
  COUNT(mr.id) as totalRequests,
  COUNT(CASE WHEN mr.submittedDate IS NOT NULL AND mr.completedDate IS NULL THEN 1 END) as pendingCount,
  (ROUND(AVG(CASE WHEN mr.completedDate IS NOT NULL 
    THEN (julianday(mr.completedDate) - julianday(mr.submittedDate))
    ELSE NULL 
  END), 2)) as avgResolutionDays
FROM maintenance_requests mr
GROUP BY mr.status
ORDER BY mr.status;
```

### Maintenance Request Overview Chart
Summary of maintenance requests by status and urgency.

```sql
SELECT 
  (mr.status || '_' || mr.urgency) as id,
  mr.status,
  mr.urgency,
  COUNT(mr.id) as requestCount,
  COUNT(CASE WHEN mr.worker IS NOT NULL THEN 1 END) as assignedCount,
  (ROUND(COUNT(CASE WHEN mr.worker IS NOT NULL THEN 1 END) * 100.0 / COUNT(mr.id), 2)) as assignmentRate,
  (ROUND(AVG((julianday(mr.completedDate) - julianday(mr.submittedDate))), 2)) as avgCompletionDays
FROM maintenance_requests mr
GROUP BY mr.status, mr.urgency
ORDER BY requestCount DESC;
```

### Worker Performance Table
Metrics on maintenance worker productivity and assignment load.

```sql
SELECT 
  mw.id,
  mw.name,
  mw.contactDetails,
  mw.isAvailable,
  COUNT(mr.id) as totalAssignments,
  COUNT(CASE WHEN mr.status = 'completed' THEN 1 END) as completedJobs,
  COUNT(CASE WHEN mr.status = 'in_progress' THEN 1 END) as inProgressJobs,
  (ROUND(COUNT(CASE WHEN mr.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(mr.id), 0), 2)) as completionRate,
  (ROUND(AVG(CASE WHEN mr.completedDate IS NOT NULL 
    THEN (julianday(mr.completedDate) - julianday(mr.submittedDate))
    ELSE NULL 
  END), 2)) as avgResolutionDays
FROM maintenance_workers mw
LEFT JOIN maintenance_requests mr ON mw.id = mr.worker
GROUP BY mw.id, mw.name, mw.contactDetails, mw.isAvailable
ORDER BY totalAssignments DESC;
```

### High-Priority Unresolved Requests Table
Critical maintenance issues that need immediate attention.

```sql
SELECT 
  mr.id,
  mr.description,
  mr.urgency,
  mr.status,
  mr.submittedDate,
  (CASE 
    WHEN mr.urgency = 'critical' THEN 'CRITICAL - Immediate Action'
    WHEN mr.urgency = 'high' THEN 'HIGH - Urgent'
    WHEN mr.urgency = 'medium' THEN 'MEDIUM - Soon'
    ELSE 'LOW'
  END) as priorityLabel,
  tn.id as tenantId,
  u.firstName,
  u.lastName,
  u.contactEmail,
  tn.phoneNumber,
  au.unitLetter,
  p.address as property,
  mw.name as assignedWorker,
  (ROUND((julianday('now') - julianday(mr.submittedDate)), 0)) as daysOpen
FROM maintenance_requests mr
LEFT JOIN tenants tn ON mr.tenant = tn.id
LEFT JOIN users u ON tn.user = u.id
LEFT JOIN apartment_units au ON mr.unit = au.id
LEFT JOIN properties p ON au.property = p.id
LEFT JOIN maintenance_workers mw ON mr.worker = mw.id
WHERE mr.status != 'completed' AND (mr.urgency = 'critical' OR mr.urgency = 'high')
ORDER BY mr.urgency DESC, mr.submittedDate ASC;
```

### Recent Announcements Table
Latest announcements with author information.

```sql
SELECT 
  a.id,
  a.title,
  SUBSTR(a.message, 1, 100) as messagePreview,
  (u.firstName || ' ' || u.lastName) as authorName,
  u.email,
  a.created,
  a.updated,
  (CASE 
    WHEN a.created >= date('now', '-1 day') THEN 'Today/Yesterday'
    WHEN a.created >= date('now', '-7 days') THEN 'This Week'
    WHEN a.created >= date('now', '-30 days') THEN 'This Month'
    ELSE 'Older'
  END) as recency
FROM announcements a
LEFT JOIN users u ON a.author = u.id
ORDER BY a.created DESC
LIMIT 50;
```

### Property Health Dashboard Table
Comprehensive view of property status including financials and maintenance.

```sql
SELECT 
  p.id,
  p.address,
  COUNT(DISTINCT au.id) as totalUnits,
  COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) as occupiedUnits,
  (ROUND(COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) * 100.0 / COUNT(DISTINCT au.id), 2)) as occupancyRate,
  (ROUND(SUM(au.price), 2)) as totalMonthlyPotential,
  COUNT(DISTINCT b.id) as totalBills,
  COUNT(DISTINCT CASE WHEN b.status IN ('pending', 'overdue') THEN b.id END) as outstandingBills,
  (ROUND(SUM(CASE WHEN b.status IN ('pending', 'overdue') THEN bi.amount ELSE 0 END), 2)) as outstandingAmount,
  COUNT(DISTINCT mr.id) as openMaintenanceRequests,
  COUNT(DISTINCT CASE WHEN mr.urgency IN ('critical', 'high') THEN mr.id END) as highPriorityRequests
FROM properties p
LEFT JOIN apartment_units au ON p.id = au.property
LEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now')
LEFT JOIN bills b ON t.id = b.tenancy
LEFT JOIN bill_items bi ON b.id = bi.bill
LEFT JOIN maintenance_requests mr ON au.id = mr.unit AND mr.status != 'completed'
GROUP BY p.id, p.address
ORDER BY p.address;
```

### Tenant Financial Overview Table
Complete financial profile per tenant.

```sql
SELECT 
  tn.id,
  u.username,
  u.firstName,
  u.lastName,
  u.email,
  tn.phoneNumber,
  COUNT(DISTINCT t.id) as totalUnitsRented,
  COUNT(DISTINCT b.id) as totalBills,
  (ROUND(SUM(bi.amount), 2)) as totalBilled,
  (ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END), 2)) as totalPaid,
  (ROUND(SUM(CASE WHEN b.status IN ('pending', 'overdue') THEN bi.amount ELSE 0 END), 2)) as outstandingBalance,
  (ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END) * 100.0 / NULLIF(SUM(bi.amount), 0), 2)) as paymentRatePercentage
FROM tenants tn
LEFT JOIN users u ON tn.user = u.id
LEFT JOIN tenancies t ON tn.id = t.tenant
LEFT JOIN bills b ON t.id = b.tenancy
LEFT JOIN bill_items bi ON b.id = bi.bill
LEFT JOIN payments p ON b.id = p.bill
GROUP BY tn.id, u.username, u.firstName, u.lastName, u.email, tn.phoneNumber
ORDER BY outstandingBalance DESC;
```
