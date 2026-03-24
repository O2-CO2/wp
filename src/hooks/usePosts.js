import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';

const normalizePostsPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.posts)) {
    return payload.posts;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (payload == null) {
    return [];
  }

  throw new Error(`Неожиданный формат ответа публикаций: ${JSON.stringify(payload).slice(0, 180)}`);
};

export const usePosts = (page = 1, status = 'all') => {
  return useQuery({
    queryKey: ['posts', page, status],
    queryFn: async () => {
      const requestParams = {
        context: 'edit',
      };

      if (status !== 'all') {
        requestParams.status = status;
      } else {
        requestParams.status = 'any';
      }

      try {
        const response = await postsApi.getPosts(page, 10, requestParams);
        return normalizePostsPayload(response.data);
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 403) {
          const fallbackParams = status !== 'all' ? { status } : {};
          const fallback = await postsApi.getPosts(page, 10, fallbackParams);
          return normalizePostsPayload(fallback.data);
        }

        throw error;
      }
    },
    retry: false,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      try {
        const response = await postsApi.getPost(id, { context: 'edit' });
        return response.data;
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 403) {
          const fallback = await postsApi.getPost(id);
          return fallback.data;
        }

        throw error;
      }
    },
    enabled: Boolean(id),
    retry: false,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, postData }) => postsApi.updatePost(id, postData),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
