import { Blob } from "buffer";
import { expect } from "chai";

import { isBlob, missingKeys, toSnakeCase, transformKeys } from "../../src/utils/object";

describe("Object Helpers", () => {
    describe("transformKeys", () => {
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

        it("should format the object keys recursively without ingored keys", () => {
            const data = {
                key1: "Value 1",
                key2: { key21: "Value 2" },
            };

            const formattedData = transformKeys(data, toSnakeCase);

            expect(formattedData).eql({ key1: "Value 1", key2: { key21: "Value 2" } });
        });
    });

    describe("missingKeys", () => {
        it("return the missing keys when the object exists", () => {
            const result = missingKeys({ id: "1", role: null, name: undefined }, ["id", "name", "role", "age"]);

            expect(result).eql(["name", "age"]);
        });

        it("return an empty array when the keys are not provided", () => {
            const result = missingKeys({ id: "1", role: null, name: undefined });

            expect(result).eql([]);
        });

        it("should return all keys when the object does not exist", () => {
            const result = missingKeys(null, ["id", "name", "role", "age"]);

            expect(result).eql(["id", "name", "role", "age"]);
        });
    });

    describe("isBlob", () => {
        it("should return true when the parameter is a blob", function () {
            if (process.version < "v14.18") {
                // Blob was introduced in v14.18, so skip older versions
                this.skip();
            }

            expect(isBlob(new Blob(["test"]))).eql(true);
        });

        it("should return false when the object is not a blob", () => {
            expect(isBlob({ test: true })).eql(false);
        });

        it("should return false when the parameter is not an object", () => {
            expect(isBlob(1)).eql(false);
        });
    });
});
