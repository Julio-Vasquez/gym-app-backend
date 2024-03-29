import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  public readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 45)
  public readonly password: string;
}