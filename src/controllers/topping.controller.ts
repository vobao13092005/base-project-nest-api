import { Primary } from "@mikro-orm/core";
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { ToppingValue } from "src/entities/topping-value.entity";
import { apiResponse } from "src/helpers/response.helper";
import { ToppingService } from "src/services/database/topping.service";

@Controller('toppings')
export class ToppingController {
  constructor(
    private readonly toppingService: ToppingService,
  ) { }

  // Thêm giá trị cho nhóm topping
  @Post(':toppingId/values')
  async createToppingValues(
    @Body() topping: ToppingValue,
    @Param('toppingId', ParseIntPipe) toppingId: number,
  ) {
    await this.toppingService.addToppingValue(toppingId, topping);
    return apiResponse('Thêm topping thành công');
  }

  // Lấy danh sách topping của nhóm topping
  @Get(':toppingId/values')
  async getToppingValues(
    @Param('toppingId', ParseIntPipe) toppingId: number,
  ) {
    const topping = await this.toppingService.findByField({ toppingId });
    if (null === topping) {
      throw apiResponse('Không tìm thấy topping');
    }
    await topping.toppingValues.load();
    return apiResponse('Danh sách topping', topping.toppingValues);
  }

  // Gán topping cho sản phẩm
  @Put(':toppingId/products')
  async toppingProductInsert(
    @Body() products: number[],
    @Param('toppingId', ParseIntPipe) toppingId: number,
  ) {
    await this.toppingService.toppingProductInsert(toppingId, products);
    return apiResponse('Done');
  }
}