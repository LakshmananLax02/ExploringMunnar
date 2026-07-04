// home-slide.dto.ts
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateHomeSlideDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number;
}
