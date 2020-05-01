/**
 *  @module Resources/Subscriptions
 */

import { Omit } from 'type-zoo';
import { ErrorResponse, HTTPMethod, PollParams, ResponseCallback, RestAPI, SendData } from '../api/RestAPI';
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from './CRUDResource';
import { Metadata } from './common/types';
import { ProcessingMode } from './common/enums';
import { ChargesListParams, ResponseCharges } from './Charges';
import { PaymentType } from './TransactionTokens';
import { ignoreDescriptor } from './common/ignoreDescriptor';

export enum SubscriptionPeriod {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    BIWEEKLY = 'biweekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    SEMIANNUALLY = 'semiannually',
    ANNUALLY = 'annually',
}

export enum SubscriptionStatus {
    UNVERIFIED = 'unverified',
    CURRENT = 'current',
    SUSPENDED = 'suspended',
    UNPAID = 'unpaid',
    CANCELED = 'canceled',
    UNCONFIRMED = 'unconfirmed',
    COMPLETED = 'completed',
}

export enum InstallmentPlan {
    REVOLVING = 'revolving',
    FIXED_CYCLES = 'fixed_cycles',
    FIXED_CYCLE_AMOUNT = 'fixed_cycle_amount',
}

/* Request */
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

export type InstallmentPlanItem<InstallmentPlanData extends InstallmentBaseParams> = InstallmentPlanData;

export interface SubscriptionsListParams extends CRUDPaginationParams {
    search?: string;
    status?: SubscriptionStatus;
    mode?: ProcessingMode;
}

export type ScheduledPaymentsListParams = CRUDPaginationParams;

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

export type SubscriptionCreateParams = SubscriptionCreateLegacyParams | SubscriptionCreateNewParams;

export interface SubscriptionUpdateParams {
    transactionTokenId?: string;
    amount?: number;
    status?: SubscriptionStatus;
    metadata?: Metadata;
    installmentPlan?: Partial<InstallmentPlanItem<any>>;
    onlyDirectCurrency?: boolean;
}

export type PaymentUpdateParams = Partial<ScheduledPaymentItem>;

export interface ScheduleSettings {
    startOn?: string;
    zoneId: string;
    preserveEndOfMonth?: boolean;
}

/* Response */
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

export interface SubscriptionSimulationLegacyParams<InstallmentPlanData extends InstallmentBaseParams>
    extends SubscriptionSimulationBaseParams<InstallmentPlanData> {
    subsequentCyclesStart?: string | number;
}

export interface SubscriptionSimulationNewParams<InstallmentPlanData extends InstallmentBaseParams>
    extends SubscriptionSimulationBaseParams<InstallmentPlanData> {
    scheduleSettings: ScheduleSettings;
}

export type SubscriptionSimulationParams<InstallmentPlanData extends InstallmentBaseParams> =
    | SubscriptionSimulationLegacyParams<InstallmentPlanData>
    | SubscriptionSimulationNewParams<InstallmentPlanData>;

export interface CycleAmount {
    cycleDate: string;
    amount: number;
}

export type SubscriptionSimulationLegacyItem<InstallmentPlanData extends InstallmentBaseParams> = Required<
    SubscriptionSimulationLegacyParams<InstallmentPlanData>
> & {
    cycles: CycleAmount[];
};

export interface SubscriptionSimulationNewItem {
    [index: string]: Omit<ScheduledPaymentItem, 'id' | 'createdOn'>;
}

export type SubscriptionSimulationItem<InstallmentPlanData extends InstallmentBaseParams> =
    | SubscriptionSimulationLegacyItem<InstallmentPlanData>
    | SubscriptionSimulationNewItem;

export type ResponseSubscription = SubscriptionItem;
export type ResponseSubscriptions = CRUDItemsResponse<SubscriptionItem>;

export type ResponsePayment = ScheduledPaymentItem;
export type ResponsePayments = CRUDItemsResponse<ScheduledPaymentItem>;

export class ScheduledPayments extends CRUDResource {
    static routeBase = '/stores/:storeId/subscriptions/:subscriptionsId/payments';

    list(
        storeId: string,
        subscriptionsId: string,
        data?: SendData<ScheduledPaymentsListParams>,
        callback?: ResponseCallback<ResponsePayments>,
    ): Promise<ResponsePayments> {
        return this.defineRoute(HTTPMethod.GET, `${ScheduledPayments.routeBase}`)(
            data,
            callback,
            ['storeId', 'subscriptionsId'],
            storeId,
            subscriptionsId,
        );
    }

