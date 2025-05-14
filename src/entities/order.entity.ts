import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { Address } from "./address.entity";
import { Store } from "./store.entity";

export enum PurchaseMethod {
  CASH = 'cash',
  BANK = 'bank',
};

@Entity({ tableName: 'orders' })
export class Order {
  @PrimaryKey()
  orderId?: number;

  @Property({ type: 'text', nullable: true })
  vnpayOrderId?: string;

  @Property({ type: 'double', nullable: true })
  orderTotalPrice?: number;

  @Property({ type: 'boolean' })
  isDraft!: boolean;

  @Property({ nullable: true })
  @Enum(() => PurchaseMethod)
  purchaseMethod?: PurchaseMethod;

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user?: User;

  @OneToMany(() => OrderItem, 'order')
  orderItems = new Collection<OrderItem>(this);

  @ManyToOne({ entity: () => Address, joinColumn: 'addressId', updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  address?: Address;

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}