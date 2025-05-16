import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { InsertReviewData } from "src/controllers/product.controller";
import { Review } from "src/entities/review.entity";
import { apiError } from "src/helpers/response.helper";
import { UserService } from "./user.service";
import { ProductService } from "./product.service";
import { DeliveryStatus, OrderItem } from "src/entities/order-item.entity";

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
    const review = await this.entityManager.findOne(Review, data);
    return review;
  }
  async update(reviewId: number, review: Review) {
    const reviewEntity = await this.findByField({ reviewId: reviewId });
    if (!reviewEntity) {
      throw apiError('Không tìm thấy địa chỉ');
    }
    this.entityManager.assign(reviewEntity, review);
    await this.entityManager.flush();
  }
  async delete(reviewId: number) {
    const reviewEntity = await this.entityManager.findOne(Review, { reviewId });
    if (null === reviewEntity) {
      throw apiError('Không tìm thấy đánh giá');
    }
    await this.entityManager.removeAndFlush(reviewEntity);
  }
  async canWriteReview(userId: number, productId: number) {
    const orderItems = await this.entityManager.findAll(OrderItem, {
      where: {
        deliveryStatus: DeliveryStatus.delivered,
        product: {
          productId: productId
        },
        order: {
          user: {
            userId: userId
          }
        }
      }
    });
    if (orderItems.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async userHasReview(userId: number, productId: number): Promise<Review | null> {
    const review = await this.entityManager.findOne(Review, {
      user: {
        userId: userId
      },
      product: {
        productId: productId
      }
    }, {
      populate: ['user']
    });
    return review;
  }
}