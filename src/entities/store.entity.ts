import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { StoreImage } from "./store-image.entity";
import { Topping } from "./topping.entity";
import { Order } from "./order.entity";

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
}

@Entity({ tableName: 'stores' })
export class Store {
  @PrimaryKey()
  storeId!: number;

  @Property({ type: 'text' })
  storeName!: string;

  @Property({ type: 'text' })
  storeAddress!: string;

  @Property({ type: 'text' })
  storePhoneNumber!: string;

  @Enum(() => StoreStatus)
  storeStatus: StoreStatus = StoreStatus.ACTIVE;

  @Property({ type: 'text' })
  openingHours!: string;

  @Property({ type: 'text' })
  closingHours!: string;

  @OneToMany(() => Product, 'store')
  products = new Collection<Product>(this);

  @OneToMany(() => Topping, 'store')
  toppings = new Collection<Topping>(this);

  @ManyToOne({ entity: () => User, joinColumn: 'userId', deleteRule: 'cascade', updateRule: 'cascade' })
  user!: User;

  @OneToMany(() => Order, 'store')
  orders = new Collection<Order>(this);

  @OneToMany(() => StoreImage, 'store', { eager: true })
  images = new Collection<StoreImage>(this);

  @Property()
  createdAt: Date = new Date;

  @Property({ onUpdate: () => new Date })
  updatedAt: Date = new Date;
}
