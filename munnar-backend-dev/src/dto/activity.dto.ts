import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
  IsArray,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateActivityDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "locationURL must be a valid URL" })
  locationURL?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  is_featured?: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value ? [value] : [];
      }
    }
    return [];
  })
  deletedImages?: string[];
}

export class GetActivitiesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageNumber!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : []))
  type?: string[];
}
