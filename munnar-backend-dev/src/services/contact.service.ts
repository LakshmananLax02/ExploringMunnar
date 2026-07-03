import { ContactRepository } from "../repositories/contact.repository";
import { ContactFilterDto, CreateContactDto, UpdateContactStatusDto } from "../dto/contact.dto";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

const contactRepository = new ContactRepository();

export class ContactService {
  async createContact(dto: CreateContactDto) {
    return await contactRepository.create(dto);
  }

  async getContactsList(filters: ContactFilterDto) {
    const pageNumber = filters.pageNumber || 1;
    const take = 10;
    const skip = (pageNumber - 1) * take;

    const { contacts, totalRecords } = await contactRepository.getList(
      filters,
      skip,
      take
    );

    return {
      data: contacts,
      pagination: {
        currentPage: pageNumber,
        pageSize: take,
        totalRecords,
        totalPages: Math.ceil(totalRecords / take),
        hasMore: pageNumber * take < totalRecords,
      },
    };
  }

  async updateContactStatus(id: string, dto: UpdateContactStatusDto) {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Contact inquiry not found",
        "NotFound"
      );
    }

    return await contactRepository.updateStatus(id, dto);
  }
}
