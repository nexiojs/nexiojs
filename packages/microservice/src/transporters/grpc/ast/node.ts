export interface FieldNode {
  name: string;
  type: string;
  id: number;
  repeated?: boolean;
}

export interface EnumValueNode {
  name: string;
  id: number;
}

export interface EnumNode {
  name: string;
  values: EnumValueNode[];
}

export interface MessageNode {
  name: string;
  fields: FieldNode[];
}

export interface InputOutputType {
  name: string;
  stream?: boolean;
}

export interface Method {
  name: string;
  inputType?: InputOutputType;
  outputType: InputOutputType;
}

export interface Service {
  name: string;
  methods: Method[];
}

export interface ProtoSchemaNode {
  package?: string;
  messages: MessageNode[];
  enums?: EnumNode[];
  version?: 2 | 3;
  imports?: string[];
  services?: Service[];
}
