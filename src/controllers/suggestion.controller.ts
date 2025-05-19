import { EntityManager, raw } from "@mikro-orm/mysql";
import { Controller, Get } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { apiResponse } from "src/helpers/response.helper";

@Controller("/suggestion")
export class SuggestionController {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  @Get("/products")
  async allProducts() {
    const rawIds = await this.entityManager.getConnection().execute(
      'SELECT "productId" FROM products ORDER BY RANDOM() LIMIT 5;'
    );
    const ids = rawIds.map((r: any) => r.productId);

    const products = await this.entityManager.find(Product, {
      productId: { $in: ids },
    }, {
      populate: ['store'],
    });

    return apiResponse("Danh sách sản phẩm", products);
  }
}