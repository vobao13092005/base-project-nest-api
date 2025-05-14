import { AddressController } from "./address.controller";
import { AuthController } from "./auth.controller";
import { CartController } from "./cart.controller";
import { OrderItemController } from "./order-item.controller";
import { OrderController } from "./order.controller";
import { PaymentController } from "./payment.controller";
import { ProductController } from "./product.controller";
import { ReviewController } from "./review.controller";
import { StoreController } from "./store.controller";
import { SuggestionController } from "./suggestion.controller";
import { TokenController } from "./token.controller";
import { ToppingController } from "./topping.controller";
import { UserController } from "./user.controller";

const controllers = [
  TokenController,
  UserController,
  AuthController,
  AddressController,
  StoreController,
  ProductController,
  ReviewController,
  PaymentController,
  SuggestionController,
  ToppingController,
  OrderController,
  CartController,
  OrderItemController,
];

export default controllers;