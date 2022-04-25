import { v4 as uuid } from "uuid";

import { StoreItem } from "../../src/resources/Stores.js";

import { generateFixture as generateConfiguration } from "./common/configuration.js";

export const generateFixture = (): StoreItem => ({
    id: uuid(),
    merchantId: uuid(),
    name: "Store",
    configuration: generateConfiguration(),
    createdOn: new Date().toISOString(),
});
