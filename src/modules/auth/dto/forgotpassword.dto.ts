import { IsNotEmpty, IsString, Length } from 'class-validator'

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  public readonly userName: string;
}