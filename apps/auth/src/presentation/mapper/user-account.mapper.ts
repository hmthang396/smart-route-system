import { UserAccountResponseDto } from "@app/auth/application/dtos";
import { UserAccount } from "@app/common";
import { FormatHelper } from "@app/common/helpers";

export class UserAccountMapper {
  public static toDto(entity: UserAccount): UserAccountResponseDto {
    const dto = new UserAccountResponseDto();
    dto.id = entity.uuid;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.gender = entity.gender;
    dto.phoneNumber = entity.phoneNumber;
    dto.avatar = entity.avatar;
    dto.dateOfBirth = FormatHelper.formatDate(entity.dateOfBirth);
    dto.status = entity.status;
    dto.email = entity?.userLoginData ? entity.userLoginData.email : null;
    return dto;
  }
}
