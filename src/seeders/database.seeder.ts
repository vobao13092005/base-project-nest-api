import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Store, StoreStatus } from 'src/entities/store.entity';
import { StoreImage } from 'src/entities/store-image.entity';
import { Product, ProductStatus } from 'src/entities/product.entity';
import { ProductImage } from 'src/entities/product-image.entity';
import { UserService } from 'src/services/database/user.service';
import { PasswordService } from 'src/services/password.service';
import { UploadService } from 'src/services/upload.service';
import { Topping } from 'src/entities/topping.entity';
import { ToppingValue } from 'src/entities/topping-value.entity';
import { Address } from 'src/entities/address.entity';

export class DatabaseSeeder extends Seeder {

  async run(entityManager: EntityManager): Promise<void> {
    const passwordService = new PasswordService();
    const uploadService = new UploadService();
    const userService = new UserService(entityManager, passwordService, uploadService);

    const roleUser = new Role("User", 1);
    const roleAdmin = new Role("User", 1);
    await entityManager.persistAndFlush([roleUser, roleAdmin]);
    const user = new User();
    user.username = "test";
    user.password = "test";
    user.email = "vongocbao1392005@gmail.com";
    user.fullname = "Vo Ngoc Bao";
    user.phoneNumber = "0335237597";
    user.roles.add(roleUser);
    await userService.create(user);

    const parentUser = await entityManager.findOneOrFail(User, { userId: 1 })

    const address = new Address();
    address.addressName = "Nhà của tôi";
    address.addressNote = "Hihi";
    address.addressPhone = "09876543221";
    address.detailAddress = "Cảng Liyue, Teyvat";
    address.department = "Tầng 1";
    address.user = parentUser;
    await entityManager.persistAndFlush(address);

    const store = new Store();
    store.storeName = "Tiệm ăn vặt Bolt Baron";
    store.storeAddress = "Ngũ Hành Sơn, Đà Nẵng";
    store.storePhoneNumber = "0987654321";
    store.storeStatus = StoreStatus.ACTIVE;
    store.openingHours = "7:00";
    store.closingHours = "12:00";
    store.user = parentUser;
    const storeImage = new StoreImage();
    storeImage.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKl1R5PC0jj1Fzcm-kQEe1yz30b_slRKs4jQ&s';
    store.images.add(storeImage);
    await entityManager.persistAndFlush(store);

    const parentStore = await entityManager.findOneOrFail(Store, { storeId: 1 });

    // Product 1
    const product_1 = new Product();
    product_1.productName = "Trà sữa";
    product_1.productPrice = 30000;
    product_1.productDescription = "Trà sữa (Full topping)";
    product_1.productStatus = ProductStatus.AVAILABLE;
    const productImage_1 = new ProductImage();
    productImage_1.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKl1R5PC0jj1Fzcm-kQEe1yz30b_slRKs4jQ&s';
    product_1.images.add(productImage_1);
    // Product 2
    const product_2 = new Product();
    product_2.productName = "Mì cay";
    product_2.productPrice = 35000;
    product_2.productDescription = "Mì cay (Hải sản, Bò)";
    product_2.productStatus = ProductStatus.AVAILABLE;
    const productImage_2 = new ProductImage();
    productImage_2.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKl1R5PC0jj1Fzcm-kQEe1yz30b_slRKs4jQ&s';
    product_2.images.add(productImage_2);
    // Product 3
    const product_3 = new Product();
    product_3.productName = "Chân gà";
    product_3.productPrice = 35000;
    product_3.productDescription = "Chân gà (Xả tắc, sốt thái)";
    product_3.productStatus = ProductStatus.AVAILABLE;
    const productImage_3 = new ProductImage();
    productImage_3.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKl1R5PC0jj1Fzcm-kQEe1yz30b_slRKs4jQ&s';
    product_3.images.add(productImage_3);

    parentStore.products.add(product_1, product_2, product_3);
    await entityManager.persistAndFlush(parentStore);

    // Topping 1 - 1
    const topping_1 = new Topping();
    topping_1.toppingName = "Thạch";
    topping_1.multiple = true;
    // Topping 1 - 1's values
    const toppingValue_1_1 = new ToppingValue();
    toppingValue_1_1.toppingValueName = "Thạch dừa";
    toppingValue_1_1.toppingPrice = 5000;
    const toppingValue_1_2 = new ToppingValue();
    toppingValue_1_2.toppingValueName = "Thạch phô mai";
    toppingValue_1_2.toppingPrice = 8000;
    const toppingValue_1_3 = new ToppingValue();
    toppingValue_1_3.toppingValueName = "Thạch chocolate";
    toppingValue_1_3.toppingPrice = 4000;
    topping_1.toppingValues.add([toppingValue_1_1, toppingValue_1_2, toppingValue_1_3]);
    // Topping 1 - 2
    const topping_5 = new Topping();
    topping_5.toppingName = "Size";
    topping_5.multiple = false;
    // Topping 1 - 2's values
    const toppingValue_5_1 = new ToppingValue();
    toppingValue_5_1.toppingValueName = "Size vừa";
    toppingValue_5_1.toppingPrice = 5000;
    const toppingValue_5_2 = new ToppingValue();
    toppingValue_5_2.toppingValueName = "Size lớn";
    toppingValue_5_2.toppingPrice = 10000;
    topping_5.toppingValues.add([toppingValue_5_1, toppingValue_5_2]);
    // Topping 2
    const topping_2 = new Topping();
    topping_2.toppingName = "Vị";
    topping_2.multiple = false;
    // Topping 2's values
    const toppingValue_2_1 = new ToppingValue();
    toppingValue_2_1.toppingValueName = "Mì cay bò";
    toppingValue_2_1.toppingPrice = 10000;
    const toppingValue_2_2 = new ToppingValue();
    toppingValue_2_2.toppingValueName = "Mì cay hải sản";
    toppingValue_2_2.toppingPrice = 20000;
    const toppingValue_2_3 = new ToppingValue();
    toppingValue_2_3.toppingValueName = "Mì cay xúc xích cá viên";
    toppingValue_2_3.toppingPrice = 5000;
    topping_2.toppingValues.add([toppingValue_2_1, toppingValue_2_2, toppingValue_2_3]);
    // Topping 3 - 1
    const topping_3 = new Topping();
    topping_3.toppingName = "Loại sốt";
    topping_3.multiple = false;
    // Topping 3 - 1's values
    const toppingValue_3_1 = new ToppingValue();
    toppingValue_3_1.toppingValueName = "Sốt thái";
    toppingValue_3_1.toppingPrice = 10000;
    const toppingValue_3_2 = new ToppingValue();
    toppingValue_3_2.toppingValueName = "Sốt sả tắc";
    toppingValue_3_2.toppingPrice = 5000;
    topping_3.toppingValues.add([toppingValue_3_1, toppingValue_3_2]);
    // Topping 3 - 2
    const topping_4 = new Topping();
    topping_4.toppingName = "Đồ ăn phụ";
    topping_4.multiple = true;
    // Topping 3 - 2's values
    const toppingValue_4_1 = new ToppingValue();
    toppingValue_4_1.toppingValueName = "Xoài";
    toppingValue_4_1.toppingPrice = 5000;
    const toppingValue_4_2 = new ToppingValue();
    toppingValue_4_2.toppingValueName = "Trứng non";
    toppingValue_4_2.toppingPrice = 15000;
    topping_4.toppingValues.add([toppingValue_4_1, toppingValue_4_2]);
    // Thêm toàn bộ topping trên vào cửa hàng
    parentStore.toppings.add([topping_1, topping_2, topping_3, topping_4, topping_5]);

    const product_1_Parent = await entityManager.findOneOrFail(Product, { productId: 1 });
    product_1_Parent.toppings.add([topping_1, topping_5]);
    const product_2_Parent = await entityManager.findOneOrFail(Product, { productId: 2 });
    product_2_Parent.toppings.add([topping_2]);
    const product_3_Parent = await entityManager.findOneOrFail(Product, { productId: 3 });
    product_3_Parent.toppings.add([topping_3, topping_4]);
    await entityManager.persistAndFlush([product_1_Parent, product_2_Parent, product_3_Parent]);
  }
}
