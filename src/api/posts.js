import api from './axios';

const buildPostsQuery = (page, perPage, params = {}) => {
    const query = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    });

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.set(key, String(value));
        }
    });

    return query.toString();
};

export const postsApi = {
    getPosts: (page = 1, perPage = 10, params = {}) =>
        api.get(`/wp/v2/posts?${buildPostsQuery(page, perPage, params)}`),

    getPost: (id, params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(query ? `/wp/v2/posts/${id}?${query}` : `/wp/v2/posts/${id}`);
    },

    createPost: (postData) =>
        api.post('/wp/v2/posts', {
            title: postData.title,
            content: postData.content,
            status: postData.status ?? 'draft',
            excerpt: postData.excerpt,
            featured_media: postData.imageId,
        }),

    updatePost: (id, postData) =>
        api.put(`/wp/v2/posts/${id}`, postData),

    deletePost: (id) =>
        api.delete(`/wp/v2/posts/${id}`, {
            data: { force: true }
        }),

    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/wp/v2/media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
