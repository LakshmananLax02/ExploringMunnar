import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ContactService } from "../services/contact.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { ApiError } from "../utils/api-error";

const contactService = new ContactService();

export const createContact = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const contact = await contactService.createContact(data);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Thank you! We will get back to you soon.",
      contact
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "ContactError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const getContactsList = async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const result = await contactService.getContactsList(filters);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Contacts fetched successfully",
      result
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "ContactFetchError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await contactService.updateContactStatus(id, data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Contact status updated successfully",
      updated
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "ContactUpdateError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};
