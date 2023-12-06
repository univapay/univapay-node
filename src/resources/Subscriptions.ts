/**
 *  @module Resources/Subscriptions
 */

import { AuthParams, HTTPMethod, PollData, PollParams, RestAPI, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { ignoreDescriptor } from "./common/ignoreDescriptor.js";
import { Metadata, WithStoreMerchantName } from "./common/types.js";
import { Charges } from "./Charges.js";
import { ChargesListParams, ResponseCharges } from "./Charges.js";
import { CRUDAOSItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { ResponseCharge } from "./index.js";
import { PaymentType } from "./TransactionTokens.js";
import { DefinedRoute } from "./Resource.js";

export enum SubscriptionPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    BIMONTHLY = "bimonthly",
    QUARTERLY = "quarterly",
    SEMIANNUALLY = "semiannually",
    ANNUALLY = "annually",
}

export enum SubscriptionStatus {
    UNVERIFIED = "unverified",
    CURRENT = "current",
    SUSPENDED = "suspended",
    UNPAID = "unpaid",
    CANCELED = "canceled",
    UNCONFIRMED = "unconfirmed",
    COMPLETED = "completed",
    AUTHORIZED = "authorized",
}

export enum InstallmentPlan {
    REVOLVING = "revolving",
    FIXED_CYCLES = "fixed_cycles",
    FIXED_CYCLE_AMOUNT = "fixed_cycle_amount",
}

/* Request */
export interface InstallmentBaseParams {
    planType: InstallmentPlan;
}

export interface InstallmentRevolvingParams extends InstallmentBaseParams {
    planType: InstallmentPlan.REVOLVING;
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
    successfulPaymentDate?: string;
    terminateWithStatus?: SubscriptionStatus;
}

export type SchedulePaymentListItem = ScheduledPaymentItem;

export type InstallmentPlanItem =
    | { planType: InstallmentPlan.REVOLVING }
    | { planType: InstallmentPlan.FIXED_CYCLES; fixedCycles: number };

export type SubscriptionPlanItem =
    | { planType: InstallmentPlan.FIXED_CYCLES; fixedCycles: number }
    | { planType: InstallmentPlan.FIXED_CYCLE_AMOUNT; fixedCycleAmount: number };

export type SubscriptionsListParams = CRUDPaginationParams & {
    search?: string;
    status?: SubscriptionStatus;
    mode?: ProcessingMode;
};

export type ScheduledPaymentsListParams = CRUDPaginationParams;

export type SubscriptionCreateBaseParams<T extends Metadata = Metadata> = {
    transactionTokenId: string;
    amount: number;
    currency: string;
    descriptor?: string;
    initialAmount?: number;
    installmentPlan?: InstallmentPlanItem;
    subscriptionPlan?: SubscriptionPlanItem;
    onlyDirectCurrency?: boolean;

    /**
     * Metadata or stringified JSON object
     */
    metadata?: T | string;

    /**
     * Interval (e.g: P7D)
     *
     * Needs firstChargeAuthorizationOnly to be true to be used
     */
    firstChargeCaptureAfter?: string;
    firstChargeAuthorizationOnly?: boolean;
} & PeriodParams;

export type SubscriptionCreateLegacyParams = SubscriptionCreateBaseParams & {
    /**
     * @deprecated Used scheduleSettings instead
     */
    subsequentCyclesStart?: string | number;
};

export type SubscriptionCreateNewParams = SubscriptionCreateBaseParams & {
    scheduleSettings: Partial<ScheduleSettings>;
};

export type SubscriptionCreateParams = SubscriptionCreateLegacyParams | SubscriptionCreateNewParams;

export type SubscriptionUpdateParams<T extends Metadata = Metadata> = {
    transactionTokenId?: string;
    amount?: number;
    status?: SubscriptionStatus;
    installmentPlan?: Partial<InstallmentPlanItem>;
    subscriptionPlan?: Partial<SubscriptionPlanItem>;
    onlyDirectCurrency?: boolean;

    /**
     * Metadata or stringified JSON object
     */
    metadata?: T | string;

    /**
     * Interval (e.g: P7D)
     *
     * Needs firstChargeAuthorizationOnly to be true to be used
     */
    firstChargeCaptureAfter?: string;
    firstChargeAuthorizationOnly?: boolean;

    scheduleSettings?: {
        terminationMode?: TerminateMode;
    };
};

export type PaymentUpdateParams = Partial<ScheduledPaymentItem>;

export enum TerminateMode {
    IMMEDIATE = "immediate",
    ON_NEXT_PAYMENT = "on_next_payment",
}

export type ScheduleSettings = {
    startOn?: string;
    zoneId: string;
    preserveEndOfMonth?: boolean;
    retryInterval?: string;
    terminationMode?: TerminateMode;
};

/* Response */

type PeriodParams =
    | {
          /**
           * Can not be used with the cyclicalPeriod parameter
           */
          period: SubscriptionPeriod;
      }
    | {
          /**
           * ISO 8601 period. e.g P1M, P23D. Can not be used with the `period` parameter
           */
          cyclicalPeriod: string | null;
          period?: never; // Ensure both parameter can not be specified together
      };

export type SubscriptionItem<T extends Metadata = Metadata> = {
    id: string;
    storeId: string;
    transactionTokenId: string;
    mode: ProcessingMode;
    status: SubscriptionStatus;
    amount: number;
    amountFormatted: number;
    amountLeft: number;
    amountLeftFormatted: number;
    currency: string;
    paymentsLeft: number;
    descriptor: string;
    onlyDirectCurrency: boolean;
    createdOn: string;
    scheduleSettings: ScheduleSettings | null;
    nextPayment: ScheduledPaymentItem;

    initialAmount?: number | null;
    initialAmountFormatted?: number;
    subsequentCyclesStart?: string;
    installmentPlan?: InstallmentPlanItem;
    subscriptionPlan?: SubscriptionPlanItem;
    period?: SubscriptionPeriod;
    cyclicalPeriod?: string | null;
    cyclesLeft?: number;
    metadata?: T;
};

export type SubscriptionListItem = WithStoreMerchantName<SubscriptionItem>;

type SubscriptionSimulationBaseParams = {
    installmentPlan?: InstallmentPlanItem | null;
    amount: number;
    currency: string;
    initialAmount?: number;
    paymentType: PaymentType;
} & PeriodParams;

export type SimulationInstallmentPayment = {
    amount: number;
    currency: string;
    dueDate: string;
    isLastPayment: boolean;
    isPaid: boolean;
    zoneId: string;
};

export type SubscriptionSimulationLegacyParams = SubscriptionSimulationBaseParams & {
    subsequentCyclesStart?: string | number;
};

export type SubscriptionSimulationNewParams = SubscriptionSimulationBaseParams & {
    scheduleSettings: ScheduleSettings;
};

export type SubscriptionSimulationParams = SubscriptionSimulationLegacyParams | SubscriptionSimulationNewParams;

export type CycleAmount = {
    cycleDate: string;
    amount: number;
};

export type SubscriptionSimulationLegacyItem = Required<SubscriptionSimulationLegacyParams> & {
    cycles: CycleAmount[];
};

export type SubscriptionSimulationNewItem = {
    [index: string]: Omit<ScheduledPaymentItem, "id" | "createdOn">;
};

export type SubscriptionSimulationItem = SubscriptionSimulationLegacyItem | SubscriptionSimulationNewItem;

export type ResponseSubscription = SubscriptionItem;
export type ResponseSubscriptions = CRUDAOSItemsResponse<SubscriptionListItem>;

export type ResponsePayment = ScheduledPaymentItem;
export type ResponsePayments = CRUDAOSItemsResponse<SchedulePaymentListItem>;

export class ScheduledPayments extends CRUDResource {
    static routeBase = "/stores/:storeId/subscriptions/:subscriptionsId/payments";

    private _list?: DefinedRoute;
    list(
        storeId: string,
        subscriptionsId: string,
        data?: SendData<ScheduledPaymentsListParams>,
        auth?: AuthParams,
    ): Promise<ResponsePayments> {
        this._list = this._list ?? this.defineRoute(HTTPMethod.GET, `${ScheduledPayments.routeBase}`);
        return this._list(data, auth, { storeId, subscriptionsId });
    }

    private _get?: DefinedRoute;
    get(
        storeId: string,
        subscriptionsId: string,
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
    ): Promise<ResponsePayment> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, subscriptionsId, id });
    }

    private _update?: DefinedRoute;
    update(
        storeId: string,
        subscriptionsId: string,
        id: string,
        data?: SendData<PaymentUpdateParams>,
        auth?: AuthParams,
    ): Promise<ResponsePayment> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { storeId, subscriptionsId, id });
    }

    private _listCharges?: DefinedRoute;
    listCharges(
        storeId: string,
        subscriptionsId: string,
        paymentId: string,
        data?: SendData<ChargesListParams>,
        auth?: AuthParams,
    ): Promise<ResponseCharges> {
        this._listCharges =
            this._listCharges ?? this.defineRoute(HTTPMethod.GET, `${ScheduledPayments.routeBase}/:paymentId/charges`);
        return this._listCharges(data, auth, { storeId, subscriptionsId, paymentId });
    }
}

