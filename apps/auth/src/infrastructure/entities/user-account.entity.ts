import { Gender, UserAccount, UserAccountStatus } from "@app/common";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserLoginDataEntity } from "./user-login-data.entity";
import { TimestampEntity } from "./timestamp.entity";

@Entity({ name: "user_account" })
export class UserAccountEntity extends TimestampEntity implements UserAccount {
  Constructor;
  constructor(userAccount: Partial<UserAccountEntity>) {
    super();
    Object.assign(this, userAccount);
  }

  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: number;

  @Column({ name: "uuid", type: "uuid", generated: "uuid" })
  uuid: string;

  @Column({
    name: "first_name",
    type: "varchar",
    length: 100,
    nullable: true,
    default: "",
  })
  firstName: string;

  @Column({
    name: "last_name",
    type: "varchar",
    length: 100,
    nullable: true,
    default: "",
  })
  lastName: string;

  @Column({
    name: "gender",
    type: "enum",
    enum: Gender,
    nullable: true,
    default: null,
  })
  gender: Gender;

  @Column({
    name: "date_of_birth",
    type: "timestamp",
    default: null,
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    name: "phone_number",
    type: "varchar",
    length: 15,
    default: null,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: "avatar",
    type: "varchar",
    length: 255,
    nullable: true,
    default: "avatar",
  })
  avatar: string;

  @Column({
    name: "status",
    type: "enum",
    enum: UserAccountStatus,
    nullable: false,
    default: UserAccountStatus.INACTIVE,
  })
  status: UserAccountStatus;

  // Relationship

  @OneToOne(() => UserLoginDataEntity, (userLoginData) => userLoginData.userAccount)
  userLoginData: UserLoginDataEntity;

  // Convert to Model

  toModel(): UserAccount {
    const model = new UserAccount();
    model.id = this.id;
    model.uuid = this.uuid;
    model.avatar = this.avatar;
    model.createdAt = this.createdAt;
    model.deletedAt = this.deletedAt;
    model.updatedAt = this.updatedAt;
    model.dateOfBirth = this.dateOfBirth;
    model.firstName = this.firstName;
    model.gender = this.gender;
    model.lastName = this.lastName;
    model.phoneNumber = this.phoneNumber;
    model.status = this.status;
    model.userLoginData = this?.userLoginData?.toModel();
    return model;
  }
}
