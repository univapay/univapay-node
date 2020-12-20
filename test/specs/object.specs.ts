import { expect } from "chai";

import { toSnakeCase, transformKeys } from "../../src/utils/object";

describe("Object Helpers", () => {
    it("should format the object keys recursively", () => {
        const data = {
            key1: "Value 1",
            key2: { key21: "Value 2" },
            myKey1: {
                mySubKey11: "Value 3-1",
                mySubKey12: "Value 3-2",
                mySubKey13: ["Value 3-3-1", "Value 3-3-2"],
            },
            myKey2: [
                {
                    mySubKey21: "Value 4-1",
                    "mySub.Key21": "Value 4-1",
                    mySubKey22: "Value 4-2",
                    mySubKey23: ["Value 4-3-1", "Value 4-3-2"],
                },
            ],
            myKey3: ["Value 5-1", "Value 5-2"],
            myIgnoredKey1: { myIgnoredKey11: "Ignored value 11", "my-ignored-key=12": "Ignored value 12" },
            myKey4: { myIgnoredKey2: "Ignored value 21" },
        };

        const formattedData = transformKeys(data, toSnakeCase, ["myIgnoredKey1", "myIgnoredKey2"]);

        expect(formattedData).eql({
            key1: "Value 1",
            key2: { key21: "Value 2" },
            my_key1: {
                my_sub_key11: "Value 3-1",
                my_sub_key12: "Value 3-2",
                my_sub_key13: ["Value 3-3-1", "Value 3-3-2"],
            },
            my_key2: [
                {
                    my_sub_key21: "Value 4-1",
                    "my_sub.key21": "Value 4-1",
                    my_sub_key22: "Value 4-2",
                    my_sub_key23: ["Value 4-3-1", "Value 4-3-2"],
                },
            ],
            my_key3: ["Value 5-1", "Value 5-2"],
            myIgnoredKey1: {
                myIgnoredKey11: "Ignored value 11",
                "my-ignored-key=12": "Ignored value 12",
            },
            my_key4: {
                myIgnoredKey2: "Ignored value 21",
            },
        });
    });
});
