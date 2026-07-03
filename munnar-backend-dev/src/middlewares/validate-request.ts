import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const extractMessages = (errs: any[], prefix = ""): string[] => {
        let msgs: string[] = [];

        for (const err of errs) {
          // Top-level constraints (e.g., on the main DTO)
          if (err.constraints) {
            msgs.push(
              ...Object.values(err.constraints as { [key: string]: string })
            );
          }

          // Nested errors (e.g., inside rules array)
          if (err.children && err.children.length > 0) {
            err.children.forEach((child: any, index: number) => {
              const fieldPrefix = err.property
                ? `${err.property}[${index}]`
                : `item ${index}`;
              const childMsgs = extractMessages([child], fieldPrefix);
              msgs.push(...childMsgs.map((msg) => `${fieldPrefix}: ${msg}`));
            });
          }
        }

        return msgs;
      };

      const messages = extractMessages(errors);
      const errorMessage =
        messages.length > 0 ? messages.join("; ") : "Invalid data provided";

      const error = new ApiError(
        StatusCodes.BAD_REQUEST,
        errorMessage,
        "ValidationError"
      );
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        type: error.type,
      });
    }

    req.body = dto;
    next();
  };
};
