import { IsString, IsNumber, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAssetDto {
  @IsString()
  coin: string;

  @Transform(({ value }) => {
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class IdDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  id: number;
}
