import { Controller, Get, Param } from "@nestjs/common";
import { apiResponse } from "src/helpers/response.helper";
import { ProductService } from "src/services/database/product.service";

@Controller('search')
export class SearchController {
  constructor(
    private readonly productService: ProductService
  ) {}
  @Get('/:keyword')
  async search(
    @Param('keyword') keyword: string,
  ) {
    const products = await this.productService.findAll({
      productName: {
        $ilike: `%${keyword}%`
      }
    }, {
      populate: ['store']
    });
    return apiResponse('Kết quả tìm kiếm', products);
  }
}