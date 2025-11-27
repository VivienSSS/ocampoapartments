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
	Emails = "emails",
	Forms = "forms",
	Inquiries = "inquiries",
	MaintenanceRequests = "maintenance_requests",
	MaintenanceWorkers = "maintenance_workers",
	Otp = "otp",
	Payments = "payments",
	Properties = "properties",
	Schedules = "schedules",
	Tenancies = "tenancies",
	Tenants = "tenants",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
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
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AnnouncementsRecord = {
	author: RecordIdString
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	message?: string
	title: string
	updated: IsoAutoDateString
}

export type ApartmentUnitsRecord = {
	capacity: number
	carouselImage?: FileNameString[]
	created: IsoAutoDateString
	floorNumber: number
	id: string
	image?: FileNameString
	isAvailable?: boolean
	price: number
	property: RecordIdString
	roomSize?: number
	unitLetter: string
	updated: IsoAutoDateString
}

export enum BillItemsChargeTypeOptions {
	"Rent" = "Rent",
	"Water" = "Water",
}
export type BillItemsRecord = {
	amount?: number
	chargeType: BillItemsChargeTypeOptions
	created: IsoAutoDateString
	description: HTMLString
	id: string
	updated: IsoAutoDateString
}

export enum BillsStatusOptions {
	"Paid" = "Paid",
	"Due" = "Due",
	"Overdue" = "Overdue",
	"Draft" = "Draft",
}
export type BillsRecord = {
	created: IsoAutoDateString
	dueDate: IsoDateString
	hasSent?: boolean
	id: string
	invoiceNumber?: string
	items?: RecordIdString[]
	status: BillsStatusOptions
	tenancy: RecordIdString
	updated: IsoAutoDateString
}

export type EmailsRecord = {
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	message: string
	subject?: string
	to: string
	updated: IsoAutoDateString
}

export enum FormsCollectionOptions {
	"announcements" = "announcements",
	"properties" = "properties",
	"inquiries" = "inquiries",
	"apartment_units" = "apartment_units",
	"tenants" = "tenants",
	"tenancies" = "tenancies",
	"billing" = "billing",
	"payments" = "payments",
	"maintenance_workers" = "maintenance_workers",
	"maintenance_requests" = "maintenance_requests",
}

export enum FormsOperationOptions {
	"create" = "create",
	"update" = "update",
}

export enum FormsTypeOptions {
	"text" = "text",
	"email" = "email",
	"select" = "select",
	"textarea" = "textarea",
	"url" = "url",
	"bool" = "bool",
	"number" = "number",
	"relation" = "relation",
	"file" = "file",
	"date" = "date",
}

export enum FormsOrientationOptions {
	"vertical" = "vertical",
	"horizontal" = "horizontal",
	"responsive" = "responsive",
}
export type FormsRecord<Tconfig = unknown> = {
	collection?: FormsCollectionOptions
	config?: null | Tconfig
	created: IsoAutoDateString
	description?: string
	id: string
	label?: string
	name: string
	operation?: FormsOperationOptions[]
	order: number
	orientation?: FormsOrientationOptions
	separator?: boolean
	tooltip?: string
	type: FormsTypeOptions
	updated: IsoAutoDateString
}

export enum InquiriesStatusOptions {
	"pending" = "pending",
	"approved" = "approved",
	"rejected" = "rejected",
}
export type InquiriesRecord = {
	age: number
	created: IsoAutoDateString
	email: string
	emailVerified?: boolean
	firstName: string
	hasSent?: boolean
	id: string
	lastName: string
	message?: HTMLString
	numberOfOccupants: number
	phone?: string
	rejectionReason?: string
	status?: InquiriesStatusOptions
	unitInterested?: RecordIdString
	updated: IsoAutoDateString
	verifiedAt?: IsoDateString
}

export enum MaintenanceRequestsUrgencyOptions {
	"Urgent" = "Urgent",
	"Normal" = "Normal",
	"Low" = "Low",
}

export enum MaintenanceRequestsStatusOptions {
	"Pending" = "Pending",
	"Worker Assigned" = "Worker Assigned",
	"In Progress" = "In Progress",
	"Completed" = "Completed",
	"Cancelled" = "Cancelled",
}
export type MaintenanceRequestsRecord = {
	completedDate?: IsoDateString
	created: IsoAutoDateString
	description: HTMLString
	id: string
	status?: MaintenanceRequestsStatusOptions
	submittedDate?: IsoDateString
	tenant: RecordIdString
	unit: RecordIdString
	updated: IsoAutoDateString
	urgency: MaintenanceRequestsUrgencyOptions
	worker?: RecordIdString
}