    get(
        storeId: string,
        subscriptionsId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ResponsePayment>,
    ): Promise<ResponsePayment> {
        return this._getRoute()(data, callback, ['storeId', 'subscriptionsId', 'id'], storeId, subscriptionsId, id);
    }

    update(
        storeId: string,
        subscriptionsId: string,
        id: string,
        data?: SendData<PaymentUpdateParams>,
        callback?: ResponseCallback<ResponsePayment>,
    ): Promise<ResponsePayment> {
        return this._updateRoute()(data, callback, ['storeId', 'subscriptionsId', 'id'], storeId, subscriptionsId, id);
    }

    listCharges(
        storeId: string,
        subscriptionsId: string,
        paymentId: string,
        data?: SendData<ChargesListParams>,
        callback?: ResponseCallback<ResponseCharges>,
    ): Promise<ResponseCharges> {
        return this.defineRoute(HTTPMethod.GET, `${ScheduledPayments.routeBase}/:paymentId/charges`)(
            data,
            callback,
            ['storeId', 'subscriptionsId', 'paymentId'],
            storeId,
            subscriptionsId,
            paymentId,
        );
    }
}

export class Subscriptions extends CRUDResource {
    static requiredParams: string[] = ['transactionTokenId', 'amount', 'currency', 'period'];
    static requiredSimulationParams: string[] = ['installmentPlan', 'paymentType', 'currency', 'period'];

    static routeBase = '/stores/:storeId/subscriptions';

    payments: ScheduledPayments;

    constructor(api: RestAPI) {
        super(api);

        this.payments = new ScheduledPayments(api);
    }

    list(
        data?: SendData<SubscriptionsListParams>,
        callback?: ResponseCallback<ResponseSubscriptions>,
        storeId?: string,
    ): Promise<ResponseSubscriptions> {
        return this.defineRoute(HTTPMethod.GET, '(/stores/:storeId)/subscriptions')(
            data,
            callback,
            ['storeId'],
            storeId,
        );
    }

    create(
        data: SubscriptionCreateParams,
        callback?: ResponseCallback<ResponseSubscription>,
    ): Promise<ResponseSubscription> {
        return ignoreDescriptor(
            (updatedData: any) =>
                this.defineRoute(HTTPMethod.POST, '/subscriptions', Subscriptions.requiredParams)(
                    updatedData,
                    callback,
                ),
            data,
        );
    }

    get(
        storeId: string,
        id: string,
        data?: SendData<PollParams>,
        callback?: ResponseCallback<ResponseSubscription>,
    ): Promise<ResponseSubscription> {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }

    update(
        storeId: string,
        id: string,
        data?: SendData<SubscriptionUpdateParams>,
        callback?: ResponseCallback<ResponseSubscription>,
    ): Promise<ResponseSubscription> {
        return this._updateRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }

    delete(
        storeId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ErrorResponse>,
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }

    charges(
        storeId: string,
        id: string,
        data?: SendData<ChargesListParams>,
        callback?: ResponseCallback<ResponseCharges>,
    ): Promise<ResponseCharges> {
        return this.defineRoute(HTTPMethod.GET, `${Subscriptions.routeBase}/:id/charges`)(
            data,
            callback,
            ['storeId', 'id'],
            storeId,
            id,
        );
    }

    poll(
        storeId: string,
        id: string,
        data?: SendData<PollParams>,
        callback?: ResponseCallback<ResponseSubscription>,

        /**
         * Condition for the resource to be successfully loaded. Default to pending status check.
         */
        cancelCondition?: (response: ResponseSubscription) => boolean,
        successCondition: ({ status }: ResponseSubscription) => boolean = ({ status }) =>
            status !== SubscriptionStatus.UNVERIFIED,
    ): Promise<ResponseSubscription> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseSubscription> = () => this.get(storeId, id, pollData);

        return this.api.longPolling(promise, successCondition, cancelCondition, callback);
    }

    simulation<InstallmentPlanData extends InstallmentBaseParams>(
        data: SendData<SubscriptionSimulationParams<InstallmentPlanData>>,
        callback?: ResponseCallback<SubscriptionSimulationItem<InstallmentPlanData>>,
        storeId?: string,
    ): Promise<SubscriptionSimulationItem<InstallmentPlanData>> {
        return this.defineRoute(
            HTTPMethod.POST,
            '(/stores/:storeId)/subscriptions/simulate_plan',
            Subscriptions.requiredSimulationParams,
        )(data, callback, ['storeId'], storeId);
    }
}
