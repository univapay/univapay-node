/**
 *  @internal
 *  @module Types
 */

import { RecurringTokenPrivilege } from "../TransactionTokens.js";

import { CardBrand } from "./enums.js";
import { AmountWithCurrency } from "./types.js";

export enum TransferMatchAmount {
    MAXIMUM = "maximum",
    MINIMUM = "minimum",
    EXACT = "exact",
    DISABLED = "disabled",
}

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
}

export interface QRScanConfigurationItem extends PaymentTypeConfiguration {
    forbiddenQrScanGateways: string[];
}

export type QRMerchantConfigurationItem = PaymentTypeConfiguration;

export type ConvenienceConfigurationItem = PaymentTypeConfiguration;

export type OnlineConfigurationItem = PaymentTypeConfiguration;

export type PaidyConfigurationItem = PaymentTypeConfiguration;

export type BankTransferConfiguration = PaymentTypeConfiguration & {
    matchAmount: TransferMatchAmount;
    expiration: string;
    /**
     *Ensure that the charge expires when the merchant "expects" it to expire.
     */
    expirationTimeShift: {
        enabled: boolean;

        /**
         *  Time with Time Zone.
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
}

export interface InstallmentsConfigurationItem extends PaymentTypeConfiguration, InstallmentsConfiguration {}

export interface SecurityConfiguration {
    inspectSuspiciousLoginAfter?: string;
    limitChargeByCardConfiguration?: {
        quantityOfCharges: number;
        durationWindow: string;
    };
    refundPercentLimit?: number;
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
    userTransactionsConfiguration?: UserTransactionsConfiguration;
    checkoutConfiguration: CheckoutConfiguration;
    descriptorProvidedConfiguration?: DescriptorProvidedConfiguration;
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
    securityConfiguration?: Partial<SecurityConfiguration>;
}

export type ConfigurationCreateParams = ConfigurationParams;
export type ConfigurationUpdateParams = ConfigurationParams;
