import {
  IsString,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Genders, Roles } from '../../../entities/enums';

export class PersonDto {
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

  @IsOptional()
  readonly dateBirth?: string;

  @IsPhoneNumber('CO')
  @IsNotEmpty()
  readonly phone: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Genders)
  readonly gender: Genders;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Roles)
  readonly role: Roles;
}
