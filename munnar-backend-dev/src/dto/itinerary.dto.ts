// src/models/dto/itinerary.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsDateString,
  IsEnum,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { booking_status } from "@prisma/client";

export class RouteDTO {
  @IsNotEmpty()
  @IsString()
  route!: string;

  @IsNotEmpty()
  @IsString()
  distance!: string;
}

export class ItineraryDTO {
  /* ================= REQUIRED ================= */

  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber!: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  /* ================= OPTIONAL ================= */

  @IsOptional()
  @IsEmail()
  mailId?: string;

  @IsOptional()
  @IsString()
  comingFrom?: string;

  @IsOptional()
  @IsString()
  typeOfGroup?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  adult?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  child?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  nightStays?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  roomsRequired?: number;

  @IsOptional()
  @IsString()
  roomBudget?: string;

  @IsOptional()
  @IsString()
  carCategory?: string;

  @IsOptional()
  @IsString()
  taxiType?: string;

  @IsOptional()
  @IsString()
  contactMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hotelRequired?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  taxiRequirement?: string[];

  @IsOptional()
  @IsArray()
  routes?: RouteDTO[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attractionIds?: string[];
}

export class ItineraryListDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number; // ✅ optional

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number; // ✅ optional

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(booking_status, { message: "Invalid booking status" })
  @Transform(({ value }) => (value === "" ? undefined : value))
  status?: booking_status;
}
