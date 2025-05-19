import { Migration } from '@mikro-orm/migrations';

export class Migration20250519060146 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "categories" ("categoryId" serial primary key, "categoryName" varchar(255) not null, "categoryDescription" varchar(255) not null);`);

    this.addSql(`create table "roles" ("roleId" serial primary key, "roleLabel" text not null, "rolePriority" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "users" ("userId" serial primary key, "username" text not null, "password" text not null, "email" text not null, "fullname" text not null, "avatar" text null, "phoneNumber" text not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "stores" ("storeId" serial primary key, "storeName" text not null, "storeAddress" text not null, "storePhoneNumber" text not null, "storeStatus" text check ("storeStatus" in ('active', 'inactive', 'closed')) not null default 'active', "openingHours" text not null, "closingHours" text not null, "userId" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "toppings" ("toppingId" serial primary key, "toppingName" text not null, "multiple" boolean not null, "shopId" int not null);`);

    this.addSql(`create table "topping_values" ("toppingValueId" serial primary key, "toppingValueName" text not null, "toppingPrice" double precision not null, "toppingId" int not null);`);

    this.addSql(`create table "store_images" ("storeImageId" serial primary key, "imageUrl" text not null, "storeId" int not null);`);

    this.addSql(`create table "products" ("productId" serial primary key, "productName" text not null, "productPrice" double precision not null, "productDescription" text not null, "productStatus" text check ("productStatus" in ('available', 'outOfStock', 'discontinued')) not null default 'available', "storeId" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "products_toppings" ("productToppingId" serial primary key, "productId" int not null, "toppingId" int not null);`);

    this.addSql(`create table "product_images" ("productImageId" serial primary key, "imageUrl" text not null, "productId" int not null);`);

    this.addSql(`create table "products_categories" ("orderToppingId" serial primary key, "productId" int not null, "categoryId1" int not null);`);

    this.addSql(`create table "sessions" ("sessionId" serial primary key, "refreshToken" text not null, "userId" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "reviews" ("reviewId" serial primary key, "reviewScore" int not null, "reviewContent" text not null, "userId" int not null, "productId" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "addresses" ("addressId" serial primary key, "detailAddress" text not null, "addressName" text not null, "addressPhone" text not null, "department" text not null, "addressNote" text not null, "userId" int not null);`);

    this.addSql(`create table "orders" ("orderId" serial primary key, "vnpayOrderId" text null, "orderTotalPrice" double precision null, "isDraft" boolean not null, "purchaseMethod" varchar(255) null, "userId" int not null, "addressId" int null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "order_items" ("orderItemId" serial primary key, "totalPrice" double precision not null, "quantity" int not null, "note" text null, "deliveryStatus" text check ("deliveryStatus" in ('verifying', 'preparing', 'delivering', 'delivered', 'canceled')) not null, "productId" int not null, "orderId" int not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null);`);

    this.addSql(`create table "orders_toppings" ("orderToppingId" serial primary key, "orderItemId" int not null, "toppingValueId" int not null);`);

    this.addSql(`create table "users_roles" ("userRoleId" serial primary key, "userId" int not null, "roleId" int not null, "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now());`);

    this.addSql(`alter table "stores" add constraint "stores_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);

    this.addSql(`alter table "toppings" add constraint "toppings_shopId_foreign" foreign key ("shopId") references "stores" ("storeId") on update cascade on delete cascade;`);

    this.addSql(`alter table "topping_values" add constraint "topping_values_toppingId_foreign" foreign key ("toppingId") references "toppings" ("toppingId") on update cascade on delete cascade;`);

    this.addSql(`alter table "store_images" add constraint "store_images_storeId_foreign" foreign key ("storeId") references "stores" ("storeId") on update cascade on delete cascade;`);

    this.addSql(`alter table "products" add constraint "products_storeId_foreign" foreign key ("storeId") references "stores" ("storeId") on update cascade on delete cascade;`);

    this.addSql(`alter table "products_toppings" add constraint "products_toppings_productId_foreign" foreign key ("productId") references "products" ("productId") on update cascade on delete cascade;`);
    this.addSql(`alter table "products_toppings" add constraint "products_toppings_toppingId_foreign" foreign key ("toppingId") references "toppings" ("toppingId") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_images" add constraint "product_images_productId_foreign" foreign key ("productId") references "products" ("productId") on update cascade on delete cascade;`);

    this.addSql(`alter table "products_categories" add constraint "products_categories_productId_foreign" foreign key ("productId") references "products" ("productId") on update cascade on delete cascade;`);
    this.addSql(`alter table "products_categories" add constraint "products_categories_categoryId1_foreign" foreign key ("categoryId1") references "categories" ("categoryId") on update cascade on delete cascade;`);

    this.addSql(`alter table "sessions" add constraint "sessions_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);

    this.addSql(`alter table "reviews" add constraint "reviews_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);
    this.addSql(`alter table "reviews" add constraint "reviews_productId_foreign" foreign key ("productId") references "products" ("productId") on update cascade on delete cascade;`);

    this.addSql(`alter table "addresses" add constraint "addresses_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);

    this.addSql(`alter table "orders" add constraint "orders_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);
    this.addSql(`alter table "orders" add constraint "orders_addressId_foreign" foreign key ("addressId") references "addresses" ("addressId") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_items" add constraint "order_items_productId_foreign" foreign key ("productId") references "products" ("productId") on update cascade on delete cascade;`);
    this.addSql(`alter table "order_items" add constraint "order_items_orderId_foreign" foreign key ("orderId") references "orders" ("orderId") on update cascade on delete cascade;`);

    this.addSql(`alter table "orders_toppings" add constraint "orders_toppings_orderItemId_foreign" foreign key ("orderItemId") references "order_items" ("orderItemId") on update cascade on delete cascade;`);
    this.addSql(`alter table "orders_toppings" add constraint "orders_toppings_toppingValueId_foreign" foreign key ("toppingValueId") references "topping_values" ("toppingValueId") on update cascade on delete cascade;`);

    this.addSql(`alter table "users_roles" add constraint "users_roles_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_roles" add constraint "users_roles_roleId_foreign" foreign key ("roleId") references "roles" ("roleId") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products_categories" drop constraint "products_categories_categoryId1_foreign";`);

    this.addSql(`alter table "users_roles" drop constraint "users_roles_roleId_foreign";`);

    this.addSql(`alter table "stores" drop constraint "stores_userId_foreign";`);

    this.addSql(`alter table "sessions" drop constraint "sessions_userId_foreign";`);

    this.addSql(`alter table "reviews" drop constraint "reviews_userId_foreign";`);

    this.addSql(`alter table "addresses" drop constraint "addresses_userId_foreign";`);

    this.addSql(`alter table "orders" drop constraint "orders_userId_foreign";`);

    this.addSql(`alter table "users_roles" drop constraint "users_roles_userId_foreign";`);

    this.addSql(`alter table "toppings" drop constraint "toppings_shopId_foreign";`);

    this.addSql(`alter table "store_images" drop constraint "store_images_storeId_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_storeId_foreign";`);

    this.addSql(`alter table "topping_values" drop constraint "topping_values_toppingId_foreign";`);

    this.addSql(`alter table "products_toppings" drop constraint "products_toppings_toppingId_foreign";`);

    this.addSql(`alter table "orders_toppings" drop constraint "orders_toppings_toppingValueId_foreign";`);

    this.addSql(`alter table "products_toppings" drop constraint "products_toppings_productId_foreign";`);

    this.addSql(`alter table "product_images" drop constraint "product_images_productId_foreign";`);

    this.addSql(`alter table "products_categories" drop constraint "products_categories_productId_foreign";`);

    this.addSql(`alter table "reviews" drop constraint "reviews_productId_foreign";`);

    this.addSql(`alter table "order_items" drop constraint "order_items_productId_foreign";`);

    this.addSql(`alter table "orders" drop constraint "orders_addressId_foreign";`);

    this.addSql(`alter table "order_items" drop constraint "order_items_orderId_foreign";`);

    this.addSql(`alter table "orders_toppings" drop constraint "orders_toppings_orderItemId_foreign";`);

    this.addSql(`drop table if exists "categories" cascade;`);

    this.addSql(`drop table if exists "roles" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "stores" cascade;`);

    this.addSql(`drop table if exists "toppings" cascade;`);

    this.addSql(`drop table if exists "topping_values" cascade;`);

    this.addSql(`drop table if exists "store_images" cascade;`);

    this.addSql(`drop table if exists "products" cascade;`);

    this.addSql(`drop table if exists "products_toppings" cascade;`);

    this.addSql(`drop table if exists "product_images" cascade;`);

    this.addSql(`drop table if exists "products_categories" cascade;`);

    this.addSql(`drop table if exists "sessions" cascade;`);

    this.addSql(`drop table if exists "reviews" cascade;`);

    this.addSql(`drop table if exists "addresses" cascade;`);

    this.addSql(`drop table if exists "orders" cascade;`);

    this.addSql(`drop table if exists "order_items" cascade;`);

    this.addSql(`drop table if exists "orders_toppings" cascade;`);

    this.addSql(`drop table if exists "users_roles" cascade;`);
  }

}
