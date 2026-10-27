export type AuthSession = {
  userId: string;
  role: string | null;
};

export type GetSession = (headers: Headers) => Promise<AuthSession | null>;

export type AuthHandler = (request: Request) => Promise<Response>;
