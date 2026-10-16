export type DomainErrorKind =
  | "bad-request"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "conflict";

export class DomainError extends Error {
  readonly kind: DomainErrorKind;
  readonly details?: Record<string, unknown>;

  constructor(kind: DomainErrorKind, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.kind = kind;
    this.details = details;
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("bad-request", message, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("unauthorized", message, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("forbidden", message, details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("not-found", message, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("conflict", message, details);
    this.name = "ConflictError";
  }
}
