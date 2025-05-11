import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity({
  tableName: 'sessions'
})
export class Session {
  @PrimaryKey()
  sessionId!: number;

  @Property({ type: 'text' })
  refreshToken!: string;

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user!: User;

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}