import { expect } from 'chai';
import { containsBinaryData, objectToFormData } from '../../src/api/utils/payload';

function arrayChunk<T>(arr: T[], len: number): T[][] {
    return Array.from(
        Array(Math.ceil(arr.length / len))
            .fill(undefined)
            .map((_, i) => arr.slice(i * len, i * len + len)),
    );
}

describe('Payload Helpers', function() {
    it('should detect binary data in object', function() {
        const asserts: [any, boolean][] = [
            [{ foo: 'bar' }, false],
            [{ foo: ['bar'] }, false],
            [
                {
                    foo: 'bar',
                    foo1: {
                        bar: 'test',
                    },
                },
                false,
            ],
            [
                {
                    foo: 'bar',
                    foo2: new Buffer(['test']),
                },
                true,
            ],
            [
                {
                    foo: 'bar',
                    foo2: [new Buffer(['test'])],
                },
                true,
            ],
            [
                {
                    foo: 'bar',
                    foo2: [{ fizz: new Buffer(['test']) }],
                },
                true,
            ],
            [
                {
                    foo: 'bar',
                    foo2: {
                        bar: new Buffer(['test']),
                    },
                },
                true,
            ],
            [
                {
                    foo: 'bar',
                    foo2: {
                        bar: new Buffer(['test']),
                    },
                    foo3: {
                        bar: 'fizz',
                    },
                },
                true,
            ],
        ];

        for (const [data, expectation] of asserts) {
            expect(containsBinaryData(data)).to.equal(expectation);
        }
    });

    it('should create FormData object from raw data object', function() {
        const obj = {
            foo: 'bar',
            foo1: {
                bar: 'fizz',
            },
            foo2: ['bar'],
            foo3: [{ bar: 'fizz' }],
            foo4: new Buffer(['test']),
            foo5: undefined,
            foo6: {
                bar: undefined,
            },
            fooBar: {
                fizzBuzz: 'test',
            },
        };

        const formData = objectToFormData(obj);

        expect(formData).to.be.instanceOf(FormData);

        // This will only work in nodeJs environment
        const names = arrayChunk((formData as any)._streams, 3).map(
            ([name]: string[]) => name.match(/name=\"(.*)\"/i)[1],
        );

        expect(names)
            .to.be.array()
            .containingAllOf(['foo', 'foo1.bar', 'foo2[0]', 'foo3[0].bar', 'foo4', 'foo_bar.fizz_buzz'])
            .and.not.containingAnyOf(['foo5', 'foo6.bar']);
    });
});
