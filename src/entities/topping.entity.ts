import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ToppingValue } from "./topping-value.entity";
import { Product } from "./product.entity";
import { Store } from "./store.entity";

@Entity({ tableName: 'toppings' })
export class Topping {
  @PrimaryKey()
  toppingId!: number;

  @Property({ type: 'text' })
  toppingName!: string;

  // Quyết định nhóm topping này có thể chọn nhiều hay chỉ có thể chọn 1.
  @Property({ type: 'boolean' })
  multiple!: boolean;

  @ManyToMany({ entity: () => Product, mappedBy: product => product.toppings })
  products = new Collection<Product>(this);

  @ManyToOne({ entity: () => Store, joinColumn: 'shopId', updateRule: 'cascade', deleteRule: 'cascade' })
  store!: Store;

  @OneToMany(() => ToppingValue, 'topping')
  toppingValues = new Collection<ToppingValue>(this);
}