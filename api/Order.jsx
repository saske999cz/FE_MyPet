import ApiManager from "./ApiManager";

export const create_order = async (data) => {
  const formData = new FormData();
  formData.append("cart_id", data.cart_id);
  formData.append("payment_method", data.payment_method);
  formData.append("address", data.address);
  formData.append("transaction_order_id", data.transaction_order_id);
  try {
    const response = await ApiManager.post(`/customer/orders`, formData);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_orders = async () => {
  try {
    const response = await ApiManager.get(`/customer/orders`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_order_detail = async (orderId) => {
  try {
    const response = await ApiManager.get(`/customer/orders/${orderId}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
