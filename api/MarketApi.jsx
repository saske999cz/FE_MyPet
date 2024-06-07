import ApiManager from "./ApiManager";

export const get_best_selling_products = async (
  page_number,
  num_of_page,
  target
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  if (target === "") {
    productTarget = "";
  } else {
    productTarget = `&target=${target}`;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/best-selling?page_number=${page_number}&num_of_page=${num_of_page}${productTarget}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_product_detail_by_id = async (id) => {
  try {
    const response = await ApiManager.get(`/customer/products/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_number_of_products_by_shop_and_category = async (
  shopId,
  categoryId
) => {
  try {
    const response = await ApiManager.get(
      `/customer/products/shop/${shopId}/category/${categoryId}/total`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_number_of_shops_selling_product_by_category = async (
  categoryId
) => {
  try {
    const response = await ApiManager.get(
      `/customer/products/shop/distinct/category/${categoryId}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_best_selling_products_by_shop = async (
  shopId,
  page_number,
  num_of_page
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/best-selling/shop/${shopId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_best_selling_products_by_category = async (
  categoryId,
  page_number,
  num_of_page
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/best-selling/category/${categoryId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_best_selling_products_by_shop_and_category = async (
  shopId,
  categoryId,
  page_number,
  num_of_page,
  target
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  if (target === undefined) {
    target = "";
  } else {
    target = `&target=${target}`;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/best-selling/shop/${shopId}/category/${categoryId}?page_number=${page_number}&num_of_page=${num_of_page}${target}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_highest_rating_products = async (page_number, num_of_page) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/highest-rating?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_highest_rating_products_by_shop = async (
  shopId,
  page_number,
  num_of_page,
  target
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  if (target === undefined) {
    target = "";
  } else {
    target = `&target=${target}`;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/highest-rating/shop/${shopId}?page_number=${page_number}&num_of_page=${num_of_page}${target}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_highest_rating_products_by_category = async (
  categoryId,
  page_number,
  num_of_page,
  target
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  if (target === undefined) {
    target = "";
  } else {
    target = `&target=${target}`;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/highest-rating/category/${categoryId}?page_number=${page_number}&num_of_page=${num_of_page}${target}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_highest_rating_products_by_shop_and_category = async (
  shopId,
  categoryId,
  page_number,
  num_of_page,
  target
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  if (target === undefined) {
    target = "";
  } else {
    target = `&target=${target}`;
  }
  try {
    const response = await ApiManager.get(
      `/customer/products/highest-rating/shop/${shopId}/category/${categoryId}?page_number=${page_number}&num_of_page=${num_of_page}${target}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const search_product = async (query) => {
  try {
    const response = await ApiManager.get(
      `/customer/products/search?name=${query}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_all_category_type_with_amount_of_products_by_shop = async (
  shopId
) => {
  try {
    const response = await ApiManager.get(
      `/customer/product-categories/type/shop/${shopId}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_best_selling_products_by_shop_and_category_type = async (
  shopId,
  categoryType,
  page_number,
  num_of_page
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }

  try {
    const response = await ApiManager.get(
      `/customer/products/best-selling/shop/${shopId}/category-type?page_number=${page_number}&num_of_page=${num_of_page}&category_type=${categoryType}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_product_reviews = async (
  productId,
  page_number,
  num_of_page
) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }

  try {
    const response = await ApiManager.get(
      `/customer/ratings/product/${productId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
