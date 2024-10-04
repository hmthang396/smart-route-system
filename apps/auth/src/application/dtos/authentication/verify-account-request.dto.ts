import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class VerifyAccountRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  @ApiProperty({
    example: "token",
    type: "string",
    description: "Confirmation token",
    required: true,
  })
  token: string;
}
