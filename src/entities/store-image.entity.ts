import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Store } from "./store.entity";

@Entity({ tableName: 'store_images' })
export class StoreImage {
  @PrimaryKey()
  storeImageId!: number;

  @Property({ type: 'text' })
  imageUrl!: string;

  @ManyToOne({ entity: () => Store, joinColumn: 'storeId', deleteRule: 'cascade', updateRule: 'cascade' })
  store!: Store;
}
