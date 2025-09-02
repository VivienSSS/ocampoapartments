import { faker } from '@faker-js/faker';
import PocketBase from 'pocketbase';
import {
  type AnnouncementsResponse,
  type ApartmentUnitsResponse,
  BillItemsChargeTypeOptions,
  type BillsResponse,
  BillsStatusOptions,
  Collections,
  type MaintenanceRequestsResponse,
  MaintenanceRequestsStatusOptions,
  MaintenanceRequestsUrgencyOptions,
  type MaintenanceWorkersResponse,
  PaymentsPaymentMethodOptions,
  type PaymentsResponse,
  PropertiesBranchOptions,
  type PropertiesResponse,
  type TenanciesResponse,
  type TenantsResponse,
  type UsersResponse,
  UsersRoleOptions,
} from '../src/pocketbase/types';

const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || '';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'Please set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables',
  );
  process.exit(1);
}

const pb = new PocketBase('http://127.0.0.1:8090');

async function seedProperties(count: number = 2) {
  console.log('Seeding properties...');
  const properties: PropertiesResponse[] = [];

  for (let i = 0; i < count; i++) {
    const property = await pb.collection(Collections.Properties).create({
      branch: faker.helpers.arrayElement(
        Object.values(PropertiesBranchOptions),
      ),
      address: faker.location.streetAddress(true),
    });
    properties.push(property as PropertiesResponse);
  }

  return properties;
}

async function seedApartments(
  properties: PropertiesResponse[],
  unitsPerProperty: number = 5,
) {
  console.log('Seeding apartments...');
  const apartments: ApartmentUnitsResponse[] = [];

  for (const property of properties) {
    for (let i = 0; i < unitsPerProperty; i++) {
      const apartment = await pb.collection(Collections.ApartmentUnits).create({
        property: property.id,
        floorNumber: String(faker.number.int({ min: 1, max: 5 })),
        unitLetter: String.fromCharCode(65 + (i % 4)), // A, B, C, D
        capacity: faker.number.int({ min: 1, max: 4 }),
        price: faker.number.int({ min: 5000, max: 15000 }),
      });
      apartments.push(apartment as ApartmentUnitsResponse);
    }
  }

  return apartments;
}

async function seedUsers(count: number = 10) {
  console.log('Seeding users...');
  const users: UsersResponse[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = 'password123';

    const user = await pb.collection(Collections.Users).create({
      email,
      password,
      passwordConfirm: password,
      username: faker.internet.username(),
      firstName,
      lastName,
      role: UsersRoleOptions.Tenant,
      isActive: true,
    });
    users.push(user as UsersResponse);
  }

  return users;
}

async function seedTenants(users: UsersResponse[]) {
  console.log('Seeding tenants...');
  const tenants: TenantsResponse[] = [];

  for (const user of users) {
    const tenant = await pb.collection(Collections.Tenants).create({
      user: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: faker.phone.number({ style: 'international' }),
      facebookName: faker.internet.username(),
    });
    tenants.push(tenant as TenantsResponse);
  }

  return tenants;
}

async function seedTenancies(
  tenants: TenantsResponse[],
  apartments: ApartmentUnitsResponse[],
) {
  console.log('Seeding tenancies...');
  const tenancies: TenanciesResponse[] = [];

  // Assign random apartments to tenants
  for (const tenant of tenants) {
    const apartment = faker.helpers.arrayElement(apartments);
    const startDate = faker.date.between({
      from: '2024-01-01T00:00:00.000Z',
      to: '2025-12-31T00:00:00.000Z',
    });

    const tenancy = await pb.collection(Collections.Tenancies).create({
      tenant: tenant.id,
      unit: apartment.id,
      leaseStartDate: startDate.toISOString(),
      leaseEndDate: faker.date
        .future({ years: 1, refDate: startDate })
        .toISOString(),
    });
    tenancies.push(tenancy as TenanciesResponse);
  }

  return tenancies;
}

async function seedMaintenanceWorkers(count: number = 5) {
  console.log('Seeding maintenance workers...');
  const workers: MaintenanceWorkersResponse[] = [];

  for (let i = 0; i < count; i++) {
    const worker = await pb.collection(Collections.MaintenanceWorkers).create({
      name: faker.person.fullName(),
      contactDetails: `09${faker.string.numeric(8)}`,
      isAvailable: faker.datatype.boolean(),
    });
    workers.push(worker as MaintenanceWorkersResponse);
  }

  return workers;
}

