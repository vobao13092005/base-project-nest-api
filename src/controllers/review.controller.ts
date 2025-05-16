import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { Review } from "src/entities/review.entity";
import { apiResponse } from "src/helpers/response.helper";
import { ReviewService } from "src/services/database/review.service";

@Controller('/reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }
  @Get(':reviewId')
  async getReview(
    @Param('reviewId', ParseIntPipe) reviewId: number
  ) {
    const review = await this.reviewService.findByField({ reviewId });
    return apiResponse('OK', review);
  }
  @Put(':reviewId')
  async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() reivew: Review
  ) {
    const review = await this.reviewService.update(reviewId, reivew);
    return apiResponse('Cập nhật đánh giá thành công', review);
  }
  @Delete(':reviewId')
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    await this.reviewService.delete(reviewId);
    return apiResponse('Xoá đánh giá thành công');
  }
}