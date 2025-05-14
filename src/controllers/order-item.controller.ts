import { EntityManager } from "@mikro-orm/postgresql";
import { Body, Controller, Param, ParseIntPipe, Put } from "@nestjs/common";
import { DeliveryStatus, OrderItem } from "src/entities/order-item.entity";
import { apiError, apiResponse } from "src/helpers/response.helper";

@Controller("orderItems")
export class OrderItemController {
  constructor(
    private readonly entityManager: EntityManager
  ) {}
  @Put('/:orderItemId')
  async updateOrderItem(
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
    @Body() data: OrderItem
  ) {
    const orderItem = await this.entityManager.findOne(OrderItem, {
      orderItemId: orderItemId
    });
    if (null === orderItem) {
      throw apiError('Dữ liệu không hợp lệ');
    }
    if (orderItem.deliveryStatus === DeliveryStatus.canceled) {
      throw apiError('Đơn hàng đã bị huỷ và không thể chỉnh sửa');
    }
    this.entityManager.assign(orderItem, data);
    await this.entityManager.flush();
    return apiResponse('Đơn hàng đã được chỉnh thành công');
  }
}