async function seedMaintenanceRequests(
  tenancies: TenanciesResponse[],
  workers: MaintenanceWorkersResponse[],
  count: number = 15,
) {
  console.log('Seeding maintenance requests...');
  const requests: MaintenanceRequestsResponse[] = [];

  for (let i = 0; i < count; i++) {
    const tenancy = faker.helpers.arrayElement(tenancies);
    const submittedDate = faker.date.recent({ days: 30 });

    const request = await pb
      .collection(Collections.MaintenanceRequests)
      .create({
        tenant: tenancy.tenant,
        unit: tenancy.unit,
        worker: faker.helpers.arrayElement(workers).id,
        description: faker.lorem.paragraph(),
        urgency: faker.helpers.arrayElement(
          Object.values(MaintenanceRequestsUrgencyOptions),
        ),
        status: faker.helpers.arrayElement(
          Object.values(MaintenanceRequestsStatusOptions),
        ),
        submittedDate: submittedDate.toISOString(),
        completedDate: faker.date
          .future({ years: 0.1, refDate: submittedDate })
          .toISOString(),
      });
    requests.push(request as MaintenanceRequestsResponse);
  }

  return requests;
}

async function seedBills(tenancies: TenanciesResponse[], count: number = 30) {
  console.log('Seeding bills...');
  const bills: BillsResponse[] = [];

  for (let i = 0; i < count; i++) {
    const tenancy = faker.helpers.arrayElement(tenancies);
    const dueDate = faker.date.soon({ days: 30 });
    const status = faker.helpers.arrayElement(
      Object.values(BillsStatusOptions),
    );
    let totalAmount = 0;

    const bill = await pb.collection(Collections.Bills).create({
      tenancy: tenancy.id,
      dueDate: dueDate.toISOString(),
      status: status,
    });

    // Create 2-4 bill items for each bill
    const itemCount = faker.number.int({ min: 2, max: 4 });
    for (let j = 0; j < itemCount; j++) {
      const amount = faker.number.int({ min: 1000, max: 5000 });
      totalAmount += amount;
      await pb.collection(Collections.BillItems).create({
        bill: bill.id,
        chargeType: faker.helpers.arrayElement(
          Object.values(BillItemsChargeTypeOptions),
        ),
        amount: amount,
        description: faker.lorem.sentence(),
      });
    }

    // Update the bill with the total amount
    const updatedBill = await pb.collection(Collections.Bills).update(bill.id, {
      totalAmount: totalAmount,
    });

    bills.push(updatedBill as BillsResponse);
  }

  return bills;
}

async function seedPayments(
  bills: BillsResponse[],
  tenants: TenantsResponse[],
) {
  console.log('Seeding payments...');
  const payments: PaymentsResponse[] = [];

  for (const bill of bills) {
    // Only create payments for bills that are marked as paid
    if (bill.status === BillsStatusOptions.Paid) {
      try {
        // Get the tenancy details to find the tenant
        const billDetails = await pb
          .collection(Collections.Bills)
          .getOne(bill.id, {
            expand: 'tenancy.tenant',
          });

        // Get the tenant from the expanded data or pick a random one
        const tenantId =
          billDetails.expand?.tenancy?.tenant?.id ||
          faker.helpers.arrayElement(tenants).id;

        const payment = await pb.collection(Collections.Payments).create({
          bill: bill.id,
          tenant: tenantId,
          amountPaid: faker.number.int({ min: 5000, max: 15000 }),
          paymentDate: faker.date.recent({ days: 10 }).toISOString(),
          paymentMethod: faker.helpers.arrayElement(
            Object.values(PaymentsPaymentMethodOptions),
          ),
          transactionId: faker.string.alphanumeric(10).toUpperCase(),
          screenshot: null, // Set to null instead of empty string
        });
        payments.push(payment as PaymentsResponse);

        // Update the bill status to Paid if it's not already
        await pb.collection(Collections.Bills).update(bill.id, {
          status: BillsStatusOptions.Paid,
        });
      } catch (error) {
        console.error(`Error creating payment for bill ${bill.id}:`, error);
      }
    }
  }

  return payments;
}

async function seedAnnouncements(count: number = 10) {
  console.log('Seeding announcements...');
  const announcements: AnnouncementsResponse[] = [];

  for (let i = 0; i < count; i++) {
    const announcement = await pb.collection(Collections.Announcements).create({
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraphs(2),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      author: pb.authStore.model?.id || '', // Use the authenticated admin's ID
    });
    announcements.push(announcement as AnnouncementsResponse);
  }

  return announcements;
}

async function main() {
  try {
    // Authenticate as admin
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    // Seed in order
    const properties = await seedProperties();
    const apartments = await seedApartments(properties);
    const users = await seedUsers();
    const tenants = await seedTenants(users);
    const tenancies = await seedTenancies(tenants, apartments);
    const workers = await seedMaintenanceWorkers();
    await seedMaintenanceRequests(tenancies, workers);
    const bills = await seedBills(tenancies);
    await seedPayments(bills, tenants);
    await seedAnnouncements();

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();
