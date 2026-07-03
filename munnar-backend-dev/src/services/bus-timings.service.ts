import { StatusCodes } from "http-status-codes";
import { BusTimingDTO } from "../dto/bus-timings.dto";
import { BusTimingRepository } from "../repositories/bus-timings.repository";
import { ApiError } from "../utils/api-error";

const busTimingRepo = new BusTimingRepository();

export class BusTimingService {
  async createBusTiming(dto: BusTimingDTO) {
    try {
      return await busTimingRepo.create({
        from: dto.from,
        to: dto.to,
        departure_time: dto.departureTime,
        arrival_time: dto.arrivalTime,
        duration: dto.duration,
        bus_type: dto.busType,
        price: Number(dto.price),
      });
    } catch (err: any) {
      if (err instanceof ApiError) throw err;

      throw new ApiError(
        500,
        `Database error while creating bus timing: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  async getBusTimings(search?: string) {
    return await busTimingRepo.getBusTimings(search);
  }

  async deleteBusTiming(id: number): Promise<void> {
    const busTiming = await busTimingRepo.findById(id);

    if (!busTiming) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Bus timing not found",
        "BusTimingNotFound"
      );
    }

    // 🔹 Idempotent behavior
    if (!busTiming.is_active) {
      return; // already deleted → success
    }

    await busTimingRepo.softDelete(id);
  }
  async updateBusTiming(id: number, dto: BusTimingDTO) {
    const existing = await busTimingRepo.findById(id);

    if (!existing) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Bus timing not found",
        "BusTimingNotFound"
      );
    }

    return await busTimingRepo.update(id, {
      from: dto.from,
      to: dto.to,
      departure_time: dto.departureTime,
      arrival_time: dto.arrivalTime,
      duration: dto.duration,
      bus_type: dto.busType,
      price: dto.price,
    });
  }
}
