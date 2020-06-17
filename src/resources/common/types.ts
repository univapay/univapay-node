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

export interface PaymentError {
    message: string;
    code: number;
    details?: string;
}

export interface Metadata {
    [key: string]: any;
}

export interface InvoiceChargeFee {
    chargeVolume: number;
    chargeInvoiceFee: number;
}
