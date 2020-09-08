import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  public readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(60)
  public readonly password: string;
}