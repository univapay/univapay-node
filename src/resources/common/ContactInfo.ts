/**
 *  @internal
 *  @module Types
 */

import { PhoneNumber } from "./types.js";

export interface ContactInfo {
    name: string;
    companyName: string;
    phoneNumber: PhoneNumber;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export type ContactInfoPartial = Partial<ContactInfo>;
