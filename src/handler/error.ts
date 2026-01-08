import { Elysia } from "elysia";

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = new Elysia().onError(
  ({ error, set }) => {
    // Custom App Error
    if (error instanceof AppError) {
      set.status = error.status;
      return {
        success: false,
        message: error.message,
      };
    }

    // Native Error
    if (error instanceof Error) {
        set.status = 500;
        return {
          success: false,
          message: error.message,
        };
    }

    // Fallback 
    set.status = 500;
    return {
      success: false,
      message: "Internal server error",
    };
  }
);
