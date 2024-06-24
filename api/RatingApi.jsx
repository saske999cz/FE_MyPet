import ApiManager from "./ApiManager";

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

export const get_shop_reviews = async (shopId, page_number, num_of_page) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }

  try {
    const response = await ApiManager.get(
      `/customer/ratings/shop/${shopId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_doctor_reviews = async (
  doctorId,
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
      `/customer/ratings/doctor/${doctorId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_medical_center_reviews = async (
  medicalCenterId,
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
      `/customer/ratings/medical-center/${medicalCenterId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_product_review = async (productId, data) => {
  const formData = new FormData();
  formData.append("rating", data.rating);
  formData.append("description", data.description);
  try {
    const response = await ApiManager.post(
      `/customer/ratings/product/${productId}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_shop_review = async (shopId, data) => {
  const formData = new FormData();
  formData.append("rating", data.rating);
  formData.append("description", data.description);
  try {
    const response = await ApiManager.post(
      `/customer/ratings/shop/${shopId}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_doctor_review = async (doctorId, data) => {
  const formData = new FormData();
  formData.append("rating", data.rating);
  formData.append("description", data.description);
  try {
    const response = await ApiManager.post(
      `/customer/ratings/doctor/${doctorId}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_medical_center_review = async (medicalCenterId, data) => {
  const formData = new FormData();
  formData.append("rating", data.rating);
  formData.append("description", data.description);
  try {
    const response = await ApiManager.post(
      `/customer/ratings/medical-center/${medicalCenterId}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_product_review = async (reviewId, data) => {
  try {
    const response = await ApiManager.patch(
      `/customer/ratings/${reviewId}/product`,
      data
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_shop_review = async (reviewId, data) => {
  try {
    const response = await ApiManager.patch(
      `/customer/ratings/${reviewId}/shop`,
      data
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_doctor_review = async (reviewId, data) => {
  try {
    const response = await ApiManager.patch(
      `/customer/ratings/${reviewId}/doctor`,
      data
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_medical_center_review = async (reviewId, data) => {
  try {
    const response = await ApiManager.patch(
      `/customer/ratings/${reviewId}/medical-center`,
      data
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const delete_product_review = async (reviewId) => {
  try {
    const response = await ApiManager.delete(
      `/customer/ratings/${reviewId}/product`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
export const delete_shop_review = async (reviewId) => {
  try {
    const response = await ApiManager.delete(
      `/customer/ratings/${reviewId}/shop`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const delete_doctor_review = async (reviewId) => {
  try {
    const response = await ApiManager.delete(
      `/customer/ratings/${reviewId}/doctor`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const delete_medical_center_review = async (reviewId) => {
  try {
    const response = await ApiManager.delete(
      `/customer/ratings/${reviewId}/medical-center`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_done_suborders = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/sub-orders/done?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_done_appointments = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/appointments/done?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_product_review_detail = async (productId) => {
  try {
    const response = await ApiManager.get(
      `/customer/ratings/product/${productId}/detail`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_shop_review_detail = async (shopId) => {
  try {
    const response = await ApiManager.get(
      `/customer/ratings/shop/${shopId}/detail`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_doctor_review_detail = async (doctorId) => {
  try {
    const response = await ApiManager.get(
      `/customer/ratings/doctor/${doctorId}/detail`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_medical_center_review_detail = async (medicalCenterId) => {
  try {
    const response = await ApiManager.get(
      `/customer/ratings/medical-center/${medicalCenterId}/detail`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
