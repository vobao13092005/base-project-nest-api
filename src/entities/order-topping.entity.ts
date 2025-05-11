import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { OrderItem } from "./order-item.entity";
import { ToppingValue } from "./topping-value.entity";

@Entity({
  tableName: 'orders_toppings'
})
export class OrderTopping {
  @PrimaryKey()
  orderToppingId!: number;

  @ManyToOne({ entity: () => OrderItem, joinColumn: 'orderItemId', deleteRule: 'cascade', updateRule: 'cascade' })
  product!: OrderItem;

  @ManyToOne({ entity: () => ToppingValue, joinColumn: 'toppingValueId', deleteRule: 'cascade', updateRule: 'cascade' })
  toppingValue!: ToppingValue;
}