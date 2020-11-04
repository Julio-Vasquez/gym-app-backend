import { IsNotEmpty, Length, IsNumberString, IsEnum } from 'class-validator';
import { Concept } from 'src/entities/enums';

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

  @IsEnum(Concept)
  readonly concept: string;
}
