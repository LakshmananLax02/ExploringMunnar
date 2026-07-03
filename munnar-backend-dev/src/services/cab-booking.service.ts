import { CabBookingDTO, GetCabBookingsDTO } from "../dto/cab-booking.dto";
import { ApiError } from "../utils/api-error";
import { CabBookingRepository } from "../repositories/cab-booking.repository";
import { UserService } from "./user.service";
import { UpdateStatusDTO } from "../dto/status-update.dto";

const cabBookingRepo = new CabBookingRepository();
const userService = new UserService();

export class CabBookingService {
  /**
   * Create cab booking
   */
  async createCabBooking(dto: CabBookingDTO) {
    try {
      await userService.validateUserId(dto.userId);

      return await cabBookingRepo.create({
        name: dto.name,
        email: dto.email,
        pickup_point: dto.pickupPoint,
        drop_point: dto.dropPoint,
        date: new Date(dto.date),
        time: dto.time,
        mobile_number: dto.mobileNumber,
        no_of_passengers: Number(dto.noOfPassengers),
        vehicle_type: dto.vehicleType,
        user: { connect: { id: dto.userId } },
      });
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        500,
        `Database error while creating cab booking: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Get cab bookings with pagination, search and filtering
   */
  async getCabBookings(dto: GetCabBookingsDTO) {
    try {
      return await cabBookingRepo.getCabBookings(dto);
    } catch (err: any) {
      throw new ApiError(
        500,
        `Error fetching cab bookings: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Update cab booking status
   */
  async updateCabBookingStatus(id: number, dto: UpdateStatusDTO) {
    try {
      return await cabBookingRepo.updateStatus(id, dto.status);
    } catch (err: any) {
      if (err.message.includes("not found")) {
        throw new ApiError(404, err.message, "NotFoundError");
      }
      throw new ApiError(
        500,
        `Error updating cab booking: ${err.message}`,
        "DatabaseError"
      );
    }
  }
}
