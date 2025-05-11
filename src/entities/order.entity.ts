import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { Address } from "./address.entity";
import { Store } from "./store.entity";

export enum PurchaseMethod {
  CASH = 'cash',
  BANK = 'bank',
};

export enum DeliveryStatus {
  verifying = 'verifying', // Chờ xác nhận
  preparing = 'preparing', // Chờ lấy hàng
  delivering = 'delivering', // Đang giao
  delivered = 'delivered', // Đã giao tới nơi
}


@Entity({ tableName: 'orders' })
export class Order {
  @PrimaryKey()
  orderId!: number;

  @Property({ type: 'text' })
  vnpayOrderId: string;

  @Property({ type: 'double' })
  orderTotalPrice!: number;

  @Enum(() => PurchaseMethod)
  purchaseMethod!: PurchaseMethod;

  @Property({ nullable: true })
  @Enum(() => DeliveryStatus)
  deliveryStatus?: DeliveryStatus;

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user?: User;

  @OneToMany(() => OrderItem, 'order')
  orderItems = new Collection<OrderItem>(this);

  @ManyToOne({ entity: () => Address, joinColumn: 'addressId', updateRule: 'cascade', deleteRule: 'cascade' })
  address?: Address;

  @ManyToOne({ entity: () => Store, joinColumn: 'storeId', updateRule: 'cascade', deleteRule: 'cascade' })
  store?: Store;

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}