import ApiManager from "./ApiManager";

export const update_profile = async (data) => {
  try {
    const response = await ApiManager.put("/customer/profile", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const change_password = async (data) => {
  try {
    const response = await ApiManager.post("/auth/change-password", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const get_my_profile = async () => {
  try {
    const response = await ApiManager.get("/customer/profile");
    return response;
  } catch (error) {
    return error;
  }
};
