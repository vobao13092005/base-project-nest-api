import { EntityManager } from "@mikro-orm/core";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Category } from "src/entities/category.entity";
import { Product } from "src/entities/product.entity";
import { Review } from "src/entities/review.entity";
import { apiError, apiResponse } from "src/helpers/response.helper";
import { ProductService } from "src/services/database/product.service";
import { ReviewService } from "src/services/database/review.service";

export type InsertReviewData = {
  review: Review;
  userId: number;
};

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
    private readonly entityManager: EntityManager
  ) { }

  // Sửa sản phẩm
  @Put(':productId')
  async update(@Param('productId') productId: string, @Body() product: Product) {
    await this.productService.update(+productId, product);
    return apiResponse('Đã cập nhật sản phẩm');
  }

  // Xoá sản phẩm
  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    await this.productService.delete(+productId);
    return apiResponse('Đã xoá sản phẩm');
  }

  // Lấy thông tin sản phẩm
  @Get(':productId')
  async getProduct(@Param('productId', ParseIntPipe) productId: number) {
    const product = await this.productService.findByField({ productId }, {
      populate: ['store']
    });
    if (null === product) {
      throw apiError('Không tìm thấy sản phẩm');
    }
    await product.toppings.load();
    return apiResponse("Chi tiết sản phẩm", product);
  }

  // Thêm ảnh cho sản phẩm
  @Post(":productId/images")
  @UseInterceptors(FilesInterceptor('images'))
  async uploadProductImages(
    @Param('productId') productId: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    await this.productService.uploadImages(+productId, images);
  }

  // Thêm đánh giá cho sản phẩm
  @Post(":productId/reviews")
  async addReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() data: InsertReviewData
  ) {
    await this.reviewService.create(productId, data);
    return apiResponse('Thêm đánh giá thành công');
  }

  // Thêm đánh giá cho sản phẩm
  @Get(":productId/reviews")
  async getReviews(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const product = await this.productService.findByField({ productId }, {
      populate: ['reviews.user']
    });
    await product?.reviews.load();
    return apiResponse('Thêm đánh giá thành công', product?.reviews);
  }

  // Kiểm tra người dùng có thể viết đánh giá không
  @Get(":productId/canWriteReview")
  async canWriteReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    const result = await this.reviewService.canWriteReview(userId, productId);
    return apiResponse("", result);
  }

  // Kiểm tra người dùng đã có đánh giá về sản phẩm này chưa
  @Get(":productId/userHasReview")
  async userHasReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    const review = await this.reviewService.userHasReview(userId, productId);
    return apiResponse("", review);
  }

  // Xoá ảnh cho sản phẩm
  @Delete("/images/:imageIdList")
  async deleteImages(
    @Param('imageIdList') imageIdListString: string
  ) {
    const imageIdList = imageIdListString.split(',').map(imageId => +imageId);
    await this.productService.deleteImages(imageIdList);
  }
  // Thêm category cho sản phẩm
  @Put(":productId/categories")
  async syncCategories(
    @Param("productId", ParseIntPipe) productId: number,
    @Body() categories: number[]
  ) {
    const product = await this.productService.findByField({ productId });
    if (null === product) {
      throw apiError('Không tìm thấy sản phẩm');
    }
    await product.categories.load();
    const categoryEntities: any[] = [];
    for (const categoryId of categories) {
      const categoryEntity = await this.entityManager.findOne(Category, { categoryId });
      if (null === categoryEntity) continue;
      categoryEntities.push(categoryEntity);
    }
    product.categories.set(categoryEntities);
    await this.entityManager.persistAndFlush(product);
  }
  // Lấy Category của Product
  @Get(":productId/categories")
  async getCategories(
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    const product = await this.productService.findByField({ productId });
    if (null === product) {
      throw apiError('Không tìm thấy sản phẩm');
    }
    await product.categories.load();
    return apiResponse('Danh mục của sản phẩm ' + product.productName, product.categories);
  }
  // Lấy thống kê
  @Get(":productId/stats")
  async getProductStats(
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    const stats = await this.productService.getStats(productId);
    return apiResponse('Thống kê', stats);
  }
}

/*
  9704198526191432198
  NGUYEN VAN A
  07/15
  123456
  baovo/baovo test/test
*/