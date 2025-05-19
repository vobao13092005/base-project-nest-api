import { Cascade, Collection, DoubleType, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Store } from "./store.entity";
import { ProductImage } from "./product-image.entity";
import { Review } from "./review.entity";
import { Topping } from "./topping.entity";
import { ProductTopping } from "./product-topping.entity";
import { Category } from "./category.entity";
import { ProductCategory } from "./product-category.entity";

export enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'outOfStock',
  DISCONTINUED = 'discontinued',
}

@Entity({ tableName: 'products' })
export class Product {
  @PrimaryKey()
  productId!: number;

  @Property({ type: 'text' })
  productName!: string;

  @Property({ type: 'double' })
  productPrice!: number;

  @Property({ type: 'text' })
  productDescription!: string;

  @Enum(() => ProductStatus)
  productStatus: ProductStatus = ProductStatus.AVAILABLE;

  @ManyToOne({ entity: () => Store, joinColumn: 'storeId', deleteRule: 'cascade', updateRule: 'cascade' })
  store!: Store;

  @OneToMany(() => ProductImage, 'product', { eager: true })
  images = new Collection<ProductImage>(this);

  @OneToMany(() => Review, 'product')
  reviews = new Collection<Review>(this);

  @ManyToMany({ entity: () => Topping, pivotEntity: () => ProductTopping })
  toppings = new Collection<Topping>(this);

  @ManyToMany({ entity: () => Category, pivotEntity: () => ProductCategory })
  categories = new Collection<Topping>(this);

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}
