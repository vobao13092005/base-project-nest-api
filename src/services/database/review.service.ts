import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { InsertReviewData } from "src/controllers/product.controller";
import { Review } from "src/entities/review.entity";
import { apiError } from "src/helpers/response.helper";
import { UserService } from "./user.service";
import { ProductService } from "./product.service";

@Injectable()
export class ReviewService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}
  async create(productId: number, data: InsertReviewData) {
    const product = await this.productService.findByField({ productId });
    const user = await this.userService.findByField({ userId: data.userId });
    if (null === product || null === user) {
      throw apiError('Dữ liệu không hợp lệ');
    }
    data.review.user = user;
    data.review.product = product;
    const review = this.entityManager.create(Review, data.review);
    await this.entityManager.persistAndFlush(review);
  }
  async findByField(data: Partial<Review>): Promise<Review | null> {
    const address = await this.entityManager.findOne(Review, data);
    return address;
  }
  async update(reviewId: number, address: Review) {
    const reviewEntity = await this.findByField({ reviewId: reviewId });
    if (!reviewEntity) {
      throw apiError('Không tìm thấy địa chỉ');
    }
    this.entityManager.assign(reviewEntity, address);
    await this.entityManager.flush();
  }
  async delete(reviewId: number) {
    const reviewEntity = await this.entityManager.findOneOrFail(Review, { reviewId });
    await this.entityManager.removeAndFlush(reviewEntity);
  }
}