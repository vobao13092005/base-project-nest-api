import { EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { apiError } from "src/helpers/response.helper";
import { StoreService } from "./store.service";
import { Product } from "src/entities/product.entity";
import { UploadService } from "../upload.service";
import { ProductImage } from "src/entities/product-image.entity";
import { UserService } from "./user.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storeService: StoreService,
    private readonly uploadService: UploadService,
    private readonly userService: UserService,
  ) { }
  async findByField(data: FilterQuery<Product>): Promise<Product | null> {
    const product = await this.entityManager.findOne(Product, data, {
      populate: ['toppings', 'toppings.toppingValues']
    });
    return product;
  }
  async findAll(data: FilterQuery<Product>): Promise<Product[] | null> {
    const product = await this.entityManager.find(Product, data);
    return product;
  }
  async create(storeId: number, product: Product) {
    const store = await this.storeService.findByField({ storeId });
    if (null === store) {
      throw apiError("Cửa hàng không hợp lệ");
    }
    const productEntity = this.entityManager.create(Product, product);
    productEntity.store = store;
    await this.entityManager.persistAndFlush(productEntity);
  }
  async update(productId: number, product: Product) {
    const productEntity = await this.findByField({ productId: productId });
    if (!productEntity) {
      throw apiError('Không tìm thấy dữ liệu sản phẩm');
    }
    this.entityManager.assign(productEntity, product);
    await this.entityManager.flush();
  }
  async delete(productId: number) {
    const productEntity = await this.findByField({ productId: productId });
    if (!productEntity) {
      throw apiError('Không tìm thấy dữ liệu cửa hàng');
    }
    await this.entityManager.removeAndFlush(productEntity);
  }
  async uploadImages(productId: number, images: Array<Express.Multer.File>) {
    const product = await this.findByField({ productId });
    if (null === product) {
      throw apiError('Không tìm thấy cửa hàng tương ứng');
    }
    const discordUploadedImages = await this.uploadService.uploadToDiscord(images);
    const storeImages = discordUploadedImages.map(image => {
      const productImage = new ProductImage();
      productImage.imageUrl = image.url;
      productImage.product = product;
      return productImage;
    });
    product.images.add(storeImages);
    await this.entityManager.persistAndFlush(product);
  }

  async deleteImages(imageIdList: number[]) {
    await this.entityManager.nativeDelete(ProductImage, {
      productImageId: {
        $in: imageIdList
      }
    });
  }

}