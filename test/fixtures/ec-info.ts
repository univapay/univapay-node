import { v4 as uuid } from "uuid";

import { ECInfoItem } from "../../src/resources/ECInfo";

import { generateFixture as generateForm } from "./ec-form";
import { generateFixture as generateLink } from "./ec-form-link";
import { generateFixture as generateEmail } from "./emails";

export const generateFixture = (): ECInfoItem => ({
    id: uuid(),
    jwt: "myjwt",

    form: generateForm(),
    link: generateLink(),
    email: generateEmail(),
});
