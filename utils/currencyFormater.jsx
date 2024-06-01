import "intl";
import "intl/locale-data/jsonp/en";

export const formatVND = (money) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(money);
};
