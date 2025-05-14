import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { OrderItem } from "src/entities/order-item.entity";
import { Order } from "src/entities/order.entity";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { OrderService } from "src/services/database/order.service";

export type OrderItemWithToppings = {
  item: OrderItem;
  productId: number;
  toppingValues: number[];
};

export type CreateOrderData = {
  order: Order;
  userId: number;
  addressId: number;
  items: OrderItemWithToppings[]
};

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}
  @Post('')
  async createOrder(
    @Body() data: CreateOrderData
  ) {
    await this.orderService.createOrder(data);
  }
  @Get(":orderId")
  async getOrder(
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    const order = await this.orderService.findByField({ orderId: orderId });
    if (null === order) {
      throw apiError('Không tìm thấy đơn hàng');
    }
    return apiResponse('Chi tiết đơn hàng', order);
  }
}