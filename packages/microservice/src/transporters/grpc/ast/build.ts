import type {
  EnumNode,
  FieldNode,
  InputOutputType,
  MessageNode,
  Method,
  ProtoSchemaNode,
  Service,
} from "./node";

const generateField = (field: FieldNode): string => {
  const repeated = field.repeated ? "repeated " : "";
  return `${repeated}${field.type} ${field.name} = ${field.id};`;
};

const generateEnum = (enumDef: EnumNode): string => {
  const values = enumDef.values
    .map((value) => `  ${value.name} = ${value.id};`)
    .join("\n");
  return `enum ${enumDef.name} {\n${values}\n}`;
};

const generateMessage = (message: MessageNode): string => {
  const fields = message.fields
    .map((field) => `  ${generateField(field)}`)
    .join("\n");
  return `message ${message.name} {\n${fields}\n}`;
};

const generateImport = (imports?: string[]): string => {
  if (!imports || imports.length === 0) return "";

  return imports.map((pack) => `import "${pack}";`).join("\n\n") + "\n\n";
};

const generateInputOutput = (type?: InputOutputType) => {
  if (!type) return "(Empty)";

  return `(${type.stream ? "stream " : ""}${type.name})`;
};

const generateMethod = (method: Method): string => {
  return `\trpc ${method.name} ${generateInputOutput(
    method.inputType
  )} returns ${generateInputOutput(method.outputType)};`;
};

const generateService = (service: Service): string => {
  const methods = service.methods.map(generateMethod).join("\n");
  return `service ${service.name} {\n${methods}\n}`;
};

export const buildFromAST = (schema: ProtoSchemaNode): string => {
  const syntax = `syntax = "proto${schema?.version ?? 2}";\n\n`;
  const _import = generateImport(schema.imports);
  const packageLine = schema.package ? `package ${schema.package};\n\n` : "";
  const enums = schema.enums ? schema.enums.map(generateEnum).join("\n\n") : "";
  const messages = schema.messages.map(generateMessage).join("\n\n");
  const services = schema.services?.map(generateService).join("\n\n") ?? "";

  const empty = `message Empty {}`;

  return `${syntax}${_import}${packageLine}${enums}${messages}\n\n${services}\n\n${empty}`;
};
