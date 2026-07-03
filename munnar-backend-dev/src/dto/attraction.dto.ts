// attraction.dto.ts
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AttractionDTO {
  @IsString()
  @IsNotEmpty()
  route!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  spotName!: string;
}
