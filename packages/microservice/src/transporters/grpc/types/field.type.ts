import { Kind } from "../enums/kind.enum.ts";
import { FIELD_KIND } from "../metadata/symbols.ts";
import Long from "long";

export type GrpcType =
  | Double
  | Float
  | Int32
  | Int64
  | Uint32
  | Uint64
  | Sint32
  | Sint64
  | Fixed32
  | Fixed64
  | Sfixed32
  | Sfixed64
  | Bool
  | String
  | Bytes;

export class Double {
  static [FIELD_KIND] = Kind.Double;
}

export class Float {
  static [FIELD_KIND] = Kind.Float;
}

export class Int32 {
  static [FIELD_KIND] = Kind.Int32;
}

export class Int64 extends Long {
  static [FIELD_KIND] = Kind.Int64;

  constructor(low: number, high?: number, unsigned?: boolean) {
    super(low, high, unsigned);
  }
}

export class Uint32 {
  static [FIELD_KIND] = Kind.Uint32;
}

export class Uint64 extends Long {
  static [FIELD_KIND] = Kind.Uint64;
}

export class Sint32 {
  static [FIELD_KIND] = Kind.Sint32;
}

export class Sint64 extends Long {
  static [FIELD_KIND] = Kind.Sint64;
}

export class Fixed32 {
  static [FIELD_KIND] = Kind.Fixed32;
}

export class Fixed64 extends Long {
  static [FIELD_KIND] = Kind.Fixed64;
}

export class Sfixed32 {
  static [FIELD_KIND] = Kind.Sfixed32;
}

export class Sfixed64 extends Long {
  static [FIELD_KIND] = Kind.Sfixed64;
}

export class Bool {
  static [FIELD_KIND] = Kind.Bool;
}

export class String {
  static [FIELD_KIND] = Kind.String;
}

export class Bytes {
  static [FIELD_KIND] = Kind.Bytes;
}
