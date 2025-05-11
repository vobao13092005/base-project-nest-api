import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity({
  tableName: 'users_roles'
})
export class UserRole {
  @PrimaryKey()
  userRoleId!: number;

  @ManyToOne(() => User, { joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user!: User;

  @ManyToOne(() => Role, { joinColumn: 'roleId', deleteRule: 'cascade', updateRule: 'cascade' })
  role!: Role;

  @Property({ defaultRaw: 'NOW()' })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date, defaultRaw: 'NOW()' })
  updatedAt!: Date;
}