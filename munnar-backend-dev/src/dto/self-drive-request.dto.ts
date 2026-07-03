import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsNumber,
  IsPositive,
  Max,
  IsEmail,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { vehicle_type } from "./cab-booking.dto";
import { booking_status } from "./status-update.dto";

export enum FuelType {
  Petrol = "Petrol",
  Diesel = "Diesel",
  EV = "EV",
}

export class SelfDriveRequestDTO {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;

  @IsString()
  @IsNotEmpty()
  pickupLocation!: string;

  @IsOptional()
  @IsString()
  dropLocation?: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  time!: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  noOfDays!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType!: FuelType;

  @IsBoolean()
  @IsNotEmpty()
  driverNeeded!: boolean;

  @IsEnum(vehicle_type)
  @IsNotEmpty()
  carCategory!: vehicle_type;
}

export class GetSelfDriveRequestsDTO {
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
  @Transform(({ value }) => (value === "" ? undefined : value))
  userName?: string;

  @IsOptional()
  @IsEnum(booking_status, { message: "Invalid booking status" })
  @Transform(({ value }) => (value === "" ? undefined : value))
  status?: booking_status;
}
