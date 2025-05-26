import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { UserService } from "src/services/database/user.service";
import { Store } from "src/entities/store.entity";
import { Address } from "src/entities/address.entity";
import { EntityManager } from "@mikro-orm/core";
import { OrderItem } from "src/entities/order-item.entity";
import { OrderItemWithToppings } from "./order.controller";
import { CartService } from "src/services/database/cart.service";

export type InsertStoreData = {
  store: Store;
  images?: Array<Express.Multer.File>;
};
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
    private readonly cartService: CartService
  ) { }

  // Thêm người dùng
  @Post()
  async create(@Body() request: User) {
    console.log(request)
    await this.userService.create(request);
    return apiResponse('Tạo tài khoản thành công');
  }

  // Sửa người dùng
  @UseGuards(AuthGuard)
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() request: User) {
    const user = Object.fromEntries(
      Object.entries(request).filter(([_, v]) => v !== null)
    ) as User;
    await this.userService.update(+userId, user);
    return apiResponse('Đã cập nhật người dùng');
  }

  // Xoá người dùng
  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    await this.userService.delete(+userId);
    return apiResponse('Đã xoá người dùng');
  }

  // Thêm địa chỉ cho người dùng
  @Post(':userId/addresses')
  async createAddress(
    @Param('userId') userId: string,
    @Body() address: Address
  ) {
    await this.userService.addAddress(+userId, address);
    return apiResponse("Thêm địa chỉ thành công");
  }

  // Lấy địa chỉ theo người dùng
  @Get(':userId/addresses')
  async getAddresses(
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.findByField({ userId: +userId });
    if (!user) {
      throw apiError(`Không tìm thấy người dùng ${userId}`)
    }
    await user.addresses.load();
    return apiResponse("Danh sách địa chỉ của người dùng", user.addresses);
  }

  // Thêm cửa hàng cho người dùng
  @UseInterceptors(FilesInterceptor('images'))
  @Post(":userId/stores")
  async createStoreForUser(
    @Body() data: InsertStoreData,
    @Param('userId') userId: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    data.images = images ?? [];
    const store = await this.userService.addStore(+userId, data);
    return apiResponse("OK", store);
  }

  // Lấy cửa hàng theo người dùng
  @Get(':userId/stores')
  async getStores(
    @Param('userId') userId: string
  ) {
    const user = await this.userService.findByField({ userId: +userId });
    if (!user) {
      throw apiError(`Không tìm thấy người dùng ${userId}`)
    }
    await user.stores.load();
    return apiResponse("Danh sách cửa hàng của người dùng", user.stores);
  }

  // Lấy đơn hàng theo người dùng
  @Get(':userId/orders')
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number
  ) {
    const userOrders = await this.entityManager.findAll(OrderItem, {
      populate: ['toppingValues', 'toppingValues.topping', 'product', 'order', 'order.user', 'order.address'],
      where: {
        order: {
          user: {
            userId: userId
          },
          isDraft: false,
        }
      },
    });
    return apiResponse("Danh sách cửa hàng của người dùng", userOrders);
  }

  @Post("/:userId/cart")
  async insertToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() orderItemWithToppings: OrderItemWithToppings
  ) {
    await this.cartService.insertToUserCart(userId, orderItemWithToppings);
  }

  @Get("/:userId/cart")
  async getUserCart(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const cart = await this.cartService.getUserCart(userId);
    if (null === cart) {
      return apiResponse('Giỏ hàng trống', []);
    }
    return apiResponse('Giỏ hàng người dùng', cart);
  }

  // Lấy thông tin người dùng của session (refresh token)
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const user = await this.userService.findByField({ userId: request['user'].userId });
    if (!user) {
      throw apiError(`Không tìm thấy người dùng ${request['user'].userId}`)
    }
    return apiResponse(`Thông tin người dùng ${user?.username}`, user);
  }
}