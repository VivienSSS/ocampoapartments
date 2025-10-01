# Permissions Model for Ocampo Apartments

Below is a breakdown of each entity/collection in the system, the permissions
for each actor (role), and a brief explanation. Roles: `admin`
(Administrator/Building Admin), `tenant` (Tenant).

## users [admin: read,write,delete]

- Admins can create, update, deactivate, and delete user accounts. Tenants
  cannot access or modify user accounts directly.

## tenants [admin: read,write,delete; tenant: read]

- Admins manage all tenant records, including creation, updates, and deletion.
  Tenants can only view their own tenant profile.

## properties [admin: read,write,delete]

- Admins can create, update, and delete property records. Tenants can only view
  properties through available units, not directly.

## apartment_units [admin: read,write,delete; tenant: read]

- Admins manage all apartment units. Tenants can view available units but cannot
  modify them.

## tenancies [admin: read,write,delete; tenant: read]

- Admins create, update, and delete tenancy records. Tenants can view their own
  tenancy details.

## bills [admin: read,write,delete; tenant: read]

- Admins generate, update, and delete bills. Tenants can view their own bills.

## bill_items [admin: read,write,delete; tenant: read]

- Admins manage bill items for each bill. Tenants can view the breakdown of
  their own bills.

## payments [admin: read,write,delete; tenant: read,write]

- Admins can view, update, and delete all payment records. Tenants can create
  (submit) and view their own payments, but cannot update or delete them after
  submission.

## maintenance_workers [admin: read,write,delete]

- Admins manage maintenance worker records for assignment and record-keeping.
  Tenants have no access.

## maintenance_requests [admin: read,write,delete; tenant: read,write]

- Admins can view, update, and delete all maintenance requests. Tenants can
  create (submit) and view their own requests, but cannot update or delete them
  after submission.

## announcements [admin: read,write,delete; tenant: read]

- Admins create, update, and delete announcements. Tenants can only view
  announcements.
