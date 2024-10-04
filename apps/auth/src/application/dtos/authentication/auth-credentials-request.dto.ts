import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class AuthCredentialsRequestDto {
  @IsNotEmpty({ message: "validation.NOT_EMPTY" })
  @MaxLength(255, { message: "validation.MAX_LENGTH" })
  @ApiProperty({
    example: "admin@gmail.com",
  })
  readonly email: string;

  @IsNotEmpty({ message: "validation.NOT_EMPTY" })
  @MaxLength(255, { message: "validation.MAX_LENGTH" })
  @ApiProperty({
    example: "Admin@123",
  })
  readonly password: string;
}
