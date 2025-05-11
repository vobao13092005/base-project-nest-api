import { EntityManager, FilterQuery, Primary } from "@mikro-orm/postgresql";
import { Get, Injectable, Param, ParseIntPipe } from "@nestjs/common";
import { CreateOrderData } from "src/controllers/order.controller";
import { OrderItem } from "src/entities/order-item.entity";
import { Order } from "src/entities/order.entity";
import { AddressService } from "./address.service";
import { UserService } from "./user.service";
import { apiError } from "src/helpers/response.helper";
import { ToppingValue } from "src/entities/topping-value.entity";
import { Product } from "src/entities/product.entity";
import { ProductService } from "./product.service";
import { ToppingValueService } from "./topping-value.service";
import { StoreService } from "./store.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly toppingValueService: ToppingValueService,
    private readonly storeService: StoreService
  ) { }
  async findByField(data: FilterQuery<Order>): Promise<Order | null> {
    const order = await this.entityManager.findOne(Order, data, {
      populate: ['orderItems', 'orderItems.product', 'orderItems.toppingValues', 'orderItems.toppingValues.topping'],
    });
    return order;
  }
  async createOrder(data: CreateOrderData) {
    // Tạo một order mới
    const order = this.entityManager.create(Order, data.order);
    order.orderTotalPrice = 0;
    const address = await this.addressService.findByField({ addressId: data.addressId });
    if (null === address) {
      throw apiError('Địa chỉ không hợp lệ');
    }
    const user = await this.userService.findByField({ userId: data.userId });
    if (null === user) {
      throw apiError('Người dùng không hợp lệ');
    }
    const store = await this.storeService.findByField({ storeId: data.storeId });
    if (null === store) {
      throw apiError('Cửa hàng không hợp lệ');
    }
    order.address = address;
    order.user = user;
    order.store = store;
    // Lặp tất cả các order item trong order
    for (const orderItemWithToppings of data.items) {
      // Tạo order item mới
      const orderItem = this.entityManager.create(OrderItem, orderItemWithToppings.item);
      // Thêm sản phẩm vào order từ productId trong dữ liệu gửi qua HTTP
      const product = await this.productService.findByField({ productId: orderItemWithToppings.productId });
      if (null === product) continue;
      if (product.store.storeId !== order.store.storeId) {
        throw apiError(`Sản phẩm ${product.productName} không thuộc cửa hàng ${order.store.storeName}`);
      }
      orderItem.product = product;
      // Lấy ToppingValue[] từ danh sách ID ToppingValue trong dữ liệu gửi qua HTTP
      var toppingValuesWithNulls = await Promise.all(
        orderItemWithToppings.toppingValues.map(toppingValueId =>
          this.toppingValueService.findByField({ toppingValueId })
        )
      );
      // Lọc bỏ toàn bộ null trong ToppingValue[]
      const toppingValues = toppingValuesWithNulls.filter(value => value !== null);
      // Thêm tất cả các ToppingValue vào order item
      orderItem.toppingValues.add(toppingValues);
      // Tính tổng tiền order item = (giá sản phẩm + giá toàn bộ toppping) * số lượng
      const productPrice = orderItem.product?.productPrice;
      const quantity = orderItem.quantity;
      const toppingsPrice = toppingValues.map(toppingValue => toppingValue.toppingPrice).reduce((a, b) => a + b);
      orderItem.totalPrice = (productPrice + toppingsPrice) * quantity;
      // Giá order = Tổng giá tất cả order item
      order.orderTotalPrice += orderItem.totalPrice;
      // Cuối cùng thêm tất cả order item vào order
      order.orderItems.add(orderItem);
    }
    await this.entityManager.persistAndFlush(order);
  }
}