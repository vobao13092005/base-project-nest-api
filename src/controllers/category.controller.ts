import { EntityManager } from "@mikro-orm/core";
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Category } from "src/entities/category.entity";
import { Product } from "src/entities/product.entity";
import { apiResponse } from "src/helpers/response.helper";

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly entityManager: EntityManager
  ) { }
  @Get()
  async getCategories() {
    const categories = await this.entityManager.find(Category, {});
    return apiResponse('Danh sách danh mục món ăn', categories);
  }
  @Get(':categoryId/products')
  async getProductsByCategories(
    @Param('categoryId', ParseIntPipe) categoryId: number
  ) {
    const category = await this.entityManager.findOne(Category, {
      categoryId: categoryId
    }, {
      populate: ['products', 'products.store']
    });
    if (null === category) {
      throw apiResponse('Không tìm thấy');
    }
    return apiResponse('Danh sách sản phẩm thuộc ' + category.categoryName, {
      category: category,
      products: category.products,
    });
  }
}