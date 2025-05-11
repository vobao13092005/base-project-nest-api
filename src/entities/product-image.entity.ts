import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity";

@Entity({ tableName: 'product_images' })
export class ProductImage {
  @PrimaryKey()
  productImageId!: number;

  @Property({ type: 'text' })
  imageUrl!: string;

  @ManyToOne({ entity: () => Product, joinColumn: 'productId', deleteRule: 'cascade', updateRule: 'cascade' })
  product!: Product;
}
