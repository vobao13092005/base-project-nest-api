import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Order } from "./order.entity";
import { Product } from "./product.entity";
import { ToppingValue } from "./topping-value.entity";
import { OrderTopping } from "./order-topping.entity";

export enum DeliveryStatus {
  verifying = 'verifying', // Chờ xác nhận
  preparing = 'preparing', // Chờ lấy hàng
  delivering = 'delivering', // Đang giao
  delivered = 'delivered', // Đã giao tới nơi
  canceled = 'canceled', // Đã huỷ đơn
}

@Entity({ tableName: 'order_items' })
export class OrderItem {
  @PrimaryKey()
  orderItemId!: number;

  @Property({ type: 'double' })
  totalPrice!: number;

  @Property({ type: 'integer' })
  quantity: number;

  @Property({ type: 'text', nullable: true })
  note: number;

  @Enum(() => DeliveryStatus)
  deliveryStatus?: DeliveryStatus;

  @ManyToOne({ entity: () => Product, joinColumn: 'productId', updateRule: 'cascade', deleteRule: 'cascade' })
  product?: Product;

  @ManyToOne({ entity: () => Order, joinColumn: 'orderId', updateRule: 'cascade', deleteRule: 'cascade' })
  order?: Order;

  @ManyToMany({ entity: () => ToppingValue, pivotEntity: () => OrderTopping })
  toppingValues = new Collection<ToppingValue>(this);

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;

  getTotalPrice(): number {
    const productPrice = this.product!.productPrice;
    const quantity = this.quantity;
    const toppingsPrice = this.toppingValues.map(toppingValue => toppingValue.toppingPrice).reduce((a, b) => a + b);
    return (productPrice + toppingsPrice) * quantity;
  }
}