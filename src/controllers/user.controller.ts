import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { UserService } from "src/services/database/user.service";
import { Store } from "src/entities/store.entity";
import { Address } from "src/entities/address.entity";

export type InsertStoreData = {
  store: Store;
  images?: Array<Express.Multer.File>;
};
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // Thêm người dùng
  @Post()
  async create(@Body() request: User) {
    await this.userService.create(request);
    return {};
  }

  // Sửa người dùng
  @UseGuards(AuthGuard)
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() request: User) {
    await this.userService.update(+userId, request);
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
    @Param('userId') userId: string
  ) {
    const user = await this.userService.findByField({ userId: +userId });
    if (!user) {
      throw apiError(`Không tìm thấy người dùng ${userId}`)
    }
    await user.orders.load();
    return apiResponse("Danh sách cửa hàng của người dùng", user.orders);
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

  // Upload ảnh đại diện người dùng
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const form = new FormData();
    form.append("file", new Blob([file.buffer]), file.originalname);

    const response = await fetch("https://discord.com/api/webhooks/1354104392416235674/MMtRy_UqYDB4XOEw4HGqDdxPOwLJHoNFAUvnSe3IXTk9n67bnfnvdvs7kwnfG6qLFhk1", {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    const discordImageUrls = json.attachments.map(attachment => {
      return {
        url: attachment.url,
        filename: attachment.filename,
        size: +(Number.parseInt(attachment.size) / 1024 / 1024).toFixed(2)
      };
    });
    console.log(discordImageUrls);
    return apiResponse(discordImageUrls);
  }
}