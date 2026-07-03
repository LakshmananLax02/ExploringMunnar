import { ContactFilterDto, ContactStatus } from "../dto/contact.dto";
import { prisma } from "../prisma-client";
import { Prisma } from "@prisma/client";

export class ContactRepository {
  async create(data: Prisma.contact_formCreateInput) {
    return await prisma.contact_form.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        notes: data.notes,
      },
    });
  }

  async getList(filters: ContactFilterDto, skip: number, take: number) {
    const { search, status } = filters;

    const where: any = {
      is_active: true,
      ...(status ? { status } : {}),
      ...(search && {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [contacts, totalRecords] = await Promise.all([
      prisma.contact_form.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          email: true,
          notes: true,
          status: true,
          comments: true,
          created_at: true,
        },
      }),
      prisma.contact_form.count({ where }),
    ]);

    return { contacts, totalRecords };
  }

  async findById(id: string) {
    return await prisma.contact_form.findUnique({
      where: { id, is_active: true },
    });
  }

  async updateStatus(
    id: string,
    data: { status: ContactStatus; comments?: string }
  ) {
    return await prisma.contact_form.update({
      where: { id },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        email: true,
        notes: true,
        status: true,
        comments: true,
        updated_at: true,
      },
    });
  }
}
