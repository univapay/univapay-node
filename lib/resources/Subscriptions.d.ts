/**
 *  @module Resources/Subscriptions
 */
import { Omit } from 'type-zoo';
import { ErrorResponse, PollParams, ResponseCallback, RestAPI, SendData } from '../api/RestAPI';
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from './CRUDResource';
import { Metadata } from './common/types';
import { ProcessingMode } from './common/enums';
import { ChargesListParams, ResponseCharges } from './Charges';
import { PaymentType } from './TransactionTokens';
export declare enum SubscriptionPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMIANNUALLY = "semiannually",
    ANNUALLY = "annually"
}
export declare enum SubscriptionStatus {
    UNVERIFIED = "unverified",
    CURRENT = "current",
    SUSPENDED = "suspended",
    UNPAID = "unpaid",
    CANCELED = "canceled",
    UNCONFIRMED = "unconfirmed",
    COMPLETED = "completed"
}
export declare enum InstallmentPlan {
    REVOLVING = "revolving",
    FIXED_CYCLES = "fixed_cycles",
    FIXED_CYCLE_AMOUNT = "fixed_cycle_amount"
}
export interface InstallmentBaseParams {
    planType: InstallmentPlan;
}
export interface InstallmentRevolvingParams extends InstallmentBaseParams {
    planType: InstallmentPlan.REVOLVING;
}
export interface InstallmentCyclesParams extends InstallmentBaseParams {
    planType: InstallmentPlan.FIXED_CYCLES;
    fixedCycles: number;
}
export interface InstallmentCycleAmountParams extends InstallmentBaseParams {
    planType: InstallmentPlan.FIXED_CYCLE_AMOUNT;
    fixedCycleAmount: number;
}
export interface ScheduledPaymentItem {
    id: string;
    dueDate: string;
    zoneId: string;
    amount: number;
    amountFormatted: number;
    currency: string;
    isPaid: boolean;
    isLastPayment: boolean;
    createdOn: string;
}
export declare type InstallmentPlanItem<InstallmentPlanData extends InstallmentBaseParams> = InstallmentPlanData;
export interface SubscriptionsListParams extends CRUDPaginationParams {
    search?: string;
    status?: SubscriptionStatus;
    mode?: ProcessingMode;
}
export declare type ScheduledPaymentsListParams = CRUDPaginationParams;
export interface SubscriptionCreateBaseParams {
    transactionTokenId: string;
    amount: number;
    currency: string;
    period: SubscriptionPeriod;
    descriptor?: string;
    metadata?: Metadata;
    initialAmount?: number;
    installmentPlan?: InstallmentPlanItem<any>;
    onlyDirectCurrency?: boolean;
}
export interface SubscriptionCreateLegacyParams extends SubscriptionCreateBaseParams {
    subsequentCyclesStart?: string | number;
}
export interface SubscriptionCreateNewParams extends SubscriptionCreateBaseParams {
    scheduleSettings: Partial<ScheduleSettings>;
}
export declare type SubscriptionCreateParams = SubscriptionCreateLegacyParams | SubscriptionCreateNewParams;
export interface SubscriptionUpdateParams {
    transactionTokenId?: string;
    amount?: number;
    status?: SubscriptionStatus;
    metadata?: Metadata;
    installmentPlan?: Partial<InstallmentPlanItem<any>>;
    onlyDirectCurrency?: boolean;
}
export declare type PaymentUpdateParams = Partial<ScheduledPaymentItem>;
export interface ScheduleSettings {
    startOn?: string;
    zoneId: string;
    preserveEndOfMonth?: boolean;
}
export interface SubscriptionItem {
    id: string;
    storeId: string;
    amount: number;
    amountFormatted: number;
    amountLeft: number;
    amountLeftFormatted: number;
    currency: string;
    period: SubscriptionPeriod;
    initialAmount?: number;
    initialAmountFormatted?: number;
    subsequentCyclesStart?: string;
    scheduleSettings: ScheduleSettings;
    status: SubscriptionStatus;
    metadata?: Metadata;
    mode: ProcessingMode;
    createdOn: string;
    installmentPlan?: InstallmentPlanItem<any>;
    transactionTokenId: string;
    nextPayment: ScheduledPaymentItem;
    paymentsLeft: number;
    descriptor: string;
    onlyDirectCurrency: boolean;
}
interface SubscriptionSimulationBaseParams<InstallmentPlanData extends InstallmentBaseParams> {
    installmentPlan?: InstallmentPlanData;
    amount: number;
    currency: string;
    initialAmount?: number;
    paymentType: PaymentType;
    period: SubscriptionPeriod;
}
export interface SubscriptionSimulationLegacyParams<InstallmentPlanData extends InstallmentBaseParams> extends SubscriptionSimulationBaseParams<InstallmentPlanData> {
    subsequentCyclesStart?: string | number;
}
export interface SubscriptionSimulationNewParams<InstallmentPlanData extends InstallmentBaseParams> extends SubscriptionSimulationBaseParams<InstallmentPlanData> {
    scheduleSettings: ScheduleSettings;
}
export declare type SubscriptionSimulationParams<InstallmentPlanData extends InstallmentBaseParams> = SubscriptionSimulationLegacyParams<InstallmentPlanData> | SubscriptionSimulationNewParams<InstallmentPlanData>;
export interface CycleAmount {
    cycleDate: string;
    amount: number;
}
export declare type SubscriptionSimulationLegacyItem<InstallmentPlanData extends InstallmentBaseParams> = Required<SubscriptionSimulationLegacyParams<InstallmentPlanData>> & {
    cycles: CycleAmount[];
};
export interface SubscriptionSimulationNewItem {
    [index: string]: Omit<ScheduledPaymentItem, 'id' | 'createdOn'>;
}
export declare type SubscriptionSimulationItem<InstallmentPlanData extends InstallmentBaseParams> = SubscriptionSimulationLegacyItem<InstallmentPlanData> | SubscriptionSimulationNewItem;
export declare type ResponseSubscription = SubscriptionItem;
export declare type ResponseSubscriptions = CRUDItemsResponse<SubscriptionItem>;
export declare type ResponsePayment = ScheduledPaymentItem;
export declare type ResponsePayments = CRUDItemsResponse<ScheduledPaymentItem>;
export declare class ScheduledPayments extends CRUDResource {
    static routeBase: string;
    list(storeId: string, subscriptionsId: string, data?: SendData<ScheduledPaymentsListParams>, callback?: ResponseCallback<ResponsePayments>): Promise<ResponsePayments>;
    get(storeId: string, subscriptionsId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ResponsePayment>): Promise<ResponsePayment>;
    update(storeId: string, subscriptionsId: string, id: string, data?: SendData<PaymentUpdateParams>, callback?: ResponseCallback<ResponsePayment>): Promise<ResponsePayment>;
    listCharges(storeId: string, subscriptionsId: string, paymentId: string, data?: SendData<ChargesListParams>, callback?: ResponseCallback<ResponseCharges>): Promise<ResponseCharges>;
}
export declare class Subscriptions extends CRUDResource {
    static requiredParams: string[];
    static requiredSimulationParams: string[];
    static routeBase: string;
    payments: ScheduledPayments;
    constructor(api: RestAPI);
    list(data?: SendData<SubscriptionsListParams>, callback?: ResponseCallback<ResponseSubscriptions>, storeId?: string): Promise<ResponseSubscriptions>;
    create(data: SubscriptionCreateParams, callback?: ResponseCallback<ResponseSubscription>): Promise<ResponseSubscription>;
    get(storeId: string, id: string, data?: SendData<PollParams>, callback?: ResponseCallback<ResponseSubscription>): Promise<ResponseSubscription>;
    update(storeId: string, id: string, data?: SendData<SubscriptionUpdateParams>, callback?: ResponseCallback<ResponseSubscription>): Promise<ResponseSubscription>;
    delete(storeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse>;
    charges(storeId: string, id: string, data?: SendData<ChargesListParams>, callback?: ResponseCallback<ResponseCharges>): Promise<ResponseCharges>;
    poll(storeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseSubscription>): Promise<ResponseSubscription>;
    simulation<InstallmentPlanData extends InstallmentBaseParams>(data: SendData<SubscriptionSimulationParams<InstallmentPlanData>>, callback?: ResponseCallback<SubscriptionSimulationItem<InstallmentPlanData>>, storeId?: string): Promise<SubscriptionSimulationItem<InstallmentPlanData>>;
}
export {};
