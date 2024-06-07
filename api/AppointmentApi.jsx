import ApiManager from "./ApiManager";

export const get_appointments = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/appointments/paginate?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_appointment_detail_by_id = async (id) => {
  try {
    const response = await ApiManager.get(`/customer/appointments/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_appointments_before_current_date = async (
  page_number,
  num_of_page
) => {
  try {
    const response = await ApiManager.get(
      `/customer/appointments/before-current-date?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_appointments_after_current_date = async (
  page_number,
  num_of_page
) => {
  try {
    const response = await ApiManager.get(
      `/customer/appointments/after-current-date?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_deleted_appointments = async (page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/appointments/deleted?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const create_appointment = async (data) => {
  const formData = new FormData();
  formData.append("doctor_id", data.doctor_id);
  formData.append("start_time", data.start_time);
  formData.append("done", data.done);
  formData.append("medical_center_id", data.medical_center_id);
  formData.append("message", data.message);
  formData.append("pet_id", data.pet_id);
  formData.append("customer_id", data.customer_id);

  try {
    const response = await ApiManager.post(`/customer/appointments`, formData);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const update_appointment = async (data, id) => {
  const formData = new FormData();
  try {
    const response = await ApiManager.put(
      `/customer/appointments/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const delete_appointment = async (id) => {
  try {
    const response = await ApiManager.delete(`/customer/appointments/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_doctors_free_time = async (id, date) => {
  try {
    const response = await ApiManager.get(
      `/customer/doctors/${id}/freetime?date=${date}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const get_doctors_of_medical_center = async (
  id,
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
      `/customer/doctors/medical-center/${id}/paging?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
};
