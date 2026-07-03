import {
  SelfDriveRequestDTO,
  GetSelfDriveRequestsDTO,
} from "../dto/self-drive-request.dto";
import { UpdateStatusDTO } from "../dto/status-update.dto";
import { SelfDriveRequestRepository } from "../repositories/self-drive-request.repository";
import { ApiError } from "../utils/api-error";
import { UserService } from "./user.service";

const selfDriveRepo = new SelfDriveRequestRepository();
const userService = new UserService();

export class SelfDriveRequestService {
  /**
   * Create self-drive car request
   */
  async createSelfDriveRequest(dto: SelfDriveRequestDTO) {
    try {
      // ✅ Validate that user exists
      await userService.validateUserId(dto.userId);

      // ✅ Create record in DB
      return await selfDriveRepo.create({
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
        car_category: dto.carCategory,
        user: { connect: { id: dto.userId } },
      });
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        500,
        `Database error while creating self-drive car request: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Get self-drive requests with pagination, search and filtering
   */
  async getSelfDriveRequests(dto: GetSelfDriveRequestsDTO) {
    try {
      return await selfDriveRepo.getSelfDriveRequests(dto);
    } catch (err: any) {
      throw new ApiError(
        500,
        `Error fetching self-drive requests: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  /**
   * Update self-drive request status
   */
  async updateSelfDriveRequestStatus(id: number, dto: UpdateStatusDTO) {
    try {
      return await selfDriveRepo.updateStatus(id, dto.status);
    } catch (err: any) {
      if (err.message.includes("not found")) {
        throw new ApiError(404, err.message, "NotFoundError");
      }
      throw new ApiError(
        500,
        `Error updating self-drive request: ${err.message}`,
        "DatabaseError"
      );
    }
  }
}
