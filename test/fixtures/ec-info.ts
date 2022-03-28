import { ECInfoItem } from "../../src/resources";

import { generateFixture as generateForm } from "./ec-form";
import { generateFixture as generateLink } from "./ec-form-link";

export const generateFixture = (): ECInfoItem => ({
    form: generateForm(),
    link: generateLink(),
});
