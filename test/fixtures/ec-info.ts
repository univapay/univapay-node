import { ECInfoItem } from "../../src/resources/index.js";

import { generateFixture as generateForm } from "./ec-form.js";
import { generateFixture as generateLink } from "./ec-form-link.js";
import { generateFixture as generateProduct } from "./links-products.js";

export const generateFixture = (): ECInfoItem => ({
    form: generateForm(),
    link: generateLink(),
    products: [generateProduct()],
});
