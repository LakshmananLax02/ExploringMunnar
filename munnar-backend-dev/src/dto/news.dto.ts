import { IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString } from "class-validator";

export class NewsDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  heading!: string;

  @IsString()
  @IsNotEmpty()
  detail!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
