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
	ActiveTenanciesChartView = "active_tenancies_chart_view",
	Announcements = "announcements",
	ApartmentUnits = "apartment_units",
	BillItemAnalysisStatCardKpiView = "bill_item_analysis_stat_card_kpi_view",
	BillItems = "bill_items",
	Bills = "bills",
	BillsByStatusChartView = "bills_by_status_chart_view",
	FinancialStatCardKpiView = "financial_stat_card_kpi_view",
	HighPriorityUnresolvedRequestsStatCardKpiView = "high_priority_unresolved_requests_stat_card_kpi_view",
	Inquiry = "inquiry",
	MaintenanceOperationStatCardKpiView = "maintenance_operation_stat_card_kpi_view",
	MaintenanceRequestOverviewStatCardKpiView = "maintenance_request_overview_stat_card_kpi_view",
	MaintenanceRequestStatusStatCardKpiView = "maintenance_request_status_stat_card_kpi_view",
	MaintenanceRequests = "maintenance_requests",
	MaintenanceWorkers = "maintenance_workers",
	MonthlyRevenueTrendStatCardKpiView = "monthly_revenue_trend_stat_card_kpi_view",
	Otp = "otp",
	OutstandingReceivablesChartView = "outstanding_receivables_chart_view",
	PaymentMethodsDistributionChartView = "payment_methods_distribution_chart_view",
	Payments = "payments",
	PorfolioStatCardKpiView = "porfolio_stat_card_kpi_view",
	Properties = "properties",
	PropertyHealthDashboardChartView = "property_health_dashboard_chart_view",
	PropertySummaryChartView = "property_summary_chart_view",
	RecentAnnouncementsChartView = "recent_announcements_chart_view",
	RevenuePerPropertyChartView = "revenue_per_property_chart_view",
	Tenancies = "tenancies",
	TenancyHealthChartView = "tenancy_health_chart_view",
	TenantFinancialOverviewChartView = "tenant_financial_overview_chart_view",
	Tenants = "tenants",
	TenantsPerPropertyChartView = "tenants_per_property_chart_view",
	UnitInventoryChartView = "unit_inventory_chart_view",
	UnitPriceChartView = "unit_price_chart_view",
	Users = "users",
	WorkerPerformanceChartView = "worker_performance_chart_view",
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

export type ActiveTenanciesChartViewRecord<TleaseStatus = unknown> = {
	created: IsoAutoDateString
	firstName: string
	floorNumber: number
	id: string
	lastName: string
	leaseEndDate: IsoDateString
	leaseStartDate: IsoDateString
	leaseStatus?: null | TleaseStatus
	property: HTMLString
	tenantId?: RecordIdString
	tenantUsername: string
	unitLetter: string
	updated: IsoAutoDateString
}

export type AnnouncementsRecord = {
	author: RecordIdString
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	message: HTMLString
	title: string
	updated: IsoAutoDateString
}

export type ApartmentUnitsRecord = {
	capacity: number
	carousel_image?: FileNameString[]
	created: IsoAutoDateString
	floorNumber: number
	id: string
	image?: FileNameString
	isAvailable?: boolean
	price: number
	property: RecordIdString
	room_size?: string
	unitLetter: string
	updated: IsoAutoDateString
}

export enum BillItemAnalysisStatCardKpiViewChargeTypeOptions {
	"Rent" = "Rent",
	"Water" = "Water",
}
export type BillItemAnalysisStatCardKpiViewRecord<TavgAmount = unknown, TpercentageOfTotal = unknown, TtotalAmount = unknown> = {
	avgAmount?: null | TavgAmount
	billCount?: number
	chargeType: BillItemAnalysisStatCardKpiViewChargeTypeOptions
	id: string
	itemCount?: number
	percentageOfTotal?: null | TpercentageOfTotal
	totalAmount?: null | TtotalAmount
}

export enum BillItemsChargeTypeOptions {
	"Rent" = "Rent",
	"Water" = "Water",
}
export type BillItemsRecord = {
	amount?: number
	bill: RecordIdString
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
}
export type BillsRecord = {
	created: IsoAutoDateString
	dueDate: IsoDateString
	hasSent?: boolean
	id: string
	status: BillsStatusOptions
	tenancy: RecordIdString
	updated: IsoAutoDateString
}

