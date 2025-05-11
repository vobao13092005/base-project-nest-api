import { AuthService } from "./auth.service";
import { AddressService } from "./database/address.service";
import { OrderService } from "./database/order.service";
import { ProductService } from "./database/product.service";
import { ReviewService } from "./database/review.service";
import { SessionService } from "./database/session.service";
import { StoreService } from "./database/store.service";
import { ToppingValueService } from "./database/topping-value.service";
import { ToppingService } from "./database/topping.service";
import { UserService } from "./database/user.service";
import { DateTimeService } from "./daytime.service";
import { PasswordService } from "./password.service";
import { PaymentService } from "./payment.service";
import { TokenService } from "./token.service";
import { UploadService } from "./upload.service";

const services = [
  SessionService,
  UserService,
  AuthService,
  PasswordService,
  TokenService,
  AddressService,
  StoreService,
  ProductService,
  UploadService,
  ReviewService,
  PaymentService,
  DateTimeService,
  OrderService,
  ToppingService,
  ToppingValueService,
];

export default services;