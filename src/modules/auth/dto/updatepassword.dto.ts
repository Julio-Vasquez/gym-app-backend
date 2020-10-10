import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  public readonly password: string;

  @IsNotEmpty()
  @IsString()
  public readonly token: string;
}