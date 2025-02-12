import { IsString, IsNotEmpty } from 'class-validator';

export class GetCalcDto {
  @IsString()
  @IsNotEmpty()
  coin: string;
}