export enum BillsByStatusChartViewStatusOptions {
	"Paid" = "Paid",
	"Due" = "Due",
	"Overdue" = "Overdue",
}
export type BillsByStatusChartViewRecord<TavgAmount = unknown, TtotalAmount = unknown> = {
	avgAmount?: null | TavgAmount
	billCount?: number
	id: string
	overdueCount?: number
	status: BillsByStatusChartViewStatusOptions
	tenanciesAffected?: number
	totalAmount?: null | TtotalAmount
}

export type FinancialStatCardKpiViewRecord<Tpayment_collection_rate = unknown, Ttotal_bill_amount = unknown, Ttotal_outstanding = unknown, Ttotal_paid = unknown, Ttotal_received = unknown> = {
	id: string
	overdue_bills?: number
	paid_bills?: number
	payment_collection_rate?: null | Tpayment_collection_rate
	pending_bills?: number
	total_bill_amount?: null | Ttotal_bill_amount
	total_bills?: number
	total_outstanding?: null | Ttotal_outstanding
	total_paid?: null | Ttotal_paid
	total_received?: null | Ttotal_received
}

export enum HighPriorityUnresolvedRequestsStatCardKpiViewUrgencyOptions {
	"Urgent" = "Urgent",
	"Normal" = "Normal",
	"Low" = "Low",
}

export enum HighPriorityUnresolvedRequestsStatCardKpiViewStatusOptions {
	"Pending" = "Pending",
	"Worker Assigned" = "Worker Assigned",
	"In Progress" = "In Progress",
	"Completed" = "Completed",
}
export type HighPriorityUnresolvedRequestsStatCardKpiViewRecord<TdaysOpen = unknown, TpriorityLabel = unknown> = {
	assignedWorker: string
	contactEmail: string
	daysOpen?: null | TdaysOpen
	description: HTMLString
	firstName: string
	id: string
	lastName: string
	phoneNumber?: number
	priorityLabel?: null | TpriorityLabel
	property: HTMLString
	status?: HighPriorityUnresolvedRequestsStatCardKpiViewStatusOptions
	submittedDate?: IsoDateString
	tenantId?: RecordIdString
	unitLetter: string
	urgency: HighPriorityUnresolvedRequestsStatCardKpiViewUrgencyOptions
}

export enum InquiryStatusOptions {
	"pending" = "pending",
	"verified" = "verified",
	"approved" = "approved",
	"rejected" = "rejected",
}
export type InquiryRecord = {
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
	status?: InquiryStatusOptions
	updated: IsoAutoDateString
	verifiedAt?: IsoDateString
}

export type MaintenanceOperationStatCardKpiViewRecord = {
	available_workers?: number
	completed_requests?: number
	critical_pending?: number
	id: string
	pending_requests?: number
	total_requests?: number
	total_workers?: number
}

export enum MaintenanceRequestOverviewStatCardKpiViewStatusOptions {
	"Pending" = "Pending",
	"Worker Assigned" = "Worker Assigned",
	"In Progress" = "In Progress",
	"Completed" = "Completed",
}

export enum MaintenanceRequestOverviewStatCardKpiViewUrgencyOptions {
	"Urgent" = "Urgent",
	"Normal" = "Normal",
	"Low" = "Low",
}
export type MaintenanceRequestOverviewStatCardKpiViewRecord<TassignmentRate = unknown, TavgCompletionDays = unknown> = {
	assignedCount?: number
	assignmentRate?: null | TassignmentRate
	avgCompletionDays?: null | TavgCompletionDays
	id: string
	requestCount?: number
	status?: MaintenanceRequestOverviewStatCardKpiViewStatusOptions
	urgency: MaintenanceRequestOverviewStatCardKpiViewUrgencyOptions
}

