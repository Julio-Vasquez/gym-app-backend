import {
  IsString,
  IsNotEmpty,
  Length,
  IsISO8601,
  IsPhoneNumber,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { Genders, Roles } from '../../../entities/enums';

export class UpdatePersonDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 75)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 75)
  readonly lastName: string;

  @IsNumberString()
  @Length(6, 12)
  readonly identification: number;

  @IsPhoneNumber('CO')
  @IsNotEmpty()
  readonly phone: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Roles)
  readonly role: Roles;
}
