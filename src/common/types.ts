type AnyFunction = (...args: unknown[]) => unknown;
type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Leaf = Primitive | Date | RegExp | Error | AnyFunction | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>;

type DeepNullInner<T> = T extends Leaf
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
