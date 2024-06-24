import ApiManager from "./ApiManager";

export const get_unadopted_pets = async (page_number, num_of_page) => {
  if (page_number === undefined) {
    page_number = 1;
  }
  if (num_of_page === undefined) {
    num_of_page = 10;
  }
  try {
    const response = await ApiManager.get(
      `/customer/unadopted-pets?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_unadopted_pet_detail = async (petId) => {
  try {
    const response = await ApiManager.get(`/customer/unadopted-pets/${petId}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_adoption_request = async (petId) => {
  try {
    const response = await ApiManager.post(`/customer/adopt-pet/${petID}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_unadopted_pets_by_aid_center = async (
  centerId,
  page_number,
  num_of_page
) => {
  try {
    const response = await ApiManager.get(
      `/customer/unadopted-pets-of-aid-center/${centerId}?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_adopt_request = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/adopt-request?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_adopt_request_detail = async (requestId) => {
  try {
    const response = await ApiManager.get(
      `/customer/adopt-request/${requestId}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
