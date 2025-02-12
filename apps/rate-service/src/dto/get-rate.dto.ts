import { IsNotEmpty, IsString } from 'class-validator';

export class GetRateDTO {
  @IsString()
  @IsNotEmpty()
  coin: string;

  @IsString()
  @IsNotEmpty()
  vs_coin: string;
}
