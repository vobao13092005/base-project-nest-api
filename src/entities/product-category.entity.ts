import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Category } from "./category.entity";
import { Product } from "./product.entity";

@Entity({
  tableName: 'products_categories'
})
export class ProductCategory {
  @PrimaryKey()
  orderToppingId!: number;

  @ManyToOne({ entity: () => Category, joinColumn: 'categoryId1', deleteRule: 'cascade', updateRule: 'cascade' })
  category!: Category;

  @ManyToOne({ entity: () => Product, joinColumn: 'productId', deleteRule: 'cascade', updateRule: 'cascade' })
  product!: Product;
}