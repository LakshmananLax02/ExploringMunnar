import {
  IsString,
  IsNumber,
  IsEnum,
  IsMobilePhone,
  IsDateString,
  Min,
  IsOptional,
  IsPositive,
  Max,
  IsEmail,
} from "class-validator";
import { Transform } from "class-transformer";
import { booking_status } from "./status-update.dto";

export enum vehicle_type {
  Sedan = "Sedan",
  Hatchback = "Hatchback",
  SUV = "SUV",
  Van = "Van",
  Bus = "Bus",
}

export class CabBookingDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;

  @IsString()
  pickupPoint!: string;

  @IsString()
  dropPoint!: string;

  @IsDateString({}, { message: "Date must be in ISO format (YYYY-MM-DD)" })
  date!: string;

  @IsString()
  time!: string;

  @IsMobilePhone("en-IN", {}, { message: "Invalid mobile number format" })
  mobileNumber!: string;

  @IsNumber()
  @Min(1, { message: "Number of passengers must be at least 1" })
  @Transform(({ value }) => parseInt(value))
  noOfPassengers!: number;

  @IsEnum(vehicle_type, { message: "Invalid vehicle type" })
  vehicleType!: vehicle_type;
}

export class GetCabBookingsDTO {
  @IsNumber()
  @IsPositive({ message: "Page must be a positive number" })
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsNumber()
  @IsPositive({ message: "Limit must be a positive number" })
  @Max(100, { message: "Limit cannot exceed 100" })
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @IsOptional()
  @IsString({ message: "Username must be a string" })
  @Transform(({ value }) => value === "" ? undefined : value)
  userName?: string;

  @IsOptional()
  @IsEnum(booking_status, { message: "Invalid booking status" })
  @Transform(({ value }) => value === "" ? undefined : value)
  status?: booking_status;
}
