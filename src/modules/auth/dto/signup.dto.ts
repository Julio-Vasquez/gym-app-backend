import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  readonly password: string;
}