/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Announcements = "announcements",
	ApartmentUnits = "apartment_units",
	BillItems = "bill_items",
	Bills = "bills",
	MaintenanceRequests = "maintenance_requests",
	MaintenanceWorkers = "maintenance_workers",
	Payments = "payments",
	Properties = "properties",
	Tenancies = "tenancies",
	Tenants = "tenants",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AnnouncementsRecord = {
	author: RecordIdString
	created?: IsoDateString
	id: string
	message: HTMLString
	title: string
	updated?: IsoDateString
}

export type ApartmentUnitsRecord = {
	capacity?: number
	created?: IsoDateString
	floorNumber: number
	id: string
	isAvailable?: boolean
	price?: number
	property: RecordIdString
	unitLetter: string
	updated?: IsoDateString
}

export enum BillItemsChargeTypeOptions {
	"Rent" = "Rent",
	"Water" = "Water",
	"Electricity" = "Electricity",
}
export type BillItemsRecord = {
	amount?: number
	bill: RecordIdString
	chargeType: BillItemsChargeTypeOptions
	created?: IsoDateString
	description: HTMLString
	id: string
	updated?: IsoDateString
}

export enum BillsStatusOptions {
	"Paid" = "Paid",
	"Due" = "Due",
	"Overdue" = "Overdue",
}
export type BillsRecord = {
	created?: IsoDateString
	dueDate: IsoDateString
	id: string
	status: BillsStatusOptions
	tenancy: RecordIdString
	updated?: IsoDateString
}

export enum MaintenanceRequestsUrgencyOptions {
	"Urgent" = "Urgent",
	"Normal" = "Normal",
	"Low" = "Low",
}

export enum MaintenanceRequestsStatusOptions {
	"Pending" = "Pending",
	"Acknowledged" = "Acknowledged",
	"Completed" = "Completed",
}
export type MaintenanceRequestsRecord = {
	completedDate?: IsoDateString
	created?: IsoDateString
	description: HTMLString
	id: string
	progressImage?: string[]
	status: MaintenanceRequestsStatusOptions
	submittedDate: IsoDateString
	tenant: RecordIdString
	unit: RecordIdString
	updated?: IsoDateString
	urgency: MaintenanceRequestsUrgencyOptions
	worker: RecordIdString
}

export type MaintenanceWorkersRecord = {
	contactDetails: HTMLString
	created?: IsoDateString
	id: string
	isAvailable?: boolean
	name: string
	updated?: IsoDateString
}

export enum PaymentsPaymentMethodOptions {
	"Over the counter" = "Over the counter",
	"GCash" = "GCash",
}
export type PaymentsRecord = {
	amountPaid?: number
	bill: RecordIdString
	created?: IsoDateString
	id: string
	paymentDate: IsoDateString
	paymentMethod: PaymentsPaymentMethodOptions
	screenshot: string
	tenant: RecordIdString
	transactionId: string
	updated?: IsoDateString
}

export enum PropertiesBranchOptions {
	"Quezon City" = "Quezon City",
	"Pampanga" = "Pampanga",
}
export type PropertiesRecord = {
	address: HTMLString
	branch: PropertiesBranchOptions
	created?: IsoDateString
	id: string
	updated?: IsoDateString
}

export type TenanciesRecord = {
	created?: IsoDateString
	id: string
	leaseEndDate: IsoDateString
	leaseStartDate: IsoDateString
	tenant: RecordIdString
	unit: RecordIdString
	updated?: IsoDateString
}

export type TenantsRecord = {
	created?: IsoDateString
	facebookName: string
	id: string
	phoneNumber?: number
	updated?: IsoDateString
	user: RecordIdString
}

export enum UsersRoleOptions {
	"Administrator" = "Administrator",
	"Building Admin" = "Building Admin",
	"Tenant" = "Tenant",
}
export type UsersRecord = {
	contactEmail: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	firstName: string
	id: string
	isActive?: boolean
	lastName: string
	password: string
	role: UsersRoleOptions
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AnnouncementsResponse<Texpand = unknown> = Required<AnnouncementsRecord> & BaseSystemFields<Texpand>
export type ApartmentUnitsResponse<Texpand = unknown> = Required<ApartmentUnitsRecord> & BaseSystemFields<Texpand>
export type BillItemsResponse<Texpand = unknown> = Required<BillItemsRecord> & BaseSystemFields<Texpand>
export type BillsResponse<Texpand = unknown> = Required<BillsRecord> & BaseSystemFields<Texpand>
export type MaintenanceRequestsResponse<Texpand = unknown> = Required<MaintenanceRequestsRecord> & BaseSystemFields<Texpand>
export type MaintenanceWorkersResponse<Texpand = unknown> = Required<MaintenanceWorkersRecord> & BaseSystemFields<Texpand>
export type PaymentsResponse<Texpand = unknown> = Required<PaymentsRecord> & BaseSystemFields<Texpand>
export type PropertiesResponse<Texpand = unknown> = Required<PropertiesRecord> & BaseSystemFields<Texpand>
export type TenanciesResponse<Texpand = unknown> = Required<TenanciesRecord> & BaseSystemFields<Texpand>
export type TenantsResponse<Texpand = unknown> = Required<TenantsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	announcements: AnnouncementsRecord
	apartment_units: ApartmentUnitsRecord
	bill_items: BillItemsRecord
	bills: BillsRecord
	maintenance_requests: MaintenanceRequestsRecord
	maintenance_workers: MaintenanceWorkersRecord
	payments: PaymentsRecord
	properties: PropertiesRecord
	tenancies: TenanciesRecord
	tenants: TenantsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	announcements: AnnouncementsResponse
	apartment_units: ApartmentUnitsResponse
	bill_items: BillItemsResponse
	bills: BillsResponse
	maintenance_requests: MaintenanceRequestsResponse
	maintenance_workers: MaintenanceWorkersResponse
	payments: PaymentsResponse
	properties: PropertiesResponse
	tenancies: TenanciesResponse
	tenants: TenantsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'announcements'): RecordService<AnnouncementsResponse>
	collection(idOrName: 'apartment_units'): RecordService<ApartmentUnitsResponse>
	collection(idOrName: 'bill_items'): RecordService<BillItemsResponse>
	collection(idOrName: 'bills'): RecordService<BillsResponse>
	collection(idOrName: 'maintenance_requests'): RecordService<MaintenanceRequestsResponse>
	collection(idOrName: 'maintenance_workers'): RecordService<MaintenanceWorkersResponse>
	collection(idOrName: 'payments'): RecordService<PaymentsResponse>
	collection(idOrName: 'properties'): RecordService<PropertiesResponse>
	collection(idOrName: 'tenancies'): RecordService<TenanciesResponse>
	collection(idOrName: 'tenants'): RecordService<TenantsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
