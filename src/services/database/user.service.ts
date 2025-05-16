import { EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { PasswordService } from "../password.service";
import { apiError } from "src/helpers/response.helper";
import { Role } from "src/entities/role.entity";
import { Address } from "src/entities/address.entity";
import { Store } from "src/entities/store.entity";
import { UploadService } from "../upload.service";
import { StoreImage } from "src/entities/store-image.entity";
import { InsertStoreData } from "src/controllers/user.controller";

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly uploadService: UploadService,
  ) { }
  /**
   * Hàm tìm kiếm người dùng bằng Partial<User>
   */
  async findByField(data: FilterQuery<User>): Promise<User | null> {
    const user = await this.entityManager.findOne(User, data);
    return user;
  }
  /**
   * Hàm tạo người dùng sau đó gán cho người dùng đó một
   * role User
   */
  async create(user: User) {
    // Check tên người dùng
    const registrationUsernameCheck = await this.findByField({ username: user.username });
    if (registrationUsernameCheck) {
      throw apiError('Tên người dùng này đã tồn tại, hãy chọn tên khác');
    }
    // Check địa chỉ email
    const registrationEmailCheck = await this.findByField({ email: user.email });
    if (registrationEmailCheck) {
      throw apiError('Địa chỉ email này đã được sử dụng, hãy dùng địa chỉ khác');
    }
    user.password = this.passwordService.encrypt(user.password);
    // Thêm người dùng mới vào CSDL
    const entity = this.entityManager.create(User, user);
    // Người dùng mới được tạo sẽ mang role User
    const roleUser = await this.entityManager.findOne(Role, {
      roleLabel: 'User'
    });
    if (!roleUser) {
      throw apiError('Có lỗi xảy ra trong quá trình đăng ký (Không tìm thấy role người dùng (User) để gán)');
    }
    entity.roles.add(roleUser);
    return await this.entityManager.persistAndFlush(entity);
  }
  /**
   * Cập nhật người dùng
   */
  async update(userId: number, user: User) {
    const userEntity = await this.findByField({ userId: userId });
    if (!userEntity) {
      throw apiError('Hong tìmm thấy ngừ dùng uwu');
    }
    this.entityManager.assign(userEntity, user);
    await this.entityManager.flush();
  }
  /**
   * Xoá người dùng
  */
  async delete(userId: number) {
    const userEntity = await this.entityManager.findOneOrFail(User, { userId });
    await this.entityManager.removeAndFlush(userEntity);
  }

  async addAddress(userId: number, address: Address): Promise<Address> {
    const user = await this.findByField({ userId: +userId });
    if (null === user) {
      throw apiError('Không tìm thấy người dùng');
    }
    const addressEntity = this.entityManager.create(Address, address);
    user.addresses.add(addressEntity);
    await this.entityManager.persistAndFlush(user);
    return address;
  }

  async addStore(userId: number, data: InsertStoreData): Promise<Store> {
    const user = await this.findByField({ userId: +userId });
    if (null === user) {
      throw apiError('Không tìm thấy người dùng');
    }
    const store = this.entityManager.create(Store, data.store);
    if (data.images?.length !== 0) {
      // Gán ảnh vào cửa hàng
      const uploadResponse = await this.uploadService.uploadToCatbox(data.images!);
      await store.images.load();
      const storeImages: StoreImage[] = [];
      uploadResponse.forEach(discordUploadResponse => {
        const storeImage = new StoreImage();
        storeImage.imageUrl = discordUploadResponse.url;
        storeImage.store = store;
        storeImages.push(storeImage);
      });
      store.images.add(storeImages);
    }
    // Gán ảnh vào cửa hàng
    user.stores.add(store);
    await this.entityManager.persistAndFlush(user);
    return store;
  }
}