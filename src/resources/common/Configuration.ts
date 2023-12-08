/**
 *  @internal
 *  @module Types
 */

import { RecurringTokenPrivilege } from "../TransactionTokens.js";

import { CardBrand, ProcessingMode } from "./enums.js";
import { AmountWithCurrency } from "./types.js";

export enum TransferMatchAmount {
    MAXIMUM = "maximum",
    MINIMUM = "minimum",
    EXACT = "exact",
    DISABLED = "disabled",
}

export enum CustomerRole {
    TRANSACTION_TOKEN_READ = "transaction_token_read",
    TRANSACTION_TOKEN_UPDATE = "transaction_token_update",
    SUBSCRIPTION_READ = "subscription_read",
    SUBSCRIPTION_UPDATE_TOKEN = "subscription_update_token",
    SUBSCRIPTION_SUSPEND = "subscription_suspend", // Also controls resume functionality
    SUBSCRIPTION_DELETE = "subscription_delete",
}

export type CustomerManagementConfiguration = {
    enabled: boolean;
    defaultRoles: CustomerRole[];
    defaultMode: ProcessingMode;
};

export interface PaymentTypeConfiguration {
    enabled?: boolean;
}

export interface CardBrandPercentFeesItem {
    americanExpress?: number;
    dinersClub?: number;
    discover?: number;
    jcb?: number;
    maestro?: number;
    mastercard?: number;
    unionPay?: number;
    visa?: number;
}

export type CardConfigurationMonthlyLimit = AmountWithCurrency & { duration: string };

export interface CardConfigurationItem extends PaymentTypeConfiguration {
    debitEnabled: boolean;
    debitAuthorizationEnabled: boolean;
    prepaidEnabled: boolean;
    prepaidAuthorizationEnabled: boolean;
    forbiddenCardBrands: CardBrand[];
    foreignCardsAllowed: boolean;
    failOnNewEmail: boolean;
    allowedCountriesByIp: string[];
    cardLimit: CardConfigurationMonthlyLimit;
    allowEmptyCvv: boolean;
    onlyDirectCurrency: boolean;
    allowDirectTokenCreation: boolean;
}

export interface QRScanConfigurationItem extends PaymentTypeConfiguration {
    forbiddenQrScanGateways: string[];
}

export type QRMerchantConfigurationItem = PaymentTypeConfiguration;

export type ConvenienceConfigurationItem = PaymentTypeConfiguration & {
    expiration: string;
    /**
     * Ensure that the charge expires when the merchant "expects" it to expire.
     */
    expirationTimeShift: {
        enabled: boolean;

        /**
         * Time with Time Zone.
         * HH:mm:ss.SSSZ  (e.g: 09:00:00.000+09:00)
         */
        value: string;
    };
};

export type OnlineConfigurationItem = PaymentTypeConfiguration;

export type PaidyConfigurationItem = PaymentTypeConfiguration;

export type BankTransferConfiguration = PaymentTypeConfiguration & {
    matchAmount: TransferMatchAmount;
    expiration: string;
    /**
     * Ensure that the charge expires when the merchant "expects" it to expire.
     */
    expirationTimeShift: {
        enabled: boolean;

        /**
         * Time with Time Zone.
         * HH:mm:ss.SSSZ  (e.g: 09:00:00.000+09:00)
         */
        value: string;
    };

    /**
     * Number of accounts left before fetching more accounts
     */
    virtualBankAccountsThreshold: number;

    /**
     * How many accounts to fetch
     */
    virtualBankAccountsFetchCount: number;

    /**
     * Period (e.g P1DT9H)  How long to extend a charge expiration by default
     */
    defaultExtensionPeriod: string;

    /**
     * Period (e.g P1DT9H) Maximum period a charge can be extended for, when using a custom period
     */
    maximumExtensionPeriod: string;

    /**
     * Boolean when a charge should be auto-extended after expiration
     */
    automaticExtensionEnabled: boolean;

    /**
     * Boolean when a reminder email should be sent
     */
    remindNotificationEnabled: boolean;

    /**
     * Period (e.g P1DT9H) How long before the charge expiry to send to the customer the charge expiry reminder email template. If none, no reminder is sent
     */
    remindNotificationPeriod: string;

    /**
     * Boolean when a charge request should be notified
     */
    chargeRequestNotificationEnabled: boolean;

    /**
     * Boolean when a deposit reception should be notified
     */
    depositReceivedNotificationEnabled: boolean;

    /**
     * Boolean when a deposit bellow the transaction value should be notified
     */
    depositInsufficientNotificationEnabled: boolean;

    /**
     * Boolean when a deposit exceeding the transaction value should be notified
     */
    depositExceededNotificationEnabled: boolean;

    /**
     * Boolean when a charge extension should be notified
     */
    extensionNotificationEnabled: boolean;

    /**
     * Boolean when a charge expiration should be notified
     */
    chargeExpiredNotificationEnabled?: boolean;

    /**
     * Boolean when a charge cancel should be notified
     */
    chargeRequestCanceledNotificationEnabled?: boolean;
};

export interface InstallmentsConfiguration {
    enabled?: boolean;
    minChargeAmount?: AmountWithCurrency;
    maxPayoutPeriod?: string;
    failedCyclesToCancel?: number;
    onlyWithProcessor?: boolean;
    cardProcessor?: { fixedCycle: boolean; revolving: boolean } | null;
}

export interface InstallmentsConfigurationItem extends PaymentTypeConfiguration, InstallmentsConfiguration {}

