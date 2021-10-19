import {
    CardBrandPercentFeesItem,
    CheckoutConfiguration,
    InstallmentsConfiguration,
    SubscriptionsConfiguration,
    UserTransactionsConfiguration,
} from "./Configuration";
import { TransferScheduleItem } from "./TransferSchedule";
import { AmountWithCurrency, InvoiceChargeFee, WithCreatedOn } from "./types";

export interface PlatformUserDefaults {
    percentFee: number;
    transferSchedule: TransferScheduleItem;
    flatFees: AmountWithCurrency[];
    waitPeriod: string;
    cardBrandPercentFees: Partial<CardBrandPercentFeesItem>;
    minTransferPayout: AmountWithCurrency;
    installmentsConfiguration: Partial<InstallmentsConfiguration>;
    userTransactionsConfiguration?: UserTransactionsConfiguration;
    checkoutConfiguration?: CheckoutConfiguration;
    subscriptionConfiguration: Partial<SubscriptionsConfiguration>;
    onlyDirectCurrency: boolean;
    platformCredentialsEnabled: boolean;
    taggedPlatformCredentialsEnabled: boolean;
}

export interface PlatformPaymentDefaults {
    cardsEnabled: boolean;
    qrScanEnabled: boolean;
    qrMerchantEnabled: boolean;
    prepaidEnabled: boolean;
    prepaidAuthorizationEnabled: boolean;
    debitEnabled: boolean;
    debitAuthorizationEnabled: boolean;
    convenienceEnabled: boolean;
    onlineEnabled: boolean;
    paidyEnabled: boolean;
}

export interface PlatformItem extends WithCreatedOn {
    id: string;
    domain: string;
    name: string;
    ownerId?: string;
    invoiceChargeFee: InvoiceChargeFee[];
}

export interface PlatformConfiguration {
    adminEmailAddresses?: string[];
    country: string;
    currency: string;
    defaultLanguage: string;
    limitCardChargeByCardConfiguration?: {
        quantityOfCharges: number;
        durationWindow: string;
    };
    displayImages: {
        bannerUri?: string;
        faviconUri?: string;
        placeholderUri?: string;
        squareUri?: string;
    };
    maximumChargeAmounts: AmountWithCurrency[];
    minimumChargeAmounts: AmountWithCurrency[];
    notifyUserTransactions: boolean;
    paymentDefaults: PlatformPaymentDefaults;
    recurringCardChargeCvvConfirmationThreshold?: AmountWithCurrency[];
    refundPercentLimit: number;
    supportedLanguages: string[];
    timeZone: string;
    userDefaults: PlatformUserDefaults;
}
