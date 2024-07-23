export interface GrpcClient {
  get<T>(service: string): T;
}
