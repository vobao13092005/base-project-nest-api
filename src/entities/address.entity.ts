import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Order } from "./order.entity";

@Entity({ tableName: 'addresses' })
export class Address {
  @PrimaryKey()
  addressId!: number;

  @Property({ type: 'text' })
  detailAddress!: string;

  @Property({ type: 'text' })
  addressName!: string;

  @Property({ type: 'text' })
  addressPhone!: string;

  @Property({ type: 'text' })
  department!: string;

  @Property({ type: 'text' })
  addressNote!: string;

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user!: User;

  @OneToMany(() => Order, 'address')
  orders = new Collection<Order>(this);
}
