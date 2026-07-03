import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Transform } from "class-transformer";

export enum ContactStatus {
  Pending = "Pending",
  Completed = "Completed",
}
export class ContactFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @Transform(({ value }: { value: string | number }) => {
    const num = Number(value);
    return isNaN(num) ? 1 : num;
  })
  @IsNumber()
  pageNumber?: number;
}

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
export class UpdateContactStatusDto {
  @IsEnum(ContactStatus)
  status!: ContactStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}
