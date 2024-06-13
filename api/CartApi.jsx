import ApiManager from "./ApiManager";

export const create_cart = async () => {
  try {
    const response = await ApiManager.post("/customer/carts");
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_current_cart = async () => {
  try {
    const response = await ApiManager.get("/customer/carts");
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const add_item_to_cart = async (cartId, productId, quantity) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("quantity", quantity);
  try {
    const response = await ApiManager.post(
      `/customer/cart-items/${cartId}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const remove_item_from_cart = async (itemId) => {
  try {
    const response = await ApiManager.post(
      `/customer/cart-items/${itemId}/deleted`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const increase_item_quantity = async (cartId, productId) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  try {
    const response = await ApiManager.post(
      `/customer/cart-items/${cartId}/increase`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const decrease_item_quantity = async (cartId, productId) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  try {
    const response = await ApiManager.post(
      `/customer/cart-items/${cartId}/decrease`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
