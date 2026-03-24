
export const STORAGE_KEYS = {
  token: 'jwt_token',
  user: 'user_data',
};

export const APP_ROUTES = {
  login: '/login',
  posts: '/posts',
  createPost: '/posts/new',
  editPostPattern: '/posts/:id/edit',
  editPost: (id) => `/posts/${id}/edit`,
};
