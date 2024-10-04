import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Matches, MaxLength } from "class-validator";

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class CreateUserLoginDataDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    example: "admin@gmail.com",
    type: "string",
    description: "The email address associated with the user account.",
    required: true,
  })
  email: string;

  @Matches(passwordRegex, { message: "Password too weak" })
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    example: "Admin@123",
    required: true,
    type: "string",
    description: "The password associated with the user account.",
  })
  password: string;
}
