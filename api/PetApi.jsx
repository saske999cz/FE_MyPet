import ApiManager from "./ApiManager";

export const create_pet = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("breed_id", data.breed_id);
    formData.append("type", data.type);
    formData.append("age", data.age);
    formData.append("is_purebred", data.is_purebred);
    formData.append("image", data.image);
    formData.append("gender", data.gender);
    const response = await ApiManager.post(`/customer/pets`, formData);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_pet = async (data, id) => {
  try {
    const response = await ApiManager.put(`/customer/pets/${id}`, {
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const delete_pet = async (id) => {
  try {
    const response = await ApiManager.delete(`/customer/pets/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_pets = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager(
      `/customer/pets/paginate?page_number=${page_number}&num_of_page=${num_of_page}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_my_adopted_pets = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager(
      `/customer/pets/adopted/paginate?page_number=${page_number}&num_of_page=${num_of_page}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_all_my_pets = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager(
      `/customer/pets/all/paginate?page_number=${page_number}&num_of_page=${num_of_page}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_pet_detail_by_id = async (id) => {
  try {
    const response = await ApiManager(`/customer/pets/${id}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const search_pets = async (search_query, page_number, num_of_page) => {
  try {
    const response = await ApiManager(
      `/customer/pets/search?page_number=${page_number}&num_of_page=${num_of_page}&name=${search_query}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_breeds = async (target) => {
  try {
    const response = await ApiManager(`/customer/breeds?target=${target}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};
