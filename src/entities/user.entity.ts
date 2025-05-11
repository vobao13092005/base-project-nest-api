import { Cascade, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Session } from "./session.entity";
import { Role } from "./role.entity";
import { UserRole } from "./user-role.entity";
import { Address } from "./address.entity";
import { Store } from "./store.entity";
import { Review } from "./review.entity";
import { Order } from "./order.entity";

@Entity({
  tableName: 'users'
})
export class User {
  @PrimaryKey()
  userId!: number;

  @Property({ type: 'text' })
  username!: string;

  @Property({ type: 'text' })
  password!: string;

  @Property({ type: 'text' })
  email!: string;

  @Property({ type: 'text' })
  fullname!: string;

  @Property({ type: 'text', nullable: true, })
  avatar?: string;

  @Property({ type: 'text' })
  phoneNumber!: string;

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;

  @ManyToMany({ entity: () => Role, pivotEntity: () => UserRole })
  roles = new Collection<Role>(this);

  @OneToMany(() => Session, 'user')
  sessions = new Collection<Session>(this);

  @OneToMany(() => Address, 'user')
  addresses = new Collection<Address>(this);

  @OneToMany(() => Store, 'user')
  stores = new Collection<Store>(this);

  @OneToMany(() => Review, 'user')
  reviews = new Collection<Review>(this);

  @OneToMany(() => Order, 'user')
  orders = new Collection<Order>(this);
}