import { v4 as uuid } from "uuid";

import { EmailItem } from "../../src/resources/Emails.js";

export const generateFixture = (): EmailItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    formId: uuid(),
    linkId: uuid(),

    email: "dummy-customer@test.com",
    customerName: "Dummy Customer",
    lang: "em-US",
    createdOn: new Date().toISOString(),
});
