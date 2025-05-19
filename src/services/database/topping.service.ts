import { FilterQuery, Primary } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Topping } from "src/entities/topping.entity";
import { StoreService } from "./store.service";
import { apiError } from "src/helpers/response.helper";
import { ToppingValue } from "src/entities/topping-value.entity";
import { ProductService } from "./product.service";

@Injectable()
export class ToppingService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
  ) { }
  async findByField(data: FilterQuery<Topping>): Promise<Topping | null> {
    const topping = await this.entityManager.findOne(Topping, data);
    return topping;
  }

  async create(storeId: number, topping: Topping) {
    const entity = this.entityManager.create(Topping, topping);
    const store = await this.storeService.findByField({ storeId });
    if (null === store) {
      throw apiError('Không tìm thấy cửa hàng');
    }
    store.toppings.add(entity);
    await this.entityManager.persistAndFlush(store);
  }

  async addToppingValue(toppingId: number, toppingValue: ToppingValue) {
    const topping = await this.findByField({ toppingId });
    if (null === topping) {
      throw apiError('Không thể tìm thấy topping');
    }
    const entity = this.entityManager.create(ToppingValue, toppingValue);
    entity.topping = topping;
    await this.entityManager.persistAndFlush(entity);
  }

  async toppingProductInsert(toppingId: number, products: number[]) {
    const topping = await this.findByField({ toppingId });
    if (!topping) {
      throw apiError('Không thể tìm thấy topping');
    }
    await topping.products.load();
    const productEntities: any[] = [];
    for (const productId of products) {
      const product = await this.productService.findByField({ productId });
      if (product) {
        productEntities.push(product);
      }
    }
    topping.products.set(productEntities);
    await this.entityManager.persistAndFlush(topping);
  }
  async deleteTopping(toppingId: number) {
    const topping = await this.findByField({ toppingId });
    if (null === topping) {
      throw apiError('');
    }
    await this.entityManager.removeAndFlush(topping);
  }
  async updateTopping(toppingId: number, topping: Topping) {
    const foundEntity = await this.findByField({ toppingId });
    if (null === foundEntity) {
      throw apiError('');
    }
    this.entityManager.assign(foundEntity, topping);
    await this.entityManager.flush();
  }
}