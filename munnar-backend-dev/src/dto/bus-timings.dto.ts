import {
  IsString,
  IsNumber,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class BusTimingDTO {
  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsString()
  departureTime!: string; // Eg: 07:30 AM

  @IsString()
  arrivalTime!: string; // Eg: 07:30 PM

  @IsString()
  duration!: string; // Eg: 5.30 Hrs

  @IsString()
  busType!: string; // Eg: Kerala RTC

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price!: number;
}
