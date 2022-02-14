/**
 *  @internal
 *  @module Types
 */

import { RecurringTokenPrivilege } from "../TransactionTokens";

import { CardBrand } from "./enums";
import { AmountWithCurrency } from "./types";

export enum TransferMatchAmount {
    MAXIMUM = "maximum",
    MINIMUM = "minimum",
    EXACT = "exact",
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
    virtualBankAccountsThreshold: number;
    virtualBankAccountsFetchCount: number;
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
    cardBrandPercentFees: CardBrandPercentFeesItem;
    cardConfiguration: CardConfigurationItem;
    convenienceConfiguration: ConvenienceConfigurationItem;
    onlineConfiguration: OnlineConfigurationItem;
    paidyConfiguration: PaidyConfigurationItem;
    bankTransferConfiguration: BankTransferConfiguration;
    country: string;
    displayTimeZone: string;
    flatFees: AmountWithCurrency[];
    installmentsConfiguration: InstallmentsConfigurationItem;
    language: string;
    logoUrl?: string;
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
    cardConfiguration?: Partial<CardConfigurationItem>;
    qrScanConfiguration?: Partial<QRScanConfigurationItem>;
    qrMerchantConfiguration?: Partial<QRMerchantConfigurationItem>;
    convenienceConfiguration?: Partial<ConvenienceConfigurationItem>;
    onlineConfiguration?: Partial<OnlineConfigurationItem>;
    paidyConfiguration?: Partial<PaidyConfigurationItem>;
    installmentsConfiguration?: Partial<InstallmentsConfigurationItem>;
    recurringTokenConfiguration?: Partial<RecurringTokenConfiguration>;
    descriptorProvidedConfiguration?: Partial<DescriptorProvidedConfiguration>;
    subscriptionConfiguration?: Partial<SubscriptionsConfiguration>;
    checkoutConfiguration?: Partial<CheckoutConfiguration>;
    securityConfiguration?: Partial<SecurityConfiguration>;
}

export type ConfigurationCreateParams = ConfigurationParams;
export type ConfigurationUpdateParams = ConfigurationParams;
