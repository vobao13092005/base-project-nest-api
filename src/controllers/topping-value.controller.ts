import { EntityManager } from "@mikro-orm/postgresql";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from "@nestjs/common";
import { ToppingValue } from "src/entities/topping-value.entity";
import { apiError, apiResponse } from "src/helpers/response.helper";

@Controller('/topping-values')
export class ToppingValueController {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }
  @Get(':toppingValueId')
  async getToppingValue(
    @Param('toppingValueId', ParseIntPipe) toppingValueId: number,
  ) {
    const foundEntity = await this.entityManager.findOne(ToppingValue, { toppingValueId });
    if (null === foundEntity) {
      throw apiError('');
    }
    return apiResponse('', foundEntity);
  }
  @Put(':toppingValueId')
  async updateToppingValue(
    @Param('toppingValueId', ParseIntPipe) toppingValueId: number,
    @Body() toppingValue: ToppingValue
  ) {
    const foundEntity = await this.entityManager.findOne(ToppingValue, { toppingValueId });
    if (null === foundEntity) {
      throw apiError('');
    }
    this.entityManager.assign(foundEntity, toppingValue);
    await this.entityManager.flush();
  }
  @Delete(':toppingValueId')
  async deleteToppingValue(@Param('toppingValueId', ParseIntPipe) toppingValueId: number) {
    const toppingValue = await this.entityManager.findOne(ToppingValue, { toppingValueId });
    if (null === toppingValue) {
      throw apiError('');
    }
    await this.entityManager.removeAndFlush(toppingValue);
  }
}