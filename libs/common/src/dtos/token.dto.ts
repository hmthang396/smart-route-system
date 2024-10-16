import { ApiProperty } from "@nestjs/swagger";
export interface ITokenDto {
  tokenType: string;

  accessToken: string;

  accessTokenExpires: number;

  refreshToken: string;

  refreshTokenExpires: number;
}

export class TokenDto implements ITokenDto {
  @ApiProperty({
    description: "The type of token",
    example: "Bearer",
    type: "string",
  })
  tokenType: string;

  @ApiProperty({
    description: "The access token string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    type: "string",
  })
  accessToken: string;

  @ApiProperty({
    description: "The expiry timestamp of the access token",
    example: "1h",
    type: "string",
  })
  accessTokenExpires: number;

  @ApiProperty({
    description: "The refresh token string.",
    example: "a1b2c3d4e5f6g7h8i9j0k",
    type: "string",
  })
  refreshToken: string;

  @ApiProperty({
    description: "The expiry timestamp of the refresh token",
    example: "1h",
    type: "string",
  })
  refreshTokenExpires: number;
}
