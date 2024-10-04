import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class ForgotPasswordRequestDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({
    example: "admin@gmail.com",
    type: "string",
    description: "The email address associated with the user account.",
    required: true,
  })
  email: string;
}
