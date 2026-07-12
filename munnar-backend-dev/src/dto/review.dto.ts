import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  hotelId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsNotEmpty()
  @IsString()
  travelledMonth!: string; // e.g., "April 14th, 2023"

  @IsNotEmpty()
  @IsString()
  roomType!: string;       // e.g., "Double Room"

  // Sub-breakdown validation mappings
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  cleanliness!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  food!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  value!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  facilities!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  location!: number;
}