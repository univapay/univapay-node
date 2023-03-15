import {
    BankTransferConfiguration,
    CardBrandPercentFeesItem,
    InstallmentsConfiguration,
    SubscriptionsConfiguration,
    UserTransactionsConfiguration,
    ConvenienceConfigurationItem,
} from "./Configuration.js";
import { TransferScheduleItem } from "./TransferSchedule.js";
import { AmountWithCurrency, InvoiceChargeFee, WithCreatedOn } from "./types.js";

type CheckoutConfiguration = {
    ecEmail: { enabled: boolean };
    ecProducts: { enabled: boolean };
};

export interface PlatformUserDefaults {
    bankTransferConfiguration: BankTransferConfiguration;
    convenienceConfiguration: ConvenienceConfigurationItem;
    percentFee: number;
    transferSchedule: TransferScheduleItem;
    flatFees: AmountWithCurrency[];
    waitPeriod: string;
    cardBrandPercentFees: Partial<CardBrandPercentFeesItem>;
    minTransferPayout: AmountWithCurrency;
    installmentsConfiguration: Partial<InstallmentsConfiguration>;
    userTransactionsConfiguration?: UserTransactionsConfiguration;
    checkoutConfiguration: CheckoutConfiguration;
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
    bankTransferEnabled: boolean;
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
    minRefundThreshold: number;
    supportedLanguages: string[];
    timeZone: string;
    userDefaults: PlatformUserDefaults;
}
