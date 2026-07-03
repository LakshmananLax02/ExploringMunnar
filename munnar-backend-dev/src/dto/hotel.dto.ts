import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
} from "class-validator";
import { plainToInstance, Transform, Type } from "class-transformer";

export class AmenityDto {
  @IsString()
  title!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  data!: string[];
}

export class HotelRuleDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
// Update CreateHotelDto
export class CreateHotelDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerNight!: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  rating?: number;

  @IsOptional()
  @IsString()
  distanceFromCenter?: string;

  @IsString()
  stayType!: string;

  @IsString()
  location!: string;

  @IsString()
  @IsNotEmpty()
  locationRange!: string;

  @IsOptional()
  @IsString()
  locationUrl?: string;

  // Amenities & Experiences remain same
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AmenityDto)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return plainToInstance(AmenityDto, JSON.parse(value));
      } catch {
        return [];
      }
    }
    return plainToInstance(AmenityDto, value);
  })
  amenities?: AmenityDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  experiences?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelRuleDto)
  @Transform(({ value }) => {
    if (!value) return [];

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? plainToInstance(HotelRuleDto, parsed)
          : [];
      } catch (e) {
        return [];
      }
    }

    // If already an array of objects (from JSON body)
    return plainToInstance(HotelRuleDto, value);
  })
  rules?: HotelRuleDto[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isVerified?: boolean;
}

export class UpdateHotelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  pricePerNight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  rating?: number;

  @IsOptional()
  @IsString()
  distanceFromCenter?: string;

  @IsOptional()
  @IsString()
  stayType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  locationUrl?: string;

  @IsOptional()
  @IsString()
  locationRange?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AmenityDto)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return plainToInstance(AmenityDto, JSON.parse(value));
      } catch {
        return [];
      }
    }
    return plainToInstance(AmenityDto, value);
  })
  amenities?: AmenityDto[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  experiences?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Case 1: already correct array
    if (
      Array.isArray(value) &&
      typeof value[0] === "string" &&
      value.length > 1
    ) {
      return value;
    }

    // Case 2: array with JSON string inside (multipart)
    if (Array.isArray(value) && typeof value[0] === "string") {
      try {
        const parsed = JSON.parse(value[0]);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // fallback: split by comma if malformed JSON
        return value[0]
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }

    // Case 3: plain string JSON
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }

    return [];
  })
  deletedImages?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelRuleDto)
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? plainToInstance(HotelRuleDto, parsed)
          : [];
      } catch {
        return [];
      }
    }
    return plainToInstance(HotelRuleDto, value);
  })
  rules?: HotelRuleDto[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Same flexible parsing as deletedImages
    if (
      Array.isArray(value) &&
      typeof value[0] === "string" &&
      value.length > 1
    ) {
      return value;
    }
    if (Array.isArray(value) && typeof value[0] === "string") {
      try {
        const parsed = JSON.parse(value[0]);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value[0]
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  })
  deletedRules?: string[];
}

class BudgetDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  startingFrom!: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  to!: number;
}

export class HotelFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stayType?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locationRange?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  experiences?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BudgetDto)
  budget?: BudgetDto;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isHighlighted?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isUniqueStays?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isTopRated?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true")
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value) || 1)
  pageNumber?: number;
}

export class UpdateHotelPromotionsDto {
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isFeatured!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isHighlighted!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isUniqueStays!: boolean;

  @IsOptional()
  @IsDateString()
  featuredUntil?: string | null;
}
