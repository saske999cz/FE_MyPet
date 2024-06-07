import ApiManager from "./ApiManager";

export const get_highest_rating_medical_centers = async (
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
      `/customer/medical-centers/highest-rating?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_medical_center_detail_by_id = async (id) => {
  try {
    const response = await ApiManager.get(`/customer/medical-centers/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const search_medical_centers = async (
  search_query,
  page_number,
  num_of_page
) => {
  try {
    const response = await ApiManager.get(
      `/customer/medical-centers/search?page_number=${page_number}&num_of_page=${num_of_page}&name=${search_query}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
