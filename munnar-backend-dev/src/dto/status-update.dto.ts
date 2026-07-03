import { IsEnum } from "class-validator";

export enum booking_status {
  Pending = "Pending",
  Booked = "Booked",
  Canceled = "Canceled",
}

export class UpdateStatusDTO {
  @IsEnum(booking_status, { message: "Invalid booking status" })
  status!: booking_status;
}
