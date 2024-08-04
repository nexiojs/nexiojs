export interface ILogger {
  info(message: any, ...params: any[]): void;
  fatal(message: any, ...params: any[]): void;
  warn(message: any, ...params: any[]): void;
  error(message: any, ...params: any[]): void;

  debug?(message: any, ...params: any[]): void;
  verbose?(message: any, ...params: any[]): void;
}
