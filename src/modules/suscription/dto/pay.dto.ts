import { IsNotEmpty, Length, IsNumberString, IsString } from 'class-validator';

export class PayDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly cost: number;

  @IsNumberString()
  @IsNotEmpty()
  readonly days: number;

  @IsNumberString()
  @IsNotEmpty()
  @Length(6, 14)
  readonly identification: number;

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  readonly username: string
}