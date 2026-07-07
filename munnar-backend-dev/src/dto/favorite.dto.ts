import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleFavoriteDTO {
  @IsNotEmpty()
  @IsString()
  hotelId!: string;
}