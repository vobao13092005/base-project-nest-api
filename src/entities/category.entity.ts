import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity";

@Entity({ tableName: 'categories' })
export class Category {
  @PrimaryKey()
  categoryId!: number;

  @Property()
  categoryName!: string;

  @Property()
  categoryDescription: string;

  @ManyToMany({ entity: () => Product, mappedBy: product => product.categories })
  products = new Collection<Product>(this);
}