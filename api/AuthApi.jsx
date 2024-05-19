import ApiManager from "./ApiManager";

export const user_login = async (data) => {
  try {
    const response = await ApiManager("/auth/login", {
      method: "POST",
      data: data,
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const user_register = async (data) => {
  try {
    const response = await ApiManager("/auth/register", {
      method: "POST",
      data: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};
