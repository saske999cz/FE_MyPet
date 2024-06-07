import ApiManager from "./ApiManager";

export const user_login = async (data) => {
  try {
    const response = await ApiManager.post("/auth/login", data);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const user_register = async (data) => {
  try {
    const response = await ApiManager.post("/auth/register", data);
    return response;
  } catch (error) {
    return error;
  }
};
