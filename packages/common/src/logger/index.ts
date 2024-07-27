import pino from "pino";
import { ILogger } from "../interfaces/logger.interface.ts";

export class Logger implements ILogger {
  private logger;

  constructor() {
    this.logger = pino();
  }

  info(message: any, ...params: any[]): void {
    this.logger.info(message, ...params);
  }

  fatal(message: any, ...params: any[]): void {
    this.logger.fatal(message, ...params);
  }

  warn(message: any, ...params: any[]): void {
    this.logger.warn(message, ...params);
  }

  error(message: any, ...params: any[]): void {
    this.logger.error(message, ...params);
  }

  debug(message: any, ...params: any[]): void {
    this.logger.debug(message, ...params);
  }
}
