import type { Product } from "./webhook.type";

export const onProductPurchaseAsync = (data: Product) => {
  console.log(data);
};

export const onProductRefundAsync = (data: Product) => {
  // Do something with the product
  console.log(data);
};
