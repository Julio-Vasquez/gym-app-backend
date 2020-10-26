import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class DatesDto {
  @IsISO8601()
  @IsNotEmpty()
  public readonly start: Date;

  @IsISO8601()
  @IsNotEmpty()
  public readonly end: Date;
}
