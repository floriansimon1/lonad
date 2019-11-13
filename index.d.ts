type Predicate<T>                         = (t: T) => boolean;
type Unwrapper<T, U>                      = (t: T) => U;
type SideEffectsFunction<T>               = (t: T) => any;
type NullaryValueFactory<U>               = ()  => U;
type TransformationFunction<T, U>         = (t: T) => U;
type NullableTransformationFunction<T, U> = (t: T) => U;

interface OptionalMembers {
  isOptionalInstance: boolean;
  valuePresent:       boolean;
  valueAbsent:        boolean;
}

interface OptionalMatchClauses<T, U, V> {
  Some?: Unwrapper<T, U>;
  None?: NullaryValueFactory<V>;
}

interface ParsedOptional<T> extends OptionalMembers {
  value?: T;
}

interface OptionalType<T> extends OptionalMembers {
  nullableMap<U>(λ: NullableTransformationFunction<T, U>):       OptionalType<U>;
  or<U>(replacement: (() => OptionalType<U>) | OptionalType<U>): OptionalType<T> | OptionalType<U>;
  match<U, V>(clauses: OptionalMatchClauses<T, U, V>):           U | V;
  transform<U>(λ: TransformationFunction<T, U>):                 OptionalType<U>;
  map<U>(λ: TransformationFunction<T, U>):                       OptionalType<U>;
  recover<U>(λ: NullaryValueFactory<U>):                         OptionalType<U>;
  optionalProperty<U>(property: string):                         OptionalType<U>;
  nullableProperty<U>(property: string):                         OptionalType<U>;
  flatMap<U>(λ: (t: T) => OptionalType<U>):                      OptionalType<U>;
  tap(λ: SideEffectsFunction<T>):                                OptionalType<T>;
  property<U>(property: string):                                 OptionalType<U>;
  getOrElse<U>(replacement: U):                                  T | U;
  satisfies(λ: Predicate<T>):                                    boolean;
  valueEquals<U>(value: U):                                      boolean;
  filter(λ: Predicate<T>):                                       OptionalType<T>;
  reject(λ: Predicate<T>):                                       OptionalType<T>;
  get(message?: string):                                         T;
  replace<U>(value: U):                                          OptionalType<U>;
}

type OptionalTransformer<T, U> = (optional: OptionalType<T>) => U;
type OptionalMatcher<T, U, V>  = (optional: OptionalType<T>) => U | V;
type BindFunction<T, U>        = (t: T) => OptionalType<U>;

type OptionalMapper<T, U> = OptionalTransformer<T, OptionalType<U>>;

export namespace Optional {
  export function Some<T>(value: T): OptionalType<T>;
  export function None():            OptionalType<any>;

  export function fromParsedJson<T>(parsedJson: ParsedOptional<T>): OptionalType<T>;
  export function first(optionals: OptionalType<any>[]):            OptionalType<any>;
  export function all(optionals: OptionalType<any>[]):              OptionalType<any[]>;
  export function fromNullable<T>(value?: T):                       OptionalType<T>;
  export function when<T>(truthy: any, value: T):                   OptionalType<T>;

  export function nullableMap<T, U>(λ: NullableTransformationFunction<T, U>): OptionalMapper<T, U>;
  export function nullableMap<T, U>(
    λ:        NullableTransformationFunction<T, U>,
    optional: OptionalType<T>
  ): Optional<U>;

  export function match<T, U, V>(clauses: OptionalMatchClauses<T, U, V>): OptionalMatcher<T, U, V>;
  export function match<T, U, V>(
    clauses:  OptionalMatchClauses<T, U, V>,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function transform<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  export function transform<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function map<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  export function map<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function recover<T, U>(λ: NullaryValueFactory<U>): OptionalMapper<T, U>;
  export function recover<T, U>(
    λ:        NullaryValueFactory<U>,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function optionalProperty<T, U>(property: string): OptionalMapper<T, U>;
  export function optionalProperty<T, U>(
    property: string,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function nullableProperty<T, U>(property: string): OptionalMapper<T, U>;
  export function nullableProperty<T, U>(
    property: string,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function property<T, U>(property: string): OptionalMapper<T, U>;
  export function property<T, U>(
    property: string,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function flatMap<T, U>(λ: BindFunction<T, U>): OptionalMapper<T, U>;
  export function flatMap<T, U>(
    λ:        BindFunction<T, U>,
    optional: OptionalType<T>
  ): OptionalType<U>;

  export function tap<T>(λ: SideEffectsFunction<T>): OptionalMapper<T, T>;
  export function tap<T>(
    λ:        SideEffectsFunction<T>,
    optional: OptionalType<T>
  ): OptionalType<T>;

  export function or<T, U>(replacement: (() => OptionalType<U>) | OptionalType<U>): OptionalMapper<T, U>;
  export function or<T, U>(
    replacement: (() => OptionalType<U>) | OptionalType<U>,
    optional:    OptionalType<T>
  ): OptionalType<U>;

  export function getOrElse<T, U>(replacement: U): OptionalTransformer<T, T | U>;
  export function getOrElse<T, U>(
    replacement: U,
    optional:    OptionalType<T>
  ): T | U;

  export function satisfies<T>(predicate: Predicate<T>): OptionalTransformer<T, boolean>;
  export function satisfies<T>(
    predicate: Predicate<T>,
    optional:  OptionalType<T>
  ): boolean;

  export function valueEquals<T, U>(value: U): OptionalTransformer<T, boolean>;
  export function valueEquals<T, U>(
    value:     U,
    optional:  OptionalType<T>
  ): boolean;

  export function filter<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  export function filter<T>(
    predicate: Predicate<T>,
    optional:  OptionalType<T>
  ): OptionalType<T>;

  export function reject<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  export function reject<T>(
    predicate: Predicate<T>,
    optional:  OptionalType<T>
  ): OptionalType<T>;

  export function get<T>(message: string): OptionalTransformer<T, T>;
  export function get<T>(
    message:   string,
    optional:  OptionalType<T>
  ): OptionalTransformer<T, T>;

  export function replace<T, U>(replacement: U): OptionalMapper<T, U>;
  export function replace<T, U>(
    replacement: U,
    optional:    OptionalType<T>
  ): OptionalType<T>;
}

export type Optional<T> = OptionalType<T>;
export type Result      = any;

