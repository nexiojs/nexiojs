export enum DecoratorKind {
  Body = 1,
  Headers = 2,
  Params = 3,
  Context = 4,
  SearchParams = 5,

  Args = 100,
  Query = 101,
  Mutation = 102,
  ResolveField = 103,
  InterfaceType = 104,
  Parent = 105,
  Info = 106,

  ResolveReference = 151,
  Reference = 152,

  MicroserviceClient = 200,

  Metadata = 250,
  GrpcInput = 251,
}
