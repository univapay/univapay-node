/**
 *  @internal
 *  @module Types
 */

export interface WithCreatedOn {
    createdOn?: string;
}

export interface WithIdempotentKey {
    idempotentKey?: string;
}

export interface WithConfig<T> {
    configuration: T;
}

export interface AmountWithCurrency {
    amount: number;
    currency: string;
    duration?: string;
}

export interface PhoneNumber {
    countryCode?: string;
    localNumber?: string;
}

export interface Metadata {
    [key: string]: string | number | bigint | boolean | (string | number | bigint | boolean)[];
}

export interface InvoiceChargeFee {
    chargeVolume: number;
    chargeInvoiceFee: number;
}

export type WithMerchantName<Item> = Item & { merchantName: string };
export type WithStoreMerchantName<Item> = Item & { merchantName: string; storeName: string };
