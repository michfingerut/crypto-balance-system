import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  coin: string;

  @Transform(({ value }): number => {
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
