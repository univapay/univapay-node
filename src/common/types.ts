type Primitive = string | number | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type Builtin = Primitive | Date | RegExp | Function | Error;

type DeepNullInner<T> = T extends Builtin
    ? T
    : T extends Map<infer K, infer V>
      ? Map<K, DeepNullInner<V>>
      : T extends Set<infer U>
        ? Set<DeepNullInner<U>>
        : T extends readonly unknown[]
          ? { [K in keyof T]: DeepNullInner<T[K]> }
          : T extends object
            ? { [K in keyof T]: RecursiveNull<T[K]> }
            : T;

export type RecursiveNull<T> = DeepNullInner<T> | null;
