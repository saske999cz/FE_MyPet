import ApiManager from "./ApiManager";

export const get_blogs = async (page_number, num_of_page) => {
  if (!page_number) {
    page_number = 1;
  }
  if (!num_of_page) {
    num_of_page = 10;
  }

  try {
    const response = await ApiManager.get(
      `/customer/blogs?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const get_my_blogs = async (page_number, num_of_page) => {
  if (!page_number) {
    page_number = 1;
  }
  if (!num_of_page) {
    num_of_page = 10;
  }

  try {
    const response = await ApiManager.get(
      `/customer/blogs/me?page_number=${page_number}&num_of_page=${num_of_page}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const get_blog_detail = async (blog_id) => {
  try {
    const response = await ApiManager.get(`/customer/blogs/${blog_id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const create_blog = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("text", data.text);
  formData.append("image", data.image);
  try {
    const response = await ApiManager.post("/customer/blogs", formData);
    return response;
  } catch (error) {
    return error;
  }
};

export const update_blog = async (blog_id, data) => {
  try {
    const response = await ApiManager.put(`/customer/blogs/${blog_id}`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const delete_blog = async (blog_id) => {
  try {
    const response = await ApiManager.delete(`/customer/blogs/${blog_id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const create_comment = async (data) => {
  const formData = new FormData();
  formData.append("blog_id", data.blog_id);
  formData.append("text", data.text);
  formData.append("parent_comments_id", data.parent_comments_id);
  try {
    const response = await ApiManager.post(`/customer/comments`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const edit_comment = async (comment_id, data) => {
  try {
    const response = await ApiManager.put(
      `/customer/comments/${comment_id}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const delete_comment = async (comment_id) => {
  try {
    const response = await ApiManager.delete(
      `/customer/comments/${comment_id}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const interact_blog = async (blog_id, interaction) => {
  try {
    const response = await ApiManager.post(
      `/customer/interacts/blog/${blog_id}?type=${interaction}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const interact_comment = async (comment_id, interaction) => {
  try {
    const response = await ApiManager.post(
      `/customer/interacts/comment/${comment_id}?type=${interaction}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const search_blog_by_title = async (title, page_number, num_of_page) => {
  try {
    const response = await ApiManager.get(
      `/customer/blogs/search/title?&page_number=${page_number}&num_of_page=${num_of_page}&title=${title}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const search_profile_by_username = async (
  username,
  page_number,
  num_of_page
) => {
  try {
    const response = await ApiManager.get(
      `/customer/blogs/profile?&page_number=${page_number}&num_of_page=${num_of_page}&username=${username}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const get_blog_by_user = async (user_id) => {
  try {
    const response = await ApiManager.get(`/customer/blogs/profile/${user_id}`);
    return response;
  } catch (error) {
    return error;
  }
};