export type MaintenanceWorkersRecord = {
	contactDetails: HTMLString
	created: IsoAutoDateString
	id: string
	isAvailable?: boolean
	name: string
	updated: IsoAutoDateString
}

export type OtpRecord = {
	attemptCount?: number
	code: string
	created: IsoAutoDateString
	expiresAt: IsoDateString
	hasSent?: boolean
	id: string
	inquiry: RecordIdString
	sentAt?: IsoDateString
	updated: IsoAutoDateString
	verifiedAt?: IsoDateString
}

export enum PaymentsPaymentMethodOptions {
	"GCash" = "GCash",
}

export enum PaymentsPaymentTypeOptions {
	"Refund" = "Refund",
	"Transaction" = "Transaction",
}
export type PaymentsRecord = {
	amountPaid?: number
	bill: RecordIdString
	created: IsoAutoDateString
	id: string
	isVerified?: boolean
	paymentDate: IsoDateString
	paymentMethod: PaymentsPaymentMethodOptions
	paymentType?: PaymentsPaymentTypeOptions
	screenshot: FileNameString
	tenant: RecordIdString
	transactionId: string
	updated: IsoAutoDateString
}

export enum PropertiesBranchOptions {
	"Quezon City" = "Quezon City",
	"Pampanga" = "Pampanga",
}
export type PropertiesRecord = {
	address: string
	branch: PropertiesBranchOptions
	created: IsoAutoDateString
	id: string
	updated: IsoAutoDateString
}

export enum SchedulesReasonOptions {
	"visit" = "visit",
	"meeting" = "meeting",
}
export type SchedulesRecord = {
	created: IsoAutoDateString
	date: IsoDateString
	id: string
	isApproved?: boolean
	isCancelled?: boolean
	message: string
	reason: SchedulesReasonOptions
	tenant: RecordIdString
	updated: IsoAutoDateString
}

export type TenanciesRecord = {
	contractDocument?: FileNameString
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	leaseEndDate: IsoDateString
	leaseStartDate: IsoDateString
	tenant: RecordIdString
	unit: RecordIdString
	updated: IsoAutoDateString
}

export type TenantsRecord = {
	created: IsoAutoDateString
	facebookName?: string
	id: string
	phoneNumber?: number
	updated: IsoAutoDateString
	user: RecordIdString
}

export enum UsersRoleOptions {
	"Administrator" = "Administrator",
	"Building Admin" = "Building Admin",
	"Tenant" = "Tenant",
	"Applicant" = "Applicant",
}
export type UsersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	firstName: string
	firstTimeUser?: boolean
	id: string
	isAccepted?: boolean
	isActive?: boolean
	isRejected?: boolean
	lastName: string
	password: string
	rejectionReason?: HTMLString
	role: UsersRoleOptions
	tokenKey: string
	updated: IsoAutoDateString
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
export type EmailsResponse<Texpand = unknown> = Required<EmailsRecord> & BaseSystemFields<Texpand>
export type FormsResponse<Tconfig = unknown, Texpand = unknown> = Required<FormsRecord<Tconfig>> & BaseSystemFields<Texpand>
export type InquiriesResponse<Texpand = unknown> = Required<InquiriesRecord> & BaseSystemFields<Texpand>
export type MaintenanceRequestsResponse<Texpand = unknown> = Required<MaintenanceRequestsRecord> & BaseSystemFields<Texpand>
export type MaintenanceWorkersResponse<Texpand = unknown> = Required<MaintenanceWorkersRecord> & BaseSystemFields<Texpand>
export type OtpResponse<Texpand = unknown> = Required<OtpRecord> & BaseSystemFields<Texpand>
export type PaymentsResponse<Texpand = unknown> = Required<PaymentsRecord> & BaseSystemFields<Texpand>
export type PropertiesResponse<Texpand = unknown> = Required<PropertiesRecord> & BaseSystemFields<Texpand>
export type SchedulesResponse<Texpand = unknown> = Required<SchedulesRecord> & BaseSystemFields<Texpand>
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
	emails: EmailsRecord
	forms: FormsRecord
	inquiries: InquiriesRecord
	maintenance_requests: MaintenanceRequestsRecord
	maintenance_workers: MaintenanceWorkersRecord
	otp: OtpRecord
	payments: PaymentsRecord
	properties: PropertiesRecord
	schedules: SchedulesRecord
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
	emails: EmailsResponse
	forms: FormsResponse
	inquiries: InquiriesResponse
	maintenance_requests: MaintenanceRequestsResponse
	maintenance_workers: MaintenanceWorkersResponse
	otp: OtpResponse
	payments: PaymentsResponse
	properties: PropertiesResponse
	schedules: SchedulesResponse
	tenancies: TenanciesResponse
	tenants: TenantsResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
