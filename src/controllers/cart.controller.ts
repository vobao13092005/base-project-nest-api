import { Body, Controller, Delete, Param, ParseIntPipe, Put } from "@nestjs/common";
import { OrderItem } from "src/entities/order-item.entity";
import { CartService } from "src/services/database/cart.service";

@Controller("carts")
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) { }
  @Put('/:orderItemId')
  async updateCartItem(
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
    @Body() orderItem: OrderItem,
  ) {
    await this.cartService.updateCartItem(orderItemId, orderItem);
  }
  @Delete('/:orderItemId')
  async deleteFromCart(
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
  ) {
    await this.cartService.deleteFromCart(orderItemId);
  }
}