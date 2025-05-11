import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Topping } from "./topping.entity";
import { OrderItem } from "./order-item.entity";

@Entity({ tableName: 'topping_values' })
export class ToppingValue {
  @PrimaryKey()
  toppingValueId!: number;

  @Property({ type: 'text' })
  toppingValueName!: string;

  @Property({ type: 'double' })
  toppingPrice!: number;

  @ManyToMany({ entity: () => OrderItem, mappedBy: orderItem => orderItem.toppingValues })
  orderItems = new Collection<OrderItem>(this);

  @ManyToOne({ entity: () => Topping, joinColumn: 'toppingId', deleteRule: 'cascade', updateRule: 'cascade' })
  topping!: Topping;
}