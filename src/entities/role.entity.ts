import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity({
  tableName: 'roles'
})
export class Role {
  @PrimaryKey()
  roleId!: number;

  @Property({ type: 'text' })
  roleLabel!: string;

  @Property()
  rolePriority!: number;

  @ManyToMany({ entity: () => User, mappedBy: user => user.roles })
  users = new Collection<User>(this);

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;

  constructor(roleLabel: string, rolePriority: number) {
    this.roleLabel = roleLabel;
    this.rolePriority = rolePriority;
  }
}