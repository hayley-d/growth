export class SessionLoadError extends Error {
  constructor(cause: unknown) {
    super("Could not load the session", { cause });
    this.name = "SessionLoadError";
  }
}
