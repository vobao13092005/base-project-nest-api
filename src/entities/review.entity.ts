import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity({ tableName: "reviews" })
export class Review {
  @PrimaryKey()
  reviewId: number;

  @Property({ type: 'integer' })
  reviewScore!: number;

  @Property({ type: 'text' })
  reviewContent: string;

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user?: User;

  @ManyToOne({ entity: () => Product, joinColumn: 'productId', deleteRule: 'cascade', updateRule: 'cascade' })
  product?: Product;

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}