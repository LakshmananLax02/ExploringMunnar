import {
  IsString,
  IsNumber,
  IsEmail,
  IsDateString,
  Min,
  IsOptional,
  IsEnum,
  IsInt,
  MaxLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { booking_status } from "./status-update.dto";

export class HotelBookingDTO {
  @IsString()
  hotelId!: string;
    
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  userId?: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsDateString({}, { message: "Check-in must be YYYY-MM-DD" })
  checkIn!: string;

  @IsDateString({}, { message: "Check-out must be YYYY-MM-DD" })
  checkOut!: string;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  adults!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  kids?: number;
}

export class HotelRequestSearchDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  /**
   * Search by hotel name OR customer name
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  /**
   * Filter by request status
   */
  @IsOptional()
  @IsEnum(booking_status, {
    message: "status must be PENDING, APPROVED or CANCELLED",
  })
@Transform(({ value }) => value === "" ? undefined : value)
  status?: booking_status;
}