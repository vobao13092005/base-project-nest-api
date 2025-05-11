import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { apiResponse } from "src/helpers/response.helper";
import { ReviewService } from "src/services/database/review.service";

@Controller('/reviews')
export class ReviewController {
    constructor(
      private readonly reviewService: ReviewService
    ) {}

    @Get(':reviewId')
    async getReview(
      @Param('reviewId', ParseIntPipe) reviewId
    ) {
      const review = await this.reviewService.findByField({ reviewId });
      return apiResponse('OK', review);
    }
}