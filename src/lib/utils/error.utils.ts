export interface IErrorResponse {
  error: {
    message: string;
  };
  status: number;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }

  toResponse(): IErrorResponse {
    return {
      error: {
        message: this.message,
      },
      status: this.statusCode,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
}

export class DuplicateKeyError extends AppError {
  constructor(field: string) {
    super(`${field} already exists`, "DUPLICATE_KEY_ERROR", 409);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export function handleMongoError(error: any): AppError {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return new DuplicateKeyError(field);
  }

  return new AppError(
    error.message || "Internal server error",
    "INTERNAL_SERVER_ERROR",
    500
  );
}

export function formatError(error: unknown): IErrorResponse {
  if (error instanceof AppError) {
    return error.toResponse();
  }

  const defaultError = new AppError(
    error instanceof Error ? error.message : "Internal server error",
    "INTERNAL_SERVER_ERROR",
    500
  );

  return defaultError.toResponse();
}
