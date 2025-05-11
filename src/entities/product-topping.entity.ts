import { Entity, ManyToOne, PrimaryKey, Unique } from "@mikro-orm/core";
import { Product } from "./product.entity";
import { Topping } from "./topping.entity";

@Entity({
  tableName: 'products_toppings'
})
export class ProductTopping {
  @PrimaryKey()
  productToppingId!: number;

  @ManyToOne({ entity: () => Product, joinColumn: 'productId', deleteRule: 'cascade', updateRule: 'cascade' })
  product!: Product;

  @ManyToOne({ entity: () => Topping, joinColumn: 'toppingId', deleteRule: 'cascade', updateRule: 'cascade' })
  topping!: Topping;
}