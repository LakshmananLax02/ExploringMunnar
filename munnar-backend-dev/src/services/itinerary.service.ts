import { Prisma } from "@prisma/client";
import { ItineraryDTO, ItineraryListDTO } from "../dto/itinerary.dto";
import { ApiError } from "../utils/api-error";
import { ItineraryRepository } from "../repositories/itinerary.repository";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";
import { UpdateStatusDTO } from "../dto/status-update.dto";

const itineraryRepo = new ItineraryRepository();
const userService = new UserService();

export class ItineraryService {
  /**
   * Create a new itinerary
   */
  async createItinerary(dto: ItineraryDTO) {
    try {
      await userService.validateUserId(dto.userId);

      return await itineraryRepo.create({
        full_name: dto.fullName,
        mobile_number: dto.mobileNumber,
        mail_id: dto.mailId ?? "",

        coming_from: dto.comingFrom ?? "",
        type_of_group: dto.typeOfGroup ?? "",

        adult: dto.adult ?? 0,
        child: dto.child ?? 0,

        night_stays: dto.nightStays ?? 0,
        rooms_required: dto.roomsRequired ?? 1,

        room_budget: dto.roomBudget ?? "",
        car_category: dto.carCategory ?? "",
        taxi_type: dto.taxiType ?? "",
        contact_method: dto.contactMethod ?? "",
        notes: dto.notes ?? null,

        ...(dto.startDate && { start_date: new Date(dto.startDate) }),
        ...(dto.endDate && { end_date: new Date(dto.endDate) }),

        ...(dto.hotelRequired && { hotels: dto.hotelRequired }),
        ...(dto.taxiRequirement && { taxis: dto.taxiRequirement }),
        ...(dto.routes && {
          routes: dto.routes.map((r) => ({
            route: r.route,
            distance: r.distance,
          })),
        }),

        user: {
          connect: { id: dto.userId },
        },

        ...(dto.attractionIds?.length && {
          attractions: {
            create: dto.attractionIds.map((id) => ({
              attraction: { connect: { id } },
            })),
          },
        }),
      });
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err; // already structured
      }
      throw new ApiError(
        500,
        `Database error while creating itinerary: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  async listItineraries(dto: ItineraryListDTO) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    // Dynamic WHERE filter
    const where: Prisma.itineraryWhereInput = {
      is_active: true,
      ...(dto.search
        ? { full_name: { contains: dto.search, mode: "insensitive" } }
        : {}),
      ...(dto.status ? { status: dto.status } : {}),
    };

    // Fetch data + total count in parallel
    const [itineraries, totalRecords] = await Promise.all([
      itineraryRepo.findItineraries(where, skip, limit),
      itineraryRepo.countItineraries(where),
    ]);

    return {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      itineraries,
    };
  }

  async updateItineraryStatus(itineraryId: number, req: UpdateStatusDTO) {
    try {
      return await itineraryRepo.updateStatus(itineraryId, req);
    } catch (err: any) {
      // Handle case where itinerary doesn't exist
      if (err.code === "P2025") {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Itinerary not found",
          "ItineraryNotFound"
        );
      }
      throw err;
    }
  }
}
