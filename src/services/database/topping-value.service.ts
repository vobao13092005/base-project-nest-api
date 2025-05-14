import { FilterQuery } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ToppingValue } from "src/entities/topping-value.entity";
import { ToppingService } from "./topping.service";

@Injectable()
export class ToppingValueService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly toppingService: ToppingService,
  ) { }
  async findByField(data: FilterQuery<ToppingValue>): Promise<ToppingValue | null> {
    const toppingValue = await this.entityManager.findOne(ToppingValue, data);
    return toppingValue;
  }
}