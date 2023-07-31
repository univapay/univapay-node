import { expect } from "chai";

import { containsBinaryData, objectToFormData } from "../../src/api/utils/payload.js";

const arrayChunk = <T>(arr: T[], len: number): T[][] =>
    Array.from(
        Array(Math.ceil(arr.length / len))
            .fill(undefined)
            .map((_, i) => arr.slice(i * len, i * len + len)),
    );

describe("Payload Helpers", () => {
    it("should detect binary data in object", () => {
        const asserts: [Record<string, unknown>, boolean][] = [
            [{ foo: "bar" }, false],
            [{ foo: ["bar"] }, false],
            [
                {
                    foo: "bar",
                    foo1: {
                        bar: "test",
                    },
                },
                false,
            ],
            [
                {
                    foo: "bar",
                    foo2: Buffer.from("test"),
                },
                true,
            ],
            [
                {
                    foo: "bar",
                    foo2: [Buffer.from("test")],
                },
                true,
            ],
            [
                {
                    foo: "bar",
                    foo2: [{ fizz: Buffer.from("test") }],
                },
                true,
            ],
            [
                {
                    foo: "bar",
                    foo2: {
                        bar: Buffer.from("test"),
                    },
                },
                true,
            ],
            [
                {
                    foo: "bar",
                    foo2: {
                        bar: Buffer.from("test"),
                    },
                    foo3: {
                        bar: "fizz",
                    },
                },
                true,
            ],
        ];

        for (const [data, expectation] of asserts) {
            expect(containsBinaryData(data)).to.equal(expectation);
        }
    });

    it("should create FormData object from raw data object", () => {
        const obj = {
            foo: "bar",
            foo1: {
                bar: "fizz",
            },
            foo2: ["bar"],
            foo3: [{ bar: "fizz" }],
            foo4: Buffer.from("test"),
            foo5: undefined,
            foo6: {
                bar: undefined,
            },
            foo7: [{ fooBar: "fizz" }],
            fooBar: {
                fizzBuzz: "test",
            },
        };

        const formData = objectToFormData(obj);

        expect(formData).to.be.instanceOf(FormData);

        // This will only work in nodeJs environment
        const names = arrayChunk<string>((formData as any)._streams, 3).map(
            ([name]: string[]) => name.match(/name="(.*)"/i)[1],
        );

        expect(names)
            .to.be.array()
            .eql(["foo", "foo1.bar", "foo2[0]", "foo3[0].bar", "foo4", "foo7[0].foo_bar", "foo_bar.fizz_buzz"])
            .and.not.containingAnyOf(["foo5", "foo6.bar"]);
    });

    it("should create FormData object from raw data object with a specific key formatter", () => {
        const obj = {
            foo: "bar",
            foo2: ["bar"],
            fooBar: {
                fizzBuzz: "test",
            },
        };

        const formData = objectToFormData(obj, (key) => key);

        expect(formData).to.be.instanceOf(FormData);

        // This will only work in nodeJs environment
        const names = arrayChunk<string>((formData as any)._streams, 3).map(
            ([name]: string[]) => name.match(/name="(.*)"/i)[1],
        );

        expect(names).to.be.array().which.deep.equals(["foo", "foo2[0]", "fooBar.fizzBuzz"]);
    });
});