export type SubscriptionPlanConfiguration = {
    enabled: boolean | null;
    fixedCycle: boolean | null;
    fixedCycleAmount: boolean | null;
    supportedPaymentTypes: boolean | null;
    minChargeAmount: {
        amount: number;
        amountFormatted?: string;
        currency: string;
    };

    /**
     * Period e.g: P1Y
     */
    maxPayoutPeriod: string | null;
};

export interface SecurityConfiguration {
    inspectSuspiciousLoginAfter?: string;
    limitChargeByCardConfiguration?: {
        quantityOfCharges: number;
        durationWindow: string;
    };
    refundPercentLimit?: number;
    minRefundThreshold?: number;
    cardChargeCooldown?: string; // ISO8601 Duration (min. PT1S)
    subscriptionCooldown?: string; // ISO8601 Duration (min. PT1S)
    idempotentCardChargeCooldown?: string; // ISO8601 Duration (min. PT1S)
    idempotentSubscriptionCooldown?: string; // ISO8601 Duration (min. PT1S)
}

export interface UserTransactionsConfiguration {
    enabled?: boolean;
    notifyCustomer?: boolean;
    notifyOnTest?: boolean;
    notifyUserOnFailedTransaction?: boolean;
    notifyCustomerOnFailedTransaction?: boolean;
    notifyOnRecurringTokenCreation?: boolean;
    notifyOnWebhookFailure?: boolean;
    notifyOnWebhookDisabled?: boolean;
    notifyUserOnFailedTransactions?: boolean;
    notifyCustomerOnFailedTransactions?: boolean;
    notifyUserOnConvenienceInstructions?: boolean;
    notifyOnSubscriptions?: boolean;
    notifyOnRecurringTokenCvvFailed?: boolean;
    notifyOnAuthorizations?: boolean;
    notifyOnCvvAuthorizations?: boolean;
    notifyOnCancels?: boolean;
}

export interface RecurringTokenConfiguration {
    recurringType?: RecurringTokenPrivilege;
    chargeWaitPeriod?: string;
    cardChargeCvvConfirmation?: {
        enabled?: boolean;
        threshold?: AmountWithCurrency[];
    };
}

export interface SubscriptionsConfiguration {
    enabled?: boolean;
    failedChargesToCancel: number;
    suspendOnCancel: boolean;
    allowMerchantAmountPatch?: boolean;
    allowMerchantDueDatePatch?: boolean;
}

export interface DescriptorProvidedConfiguration {
    name: string;
    phoneNumber: string;
}
export type CheckoutConfiguration = {
    ecEmail: { enabled?: boolean };
    ecProducts: { enabled?: boolean };
};

export interface ConfigurationItem {
    bankTransferConfiguration: BankTransferConfiguration;
    cardBrandPercentFees: CardBrandPercentFeesItem;
    cardConfiguration: CardConfigurationItem;
    convenienceConfiguration: ConvenienceConfigurationItem;
    onlineConfiguration: OnlineConfigurationItem;
    paidyConfiguration: PaidyConfigurationItem;
    country: string;
    displayTimeZone: string;
    flatFees: AmountWithCurrency[];
    installmentsConfiguration: InstallmentsConfigurationItem;
    language: string;
    logoUrl?: string;
    minimumChargeAmounts: AmountWithCurrency[];
    maximumChargeAmounts: AmountWithCurrency[];
    minTransferPayout?: AmountWithCurrency;
    percentFee: number;
    qrScanConfiguration: QRScanConfigurationItem;
    qrMerchantConfiguration: QRMerchantConfigurationItem;
    recurringTokenConfiguration: RecurringTokenConfiguration;
    securityConfiguration: SecurityConfiguration;
    subscriptionConfiguration: SubscriptionsConfiguration;
    subscriptionPlanConfiguration?: SubscriptionPlanConfiguration;
    userTransactionsConfiguration?: UserTransactionsConfiguration;
    checkoutConfiguration: CheckoutConfiguration;
    descriptorProvidedConfiguration?: DescriptorProvidedConfiguration;
    customerManagementConfiguration?: CustomerManagementConfiguration;
    platformCredentialsEnabled?: boolean;
    taggedPlatformCredentialsEnabled?: boolean;
}

export interface ConfigurationParams {
    logoUrl?: string;

    bankTransferConfiguration?: Partial<BankTransferConfiguration>;
    cardConfiguration?: Partial<CardConfigurationItem>;
    checkoutConfiguration?: Partial<CheckoutConfiguration>;
    convenienceConfiguration?: Partial<ConvenienceConfigurationItem>;
    descriptorProvidedConfiguration?: Partial<DescriptorProvidedConfiguration>;
    installmentsConfiguration?: Partial<InstallmentsConfigurationItem>;
    onlineConfiguration?: Partial<OnlineConfigurationItem>;
    paidyConfiguration?: Partial<PaidyConfigurationItem>;
    qrScanConfiguration?: Partial<QRScanConfigurationItem>;
    qrMerchantConfiguration?: Partial<QRMerchantConfigurationItem>;
    recurringTokenConfiguration?: Partial<RecurringTokenConfiguration>;
    subscriptionConfiguration?: Partial<SubscriptionsConfiguration>;
    subscriptionPlanConfiguration?: SubscriptionPlanConfiguration;
    securityConfiguration?: Partial<SecurityConfiguration>;
    customerManagementConfiguration?: Partial<CustomerManagementConfiguration>;
}

export type ConfigurationCreateParams = ConfigurationParams;
export type ConfigurationUpdateParams = ConfigurationParams;
