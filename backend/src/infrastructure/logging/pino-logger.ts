import pino, { type Level } from "pino";

import { requestContext } from "@/application/context/request-context";
import type { LogData, Logger } from "@/application/logging/logger";

export type LogLevel = Level | "silent";

export const createPinoLogger = (level: LogLevel): Logger => {
  const pinoLogger = pino({
    level,
    base: { service: "rebalance-backend" },
    formatters: { level: (label) => ({ level: label }) },
    serializers: { error: pino.stdSerializers.err },
    redact: {
      paths: [
        "request.headers.authorization",
        "request.headers.cookie",
        "password",
        "token",
        "*.password",
        "*.token",
        "*.secret",
      ],
      censor: "[REDACTED]",
    },
    mixin: () => {
      const requestId = requestContext.getRequestId();
      return requestId ? { requestId } : {};
    },
  });

  const write =
    (method: "debug" | "info" | "warn" | "error") => (message: string, data?: LogData) =>
      pinoLogger[method](data ?? {}, message);

  return {
    debug: write("debug"),
    info: write("info"),
    warn: write("warn"),
    error: write("error"),
  };
};
