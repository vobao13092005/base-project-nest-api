import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Product } from "src/entities/product.entity";
import { Store } from "src/entities/store.entity";
import { Topping } from "src/entities/topping.entity";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { StoreService } from "src/services/database/store.service";
import { ToppingService } from "src/services/database/topping.service";

export type InsertProductData = {
  product: Product;
  images?: Array<Express.Multer.File>;
};
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly toppingService: ToppingService,
  ) { }

  // Sửa cửa hàng
  @Put(':storeId')
  async update(@Param('storeId') storeId: string, @Body() body: Store) {
    await this.storeService.update(+storeId, body);
    return apiResponse('Đã cập nhật cửa hàng');
  }

  // Xoá cửa hàng
  @Delete(':storeId')
  async delete(@Param('storeId') storeId: string) {
    await this.storeService.delete(+storeId);
    return apiResponse('Đã xoá cửa hàng');
  }

  // Xem cửa hàng
  @Get(':storeId')
  async storeById(
    @Param('storeId') storeId: string
  ) {
    const store = await this.storeService.findByField({ storeId: +storeId });
    if (null === store) {
      throw apiError('Không tìm thấy cửa hàng');
    }
    return apiResponse('OK', store);
  }

  // Thêm ảnh cho cửa hàng
  @Post(":storeId/images")
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @Param('storeId') storeId: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    await this.storeService.uploadImages(+storeId, images);
  }

  // Xoá ảnh cho cửa hàng
  @Delete('/images/:imageIdList')
  async deleteImages(@Param('imageIdList') imageIdListString: string) {
    const imageIdList = imageIdListString.split(',').map(imageId => +imageId);
    await this.storeService.deleteImages(imageIdList);
  }

  // Lấy sản phẩm của cửa hàng
  @Get(':storeId/products')
  async products(@Param('storeId') storeId: string) {
    const store = await this.storeService.findByField({ storeId: +storeId });
    if (null === store) {
      throw apiError('Không tìm thấy cửa hàng');
    }
    await store.products.load();
    for (const product of store.products) {
      await product.toppings.load();
    }
    return apiResponse(`Danh sách sản phẩm của ${store.storeName}`, store.products);
  }

  // Thêm sản phẩm cho cửa hàng
  @UseInterceptors(FilesInterceptor('images'))
  @Post(":storeId/products")
  async createProductForStore(
    @Body() data: InsertProductData,
    @Param('storeId', ParseIntPipe) storeId: number,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    data.images = images ?? [];
    await this.storeService.addProduct(+storeId, data);
  }

  // Thêm nhóm topping
  @Post(":storeId/toppings")
  async createToppingForStore(
    @Body() data: Topping,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    await this.toppingService.create(storeId, data);
    return apiResponse('Thêm nhóm topping thành công', data);
  }

  // Xem danh sách nhóm topping trong cửa hàng
  @Get(":storeId/toppings")
  async getStoreToppings(
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    const store = await this.storeService.findByField({ storeId });
    if (null === store) {
      throw apiError('Không tìm thấy cửa hàng');
    }
    await store.toppings.load();
    return apiResponse('Danh sách topping', store.toppings);
  }
}