export enum MaintenanceRequestStatusStatCardKpiViewStatusOptions {
	"Pending" = "Pending",
	"Worker Assigned" = "Worker Assigned",
	"In Progress" = "In Progress",
	"Completed" = "Completed",
}
export type MaintenanceRequestStatusStatCardKpiViewRecord<TavgResolutionDays = unknown> = {
	avgResolutionDays?: null | TavgResolutionDays
	id: string
	pendingCount?: number
	status?: MaintenanceRequestStatusStatCardKpiViewStatusOptions
	totalRequests?: number
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
}
export type MaintenanceRequestsRecord = {
	completedDate?: IsoDateString
	created: IsoAutoDateString
	description: HTMLString
	hasSent?: boolean
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

export type MonthlyRevenueTrendStatCardKpiViewRecord<TavgPaymentSize = unknown, Tmonth = unknown, TmonthlyRevenue = unknown> = {
	avgPaymentSize?: null | TavgPaymentSize
	id: string
	month?: null | Tmonth
	monthlyRevenue?: null | TmonthlyRevenue
	paymentCount?: number
	uniqueTenants?: number
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

export type OutstandingReceivablesChartViewRecord<TmostRecentDueDate = unknown, TtotalOutstanding = unknown, TurgencyLevel = unknown> = {
	email: string
	firstName: string
	id: string
	lastName: string
	mostRecentDueDate?: null | TmostRecentDueDate
	phoneNumber?: number
	property: HTMLString
	totalOutstanding?: null | TtotalOutstanding
	unitLetter: string
	unpaidBills?: number
	urgencyLevel?: null | TurgencyLevel
}

export enum PaymentMethodsDistributionChartViewPaymentMethodOptions {
	"GCash" = "GCash",
}
export type PaymentMethodsDistributionChartViewRecord<TavgPaymentAmount = unknown, TpaymentMethodPercentage = unknown, TtotalAmountPaid = unknown> = {
	avgPaymentAmount?: null | TavgPaymentAmount
	id: string
	paymentCount?: number
	paymentMethod: PaymentMethodsDistributionChartViewPaymentMethodOptions
	paymentMethodPercentage?: null | TpaymentMethodPercentage
	totalAmountPaid?: null | TtotalAmountPaid
}

export enum PaymentsPaymentMethodOptions {
	"GCash" = "GCash",
}
export type PaymentsRecord = {
	amountPaid?: number
	bill: RecordIdString
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	paymentDate: IsoDateString
	paymentMethod: PaymentsPaymentMethodOptions
	screenshot: FileNameString
	tenant: RecordIdString
	transactionId: string
	updated: IsoAutoDateString
}

export type PorfolioStatCardKpiViewRecord<Toverall_occupancy_rate = unknown, Ttotal_monthly_potential_revenue = unknown> = {
	id: string
	occupied_units?: number
	overall_occupancy_rate?: null | Toverall_occupancy_rate
	total_active_tenants?: number
	total_monthly_potential_revenue?: null | Ttotal_monthly_potential_revenue
	total_properties?: number
	total_units?: number
}

export enum PropertiesBranchOptions {
	"Quezon City" = "Quezon City",
	"Pampanga" = "Pampanga",
}
export type PropertiesRecord = {
	address: HTMLString
	branch: PropertiesBranchOptions
	created: IsoAutoDateString
	id: string
	updated: IsoAutoDateString
}

export type PropertyHealthDashboardChartViewRecord<ToccupancyRate = unknown, ToutstandingAmount = unknown, TtotalMonthlyPotential = unknown> = {
	address: HTMLString
	highPriorityRequests?: number
	id: string
	occupancyRate?: null | ToccupancyRate
	occupiedUnits?: number
	openMaintenanceRequests?: number
	outstandingAmount?: null | ToutstandingAmount
	outstandingBills?: number
	totalBills?: number
	totalMonthlyPotential?: null | TtotalMonthlyPotential
	totalUnits?: number
}

export enum PropertySummaryChartViewBranchOptions {
	"Quezon City" = "Quezon City",
	"Pampanga" = "Pampanga",
}
export type PropertySummaryChartViewRecord<TavailableUnits = unknown, ToccupancyRate = unknown, ToccupiedUnits = unknown> = {
	address: HTMLString
	availableUnits?: null | TavailableUnits
	branch: PropertySummaryChartViewBranchOptions
	created: IsoAutoDateString
	id: string
	occupancyRate?: null | ToccupancyRate
	occupiedUnits?: null | ToccupiedUnits
	totalUnits?: number
	updated: IsoAutoDateString
}

export type RecentAnnouncementsChartViewRecord<TauthorName = unknown, TmessagePreview = unknown, Trecency = unknown> = {
	authorName?: null | TauthorName
	created: IsoAutoDateString
	email: string
	id: string
	messagePreview?: null | TmessagePreview
	recency?: null | Trecency
	title: string
	updated: IsoAutoDateString
}

export type RevenuePerPropertyChartViewRecord<TcurrentMonthlyRevenue = unknown, TrevenueUtilizationRate = unknown, TtotalPotentialMonthlyRevenue = unknown> = {
	address: HTMLString
	currentMonthlyRevenue?: null | TcurrentMonthlyRevenue
	id: string
	revenueUtilizationRate?: null | TrevenueUtilizationRate
	totalPotentialMonthlyRevenue?: null | TtotalPotentialMonthlyRevenue
	totalUnits?: number
}

export type TenanciesRecord = {
	created: IsoAutoDateString
	hasSent?: boolean
	id: string
	leaseEndDate: IsoDateString
	leaseStartDate: IsoDateString
	tenant: RecordIdString
	unit: RecordIdString
	updated: IsoAutoDateString
}

export type TenancyHealthChartViewRecord<Tavg_lease_duration_years = unknown> = {
	active_tenancies?: number
	avg_lease_duration_years?: null | Tavg_lease_duration_years
	expired_tenancies?: number
	expiring_soon?: number
	id: string
	total_tenancies?: number
}

export type TenantFinancialOverviewChartViewRecord<ToutstandingBalance = unknown, TpaymentRatePercentage = unknown, TtotalBilled = unknown, TtotalPaid = unknown> = {
	email: string
	firstName: string
	id: string
	lastName: string
	outstandingBalance?: null | ToutstandingBalance
	paymentRatePercentage?: null | TpaymentRatePercentage
	phoneNumber?: number
	totalBilled?: null | TtotalBilled
	totalBills?: number
	totalPaid?: null | TtotalPaid
	totalUnitsRented?: number
	username: string
}

export type TenantsRecord = {
	created: IsoAutoDateString
	facebookName?: string
	id: string
	phoneNumber?: number
	updated: IsoAutoDateString
	user: RecordIdString
}

export type TenantsPerPropertyChartViewRecord<ToccupancyPercentage = unknown> = {
	address: HTMLString
	id: string
	occupancyPercentage?: null | ToccupancyPercentage
	totalTenants?: number
	totalUnits?: number
}

export type UnitInventoryChartViewRecord<Tstatus = unknown> = {
	capacity: number
	created: IsoAutoDateString
	floorNumber: number
	id: string
	isAvailable?: boolean
	price: number
	propertyAddress: HTMLString
	status?: null | Tstatus
	unitLetter: string
	updated: IsoAutoDateString
}

export type UnitPriceChartViewRecord<TavgPrice = unknown, TmaxPrice = unknown, TminPrice = unknown, TtotalMonthlyPotential = unknown> = {
	avgPrice?: null | TavgPrice
	id: string
	maxPrice?: null | TmaxPrice
	minPrice?: null | TminPrice
	property: HTMLString
	totalMonthlyPotential?: null | TtotalMonthlyPotential
	unitCount?: number
}

export enum UsersRoleOptions {
	"Administrator" = "Administrator",
	"Building Admin" = "Building Admin",
	"Tenant" = "Tenant",
	"Applicant" = "Applicant",
}
export type UsersRecord = {
	contactEmail: string
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	firstName: string
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

export type WorkerPerformanceChartViewRecord<TavgResolutionDays = unknown, TcompletionRate = unknown> = {
	avgResolutionDays?: null | TavgResolutionDays
	completedJobs?: number
	completionRate?: null | TcompletionRate
	contactDetails: HTMLString
	id: string
	inProgressJobs?: number
	isAvailable?: boolean
	name: string
	totalAssignments?: number
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ActiveTenanciesChartViewResponse<TleaseStatus = unknown, Texpand = unknown> = Required<ActiveTenanciesChartViewRecord<TleaseStatus>> & BaseSystemFields<Texpand>
export type AnnouncementsResponse<Texpand = unknown> = Required<AnnouncementsRecord> & BaseSystemFields<Texpand>
export type ApartmentUnitsResponse<Texpand = unknown> = Required<ApartmentUnitsRecord> & BaseSystemFields<Texpand>
export type BillItemAnalysisStatCardKpiViewResponse<TavgAmount = unknown, TpercentageOfTotal = unknown, TtotalAmount = unknown, Texpand = unknown> = Required<BillItemAnalysisStatCardKpiViewRecord<TavgAmount, TpercentageOfTotal, TtotalAmount>> & BaseSystemFields<Texpand>
export type BillItemsResponse<Texpand = unknown> = Required<BillItemsRecord> & BaseSystemFields<Texpand>
export type BillsResponse<Texpand = unknown> = Required<BillsRecord> & BaseSystemFields<Texpand>
export type BillsByStatusChartViewResponse<TavgAmount = unknown, TtotalAmount = unknown, Texpand = unknown> = Required<BillsByStatusChartViewRecord<TavgAmount, TtotalAmount>> & BaseSystemFields<Texpand>
export type FinancialStatCardKpiViewResponse<Tpayment_collection_rate = unknown, Ttotal_bill_amount = unknown, Ttotal_outstanding = unknown, Ttotal_paid = unknown, Ttotal_received = unknown, Texpand = unknown> = Required<FinancialStatCardKpiViewRecord<Tpayment_collection_rate, Ttotal_bill_amount, Ttotal_outstanding, Ttotal_paid, Ttotal_received>> & BaseSystemFields<Texpand>
export type HighPriorityUnresolvedRequestsStatCardKpiViewResponse<TdaysOpen = unknown, TpriorityLabel = unknown, Texpand = unknown> = Required<HighPriorityUnresolvedRequestsStatCardKpiViewRecord<TdaysOpen, TpriorityLabel>> & BaseSystemFields<Texpand>
export type InquiryResponse<Texpand = unknown> = Required<InquiryRecord> & BaseSystemFields<Texpand>
export type MaintenanceOperationStatCardKpiViewResponse<Texpand = unknown> = Required<MaintenanceOperationStatCardKpiViewRecord> & BaseSystemFields<Texpand>
export type MaintenanceRequestOverviewStatCardKpiViewResponse<TassignmentRate = unknown, TavgCompletionDays = unknown, Texpand = unknown> = Required<MaintenanceRequestOverviewStatCardKpiViewRecord<TassignmentRate, TavgCompletionDays>> & BaseSystemFields<Texpand>
export type MaintenanceRequestStatusStatCardKpiViewResponse<TavgResolutionDays = unknown, Texpand = unknown> = Required<MaintenanceRequestStatusStatCardKpiViewRecord<TavgResolutionDays>> & BaseSystemFields<Texpand>
export type MaintenanceRequestsResponse<Texpand = unknown> = Required<MaintenanceRequestsRecord> & BaseSystemFields<Texpand>
export type MaintenanceWorkersResponse<Texpand = unknown> = Required<MaintenanceWorkersRecord> & BaseSystemFields<Texpand>
export type MonthlyRevenueTrendStatCardKpiViewResponse<TavgPaymentSize = unknown, Tmonth = unknown, TmonthlyRevenue = unknown, Texpand = unknown> = Required<MonthlyRevenueTrendStatCardKpiViewRecord<TavgPaymentSize, Tmonth, TmonthlyRevenue>> & BaseSystemFields<Texpand>
export type OtpResponse<Texpand = unknown> = Required<OtpRecord> & BaseSystemFields<Texpand>
export type OutstandingReceivablesChartViewResponse<TmostRecentDueDate = unknown, TtotalOutstanding = unknown, TurgencyLevel = unknown, Texpand = unknown> = Required<OutstandingReceivablesChartViewRecord<TmostRecentDueDate, TtotalOutstanding, TurgencyLevel>> & BaseSystemFields<Texpand>
export type PaymentMethodsDistributionChartViewResponse<TavgPaymentAmount = unknown, TpaymentMethodPercentage = unknown, TtotalAmountPaid = unknown, Texpand = unknown> = Required<PaymentMethodsDistributionChartViewRecord<TavgPaymentAmount, TpaymentMethodPercentage, TtotalAmountPaid>> & BaseSystemFields<Texpand>
export type PaymentsResponse<Texpand = unknown> = Required<PaymentsRecord> & BaseSystemFields<Texpand>
export type PorfolioStatCardKpiViewResponse<Toverall_occupancy_rate = unknown, Ttotal_monthly_potential_revenue = unknown, Texpand = unknown> = Required<PorfolioStatCardKpiViewRecord<Toverall_occupancy_rate, Ttotal_monthly_potential_revenue>> & BaseSystemFields<Texpand>
export type PropertiesResponse<Texpand = unknown> = Required<PropertiesRecord> & BaseSystemFields<Texpand>
export type PropertyHealthDashboardChartViewResponse<ToccupancyRate = unknown, ToutstandingAmount = unknown, TtotalMonthlyPotential = unknown, Texpand = unknown> = Required<PropertyHealthDashboardChartViewRecord<ToccupancyRate, ToutstandingAmount, TtotalMonthlyPotential>> & BaseSystemFields<Texpand>
export type PropertySummaryChartViewResponse<TavailableUnits = unknown, ToccupancyRate = unknown, ToccupiedUnits = unknown, Texpand = unknown> = Required<PropertySummaryChartViewRecord<TavailableUnits, ToccupancyRate, ToccupiedUnits>> & BaseSystemFields<Texpand>
export type RecentAnnouncementsChartViewResponse<TauthorName = unknown, TmessagePreview = unknown, Trecency = unknown, Texpand = unknown> = Required<RecentAnnouncementsChartViewRecord<TauthorName, TmessagePreview, Trecency>> & BaseSystemFields<Texpand>
export type RevenuePerPropertyChartViewResponse<TcurrentMonthlyRevenue = unknown, TrevenueUtilizationRate = unknown, TtotalPotentialMonthlyRevenue = unknown, Texpand = unknown> = Required<RevenuePerPropertyChartViewRecord<TcurrentMonthlyRevenue, TrevenueUtilizationRate, TtotalPotentialMonthlyRevenue>> & BaseSystemFields<Texpand>
export type TenanciesResponse<Texpand = unknown> = Required<TenanciesRecord> & BaseSystemFields<Texpand>
export type TenancyHealthChartViewResponse<Tavg_lease_duration_years = unknown, Texpand = unknown> = Required<TenancyHealthChartViewRecord<Tavg_lease_duration_years>> & BaseSystemFields<Texpand>
export type TenantFinancialOverviewChartViewResponse<ToutstandingBalance = unknown, TpaymentRatePercentage = unknown, TtotalBilled = unknown, TtotalPaid = unknown, Texpand = unknown> = Required<TenantFinancialOverviewChartViewRecord<ToutstandingBalance, TpaymentRatePercentage, TtotalBilled, TtotalPaid>> & BaseSystemFields<Texpand>
export type TenantsResponse<Texpand = unknown> = Required<TenantsRecord> & BaseSystemFields<Texpand>
export type TenantsPerPropertyChartViewResponse<ToccupancyPercentage = unknown, Texpand = unknown> = Required<TenantsPerPropertyChartViewRecord<ToccupancyPercentage>> & BaseSystemFields<Texpand>
export type UnitInventoryChartViewResponse<Tstatus = unknown, Texpand = unknown> = Required<UnitInventoryChartViewRecord<Tstatus>> & BaseSystemFields<Texpand>
export type UnitPriceChartViewResponse<TavgPrice = unknown, TmaxPrice = unknown, TminPrice = unknown, TtotalMonthlyPotential = unknown, Texpand = unknown> = Required<UnitPriceChartViewRecord<TavgPrice, TmaxPrice, TminPrice, TtotalMonthlyPotential>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type WorkerPerformanceChartViewResponse<TavgResolutionDays = unknown, TcompletionRate = unknown, Texpand = unknown> = Required<WorkerPerformanceChartViewRecord<TavgResolutionDays, TcompletionRate>> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	active_tenancies_chart_view: ActiveTenanciesChartViewRecord
	announcements: AnnouncementsRecord
	apartment_units: ApartmentUnitsRecord
	bill_item_analysis_stat_card_kpi_view: BillItemAnalysisStatCardKpiViewRecord
	bill_items: BillItemsRecord
	bills: BillsRecord
	bills_by_status_chart_view: BillsByStatusChartViewRecord
	financial_stat_card_kpi_view: FinancialStatCardKpiViewRecord
	high_priority_unresolved_requests_stat_card_kpi_view: HighPriorityUnresolvedRequestsStatCardKpiViewRecord
	inquiry: InquiryRecord
	maintenance_operation_stat_card_kpi_view: MaintenanceOperationStatCardKpiViewRecord
	maintenance_request_overview_stat_card_kpi_view: MaintenanceRequestOverviewStatCardKpiViewRecord
	maintenance_request_status_stat_card_kpi_view: MaintenanceRequestStatusStatCardKpiViewRecord
	maintenance_requests: MaintenanceRequestsRecord
	maintenance_workers: MaintenanceWorkersRecord
	monthly_revenue_trend_stat_card_kpi_view: MonthlyRevenueTrendStatCardKpiViewRecord
	otp: OtpRecord
	outstanding_receivables_chart_view: OutstandingReceivablesChartViewRecord
	payment_methods_distribution_chart_view: PaymentMethodsDistributionChartViewRecord
	payments: PaymentsRecord
	porfolio_stat_card_kpi_view: PorfolioStatCardKpiViewRecord
	properties: PropertiesRecord
	property_health_dashboard_chart_view: PropertyHealthDashboardChartViewRecord
	property_summary_chart_view: PropertySummaryChartViewRecord
	recent_announcements_chart_view: RecentAnnouncementsChartViewRecord
	revenue_per_property_chart_view: RevenuePerPropertyChartViewRecord
	tenancies: TenanciesRecord
	tenancy_health_chart_view: TenancyHealthChartViewRecord
	tenant_financial_overview_chart_view: TenantFinancialOverviewChartViewRecord
	tenants: TenantsRecord
	tenants_per_property_chart_view: TenantsPerPropertyChartViewRecord
	unit_inventory_chart_view: UnitInventoryChartViewRecord
	unit_price_chart_view: UnitPriceChartViewRecord
	users: UsersRecord
	worker_performance_chart_view: WorkerPerformanceChartViewRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	active_tenancies_chart_view: ActiveTenanciesChartViewResponse
	announcements: AnnouncementsResponse
	apartment_units: ApartmentUnitsResponse
	bill_item_analysis_stat_card_kpi_view: BillItemAnalysisStatCardKpiViewResponse
	bill_items: BillItemsResponse
	bills: BillsResponse
	bills_by_status_chart_view: BillsByStatusChartViewResponse
	financial_stat_card_kpi_view: FinancialStatCardKpiViewResponse
	high_priority_unresolved_requests_stat_card_kpi_view: HighPriorityUnresolvedRequestsStatCardKpiViewResponse
	inquiry: InquiryResponse
	maintenance_operation_stat_card_kpi_view: MaintenanceOperationStatCardKpiViewResponse
	maintenance_request_overview_stat_card_kpi_view: MaintenanceRequestOverviewStatCardKpiViewResponse
	maintenance_request_status_stat_card_kpi_view: MaintenanceRequestStatusStatCardKpiViewResponse
	maintenance_requests: MaintenanceRequestsResponse
	maintenance_workers: MaintenanceWorkersResponse
	monthly_revenue_trend_stat_card_kpi_view: MonthlyRevenueTrendStatCardKpiViewResponse
	otp: OtpResponse
	outstanding_receivables_chart_view: OutstandingReceivablesChartViewResponse
	payment_methods_distribution_chart_view: PaymentMethodsDistributionChartViewResponse
	payments: PaymentsResponse
	porfolio_stat_card_kpi_view: PorfolioStatCardKpiViewResponse
	properties: PropertiesResponse
	property_health_dashboard_chart_view: PropertyHealthDashboardChartViewResponse
	property_summary_chart_view: PropertySummaryChartViewResponse
	recent_announcements_chart_view: RecentAnnouncementsChartViewResponse
	revenue_per_property_chart_view: RevenuePerPropertyChartViewResponse
	tenancies: TenanciesResponse
	tenancy_health_chart_view: TenancyHealthChartViewResponse
	tenant_financial_overview_chart_view: TenantFinancialOverviewChartViewResponse
	tenants: TenantsResponse
	tenants_per_property_chart_view: TenantsPerPropertyChartViewResponse
	unit_inventory_chart_view: UnitInventoryChartViewResponse
	unit_price_chart_view: UnitPriceChartViewResponse
	users: UsersResponse
	worker_performance_chart_view: WorkerPerformanceChartViewResponse
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
