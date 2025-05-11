import { Controller, Get } from "@nestjs/common";
import { apiResponse } from "src/helpers/response.helper";
import { ProductService } from "src/services/database/product.service";

@Controller("/suggestion")
export class SuggestionController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get("/allProducts")
  async allProducts() {
    const products = await this.productService.findAll({ productId: { $gte: 1 } })
    return apiResponse("Danh sách sản phẩm", products);
  }
}