const hasImmediateCharge = (subscription: SubscriptionItem) => {
    const { initialAmount, scheduleSettings } = subscription;
    return !!initialAmount || !scheduleSettings || new Date(scheduleSettings.startOn) <= new Date();
};

export class Subscriptions extends CRUDResource {
    static requiredParams = ["transactionTokenId", "amount", "currency", ["period", "cyclicalPeriod"]];
    static requiredSimulationParams = ["paymentType", "currency", ["period", "cyclicalPeriod"]];

    static routeBase = "/stores/:storeId/subscriptions";

    payments: ScheduledPayments;
    private chargesResource: Charges;

    constructor(api: RestAPI) {
        super(api);

        this.payments = new ScheduledPayments(api);
        this.chargesResource = new Charges(api);
    }

    private _list: DefinedRoute;
    list(
        data?: SendData<SubscriptionsListParams>,
        auth?: AuthParams,
        storeId?: string,
    ): Promise<ResponseSubscriptions> {
        this._list = this._list ?? this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/subscriptions");
        return this._list(data, auth, { storeId });
    }

    private _suspend?: DefinedRoute;
    suspend(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponsePayment> {
        this._suspend =
            this._suspend ?? this.defineRoute(HTTPMethod.PATCH, "(/stores/:storeId)/subscriptions/:id/suspend");
        return this._suspend(data, auth, { storeId, id });
    }

    private _unsuspend?: DefinedRoute;
    unsuspend(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponsePayment> {
        this._unsuspend =
            this._unsuspend ?? this.defineRoute(HTTPMethod.PATCH, "(/stores/:storeId)/subscriptions/:id/unsuspend");
        return this._suspend(data, auth, { storeId, id });
    }

    create(data: SubscriptionCreateParams, auth?: AuthParams): Promise<ResponseSubscription> {
        return ignoreDescriptor(
            (updatedData: SubscriptionCreateParams) =>
                this.defineRoute(HTTPMethod.POST, "/subscriptions", { requiredParams: Subscriptions.requiredParams })(
                    updatedData,
                    auth,
                ),
            data,
        );
    }

    private _get: DefinedRoute;
    get(storeId: string, id: string, data?: SendData<PollData>, auth?: AuthParams): Promise<ResponseSubscription> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, id });
    }

    private _update: DefinedRoute;
    update(
        storeId: string,
        id: string,
        data?: SendData<SubscriptionUpdateParams>,
        auth?: AuthParams,
    ): Promise<ResponseSubscription> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { storeId, id });
    }

    private _delete: DefinedRoute;
    delete(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { storeId, id });
    }

    private _charges: DefinedRoute;
    charges(
        storeId: string,
        id: string,
        data?: SendData<ChargesListParams>,
        auth?: AuthParams,
    ): Promise<ResponseCharges> {
        this._charges = this._charges ?? this.defineRoute(HTTPMethod.GET, `${Subscriptions.routeBase}/:id/charges`);
        return this._charges(data, auth, { storeId, id });
    }

    poll(
        storeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseSubscription>>,
    ): Promise<ResponseSubscription> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseSubscription> = () => this.get(storeId, id, pollData, auth);
        const successCondition =
            pollParams?.successCondition ?? (({ status }) => status !== SubscriptionStatus.UNVERIFIED);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }

    async pollSubscriptionWithFirstCharge(
        storeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
    ): Promise<{ subscription: ResponseSubscription; charge?: ResponseCharge }> {
        const subscription = await this.poll(storeId, id, data, auth);

        const charge = hasImmediateCharge(subscription)
            ? await this.api
                  .longPolling(() => this.charges(storeId, id, undefined, auth), {
                      successCondition: (charges) => !!charges.items.length,
                  })
                  .then(({ items: charges }) =>
                      this.chargesResource.poll(charges[0].storeId, charges[0].id, data, auth),
                  )
            : null;

        return { subscription, charge };
    }

    private _simulation: DefinedRoute;
    simulation(
        data: SendData<SubscriptionSimulationParams>,
        auth?: AuthParams,
        storeId?: string,
    ): Promise<SimulationInstallmentPayment[]> {
        this._simulation =
            this._simulation ??
            this.defineRoute(HTTPMethod.POST, "(/stores/:storeId)/subscriptions/simulate_plan", {
                requiredParams: Subscriptions.requiredSimulationParams,
            });
        return this._simulation(data, auth, { storeId });
    }
}
