import { EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { apiError } from "src/helpers/response.helper";
import { Store } from "src/entities/store.entity";
import { UploadService } from "../upload.service";
import { StoreImage } from "src/entities/store-image.entity";
import { InsertProductData } from "src/controllers/store.controller";
import { Product } from "src/entities/product.entity";
import { ProductImage } from "src/entities/product-image.entity";

@Injectable()
export class StoreService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly uploadService: UploadService,
  ) { }
  async findByField(data: FilterQuery<Store>): Promise<Store | null> {
    const store = await this.entityManager.findOne(Store, data);
    return store;
  }
  async update(storeId: number, store: Store) {
    const storeEntity = await this.findByField({ storeId: storeId });
    if (!storeEntity) {
      throw apiError('Không tìm thấy dữ liệu cửa hàng');
    }
    this.entityManager.assign(storeEntity, store);
    await this.entityManager.flush();
  }
  async delete(storeId: number) {
    const storeEntity = await this.findByField({ storeId: storeId });
    if (!storeEntity) {
      throw apiError('Không tìm thấy dữ liệu cửa hàng');
    }
    await this.entityManager.removeAndFlush(storeEntity);
  }

  async uploadImages(storeId: number, images: Array<Express.Multer.File>) {
    const store = await this.findByField({ storeId });
    if (null === store) {
      throw apiError('Không tìm thấy cửa hàng tương ứng');
    }
    const discordUploadedImages = await this.uploadService.uploadToCatbox(images);
    const storeImages = discordUploadedImages.map(image => {
      const storeImage = new StoreImage();
      storeImage.imageUrl = image.url;
      storeImage.store = store;
      return storeImage;
    });
    store.images.add(storeImages);
    await this.entityManager.persistAndFlush(store);
  }

  async deleteImages(imageIdList: number[]) {
    await this.entityManager.nativeDelete(StoreImage, {
      storeImageId: {
        $in: imageIdList
      }
    });
  }

  async addProduct(storeId: number, data: InsertProductData): Promise<Product> {
    const store = await this.findByField({ storeId });
    if (null === store) {
      throw apiError("Không thể tìm thấy cửa hàng");
    }
    const product = this.entityManager.create(Product, data.product);
    if (data.images?.length !== 0) {
      // Gán ảnh vào cửa hàng
      const uploadResponse = await this.uploadService.uploadToCatbox(data.images!);
      await product.images.load();
      const productImages: ProductImage[] = [];
      uploadResponse.forEach(discordUploadResponse => {
        const productImage = new ProductImage();
        productImage.imageUrl = discordUploadResponse.url;
        productImage.product = product;
        productImages.push(productImage);
      });
      product.images.add(productImages);
    }
    store.products.add(product);
    await this.entityManager.persistAndFlush(store);
    return product;
  }
}