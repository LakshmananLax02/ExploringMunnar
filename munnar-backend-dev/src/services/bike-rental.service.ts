import { BikeRentalDTO, GetBikeRentalDTO } from "../dto/bike-rental.dto";
import { BikeRentalRepository } from "../repositories/bike-rental.repository";
import { ApiError } from "../utils/api-error";
import { UserService } from "./user.service";

const bikeRepo = new BikeRentalRepository();
const userService = new UserService();

export class BikeRentalService {
  async createBikeRental(dto: BikeRentalDTO) {
    try {
      // ✅ Validate user existence
      await userService.validateUserId(dto.userId);

      // ✅ Create rental entry
      return await bikeRepo.create({
        name: dto.name,
        email: dto.email,
        pickup_location: dto.pickupLocation,
        drop_location: dto.dropLocation || null,
        date: new Date(dto.date),
        time: dto.time,
        mobile_number: dto.mobileNumber,
        no_of_days: Number(dto.noOfDays),
        notes: dto.notes || null,
        fuel_type: dto.fuelType,
        driver_needed: dto.driverNeeded,
        user: { connect: { id: dto.userId } },
      });
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        500,
        `Database error while creating bike rental: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Get bike rentals with pagination, search and filtering
   */
  async getBikeRentals(dto: GetBikeRentalDTO) {
    try {
      return await bikeRepo.getBikeRentals(dto);
    } catch (err: any) {
      throw new ApiError(
        500,
        `Error fetching bike rentals: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Update bike rental status
   */
  async updateBikeRentalStatus(id: number, status: string) {
    try {
      return await bikeRepo.updateStatus(id, status);
    } catch (err: any) {
      if (err.message.includes("not found")) {
        throw new ApiError(404, err.message, "NotFoundError");
      }
      throw new ApiError(
        500,
        `Error updating bike rental: ${err.message}`,
        "DatabaseError"
      );
    }
  }
}
