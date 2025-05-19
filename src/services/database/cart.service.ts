import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { CreateOrderData, OrderItemWithToppings } from "src/controllers/order.controller";
import { ProductService } from "./product.service";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { OrderItem } from "src/entities/order-item.entity";
import { Order, PurchaseMethod } from "src/entities/order.entity";
import { OrderService } from "./order.service";
import { UserService } from "./user.service";
import * as _ from 'lodash';

@Injectable()
export class CartService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) { }
  async getUserCart(userId: number) {
    const cart = await this.orderService.findAll({
      user: {
        userId
      },
      isDraft: true,
    });
    return cart;
  }
  async updateCartItem(orderItemId: number, orderItem: OrderItem) {
    const orderItemEntity = await this.entityManager.findOne(OrderItem, { orderItemId });
    if (null === orderItemEntity) {
      throw apiResponse('Không tìm thấy đơn hàng');
    }
    if (orderItemEntity.order?.isDraft === false) {
      throw apiResponse('Không phải giỏ hàng');
    }
    this.entityManager.assign(orderItemEntity, orderItem);
    await this.entityManager.flush();
  }
  async deleteFromCart(orderItemId: number) {
    const orderItemEntity = await this.entityManager.findOne(OrderItem, { orderItemId }, {
      populate: ['order', 'order.orderItems']
    });
    if (null === orderItemEntity) {
      throw apiResponse('Không tìm thấy đơn hàng');
    }
    if (orderItemEntity.order?.isDraft === false) {
      throw apiResponse('Không phải giỏ hàng');
    }
    await this.entityManager.removeAndFlush(orderItemEntity);
    if (orderItemEntity.order?.orderItems.length === 0) {
      await this.entityManager.nativeDelete(Order, {
        orderId: orderItemEntity.order.orderId
      });
    }
  }
  async insertToUserCart(userId: number, orderItemWithToppings: OrderItemWithToppings) {
    const product = await this.productService.findByField({ productId: orderItemWithToppings.productId });
    if (null === product) {
      throw apiError('Dữ liệu không hợp lệ');
    }
    const user = await this.userService.findByField({ userId: userId });
    if (null === user) {
      throw apiError('Dữ liệu không hợp lệ');
    }
    const cart_cua_nguoi_dung = await this.entityManager.findOne(Order, {
      isDraft: true,
      user: {
        userId: userId
      }
    });
    if (null === cart_cua_nguoi_dung) {
      console.log("Tạo giỏ hàng mới...");
      const order = new Order();
      order.isDraft = true;
      order.user = user;
      order.vnpayOrderId = "draft";
      order.orderTotalPrice = -1;
      order.purchaseMethod = PurchaseMethod.BANK;
      const entity = this.entityManager.create(Order, order);
      const orderItem = await this.orderService.createOrderItem(orderItemWithToppings);
      if (null === orderItem) throw apiError("Lỗi cực nặng");
      entity.orderItems.add(orderItem);
      await this.entityManager.persistAndFlush(entity);
      return;
    }
    const hasProductInCart = await this.entityManager.findOne(OrderItem, {
      order: {
        orderId: cart_cua_nguoi_dung.orderId,
        user: {
          userId: userId,
        },
        isDraft: true
      },
      product: {
        productId: orderItemWithToppings.productId
      },
    }, {
      populate: ['toppingValues']
    });
    if (null === hasProductInCart) {
      const orderItem = await this.orderService.createOrderItem(orderItemWithToppings);
      if (null === orderItem) throw apiError("Lỗi cực nặng");
      cart_cua_nguoi_dung.orderItems.add(orderItem);
      await this.entityManager.persistAndFlush(cart_cua_nguoi_dung);
      return;
    }
    const arr1 = orderItemWithToppings.toppingValues;
    const arr2 = hasProductInCart!.toppingValues.map(toppingValue => toppingValue.toppingValueId);
    console.log(arr1, arr2);
    const check = _.isEqual(arr1, arr2);
    if (!check) {
      console.log("Thêm vào giỏ hàng có sẵn...");
      const orderItem = await this.orderService.createOrderItem(orderItemWithToppings);
      if (null === orderItem) throw apiError("Lỗi cực nặng");
      cart_cua_nguoi_dung.orderItems.add(orderItem);
      await this.entityManager.persistAndFlush(cart_cua_nguoi_dung);
    } else {
      hasProductInCart.quantity += orderItemWithToppings.item.quantity;
      hasProductInCart.totalPrice = hasProductInCart.getTotalPrice();
      await this.entityManager.persistAndFlush(hasProductInCart);
    }
  }
}