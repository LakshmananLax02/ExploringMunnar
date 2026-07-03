import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleFavoriteDTO {
  @IsNotEmpty()
  @IsNumber()
  hotelId!: number;
}