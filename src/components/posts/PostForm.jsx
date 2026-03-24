import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePost, usePost, useUpdatePost } from '../../hooks/usePosts';
import { APP_ROUTES } from '../../utils/constants';

const getErrorMessage = (error, fallbackText) => {
  return error?.response?.data?.message
    ?? error?.response?.data?.error_description
    ?? error?.message
    ?? fallbackText;
};

export const PostForm = ({ mode = 'create', postId = null, onNotify }) => {
  const navigate = useNavigate();
  const isEditMode = mode === 'edit' && Boolean(postId);
  const [draftData, setDraftData] = useState(null);
  const emptyForm = {
    title: '',
    content: '',
    status: 'draft',
  };

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const postQuery = usePost(postId);

  const sourceData = isEditMode && postQuery.data
    ? {
        title: postQuery.data.title?.raw ?? postQuery.data.title?.rendered ?? '',
        content: postQuery.data.content?.raw ?? postQuery.data.content?.rendered ?? '',
        status: postQuery.data.status ?? 'draft',
      }
    : emptyForm;

  const formData = draftData ?? sourceData;

  const updateField = (key, value) => {
    setDraftData((previous) => ({
      ...(previous ?? sourceData),
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditMode) {
        await updatePost.mutateAsync({ id: postId, postData: formData });
        onNotify?.({ type: 'success', message: 'Публикация обновлена.' });
        navigate(APP_ROUTES.posts);
        return;
      }

      await createPost.mutateAsync(formData);
      setDraftData(null);
      onNotify?.({ type: 'success', message: 'Публикация создана.' });
    } catch (error) {
      onNotify?.({
        type: 'error',
        message: getErrorMessage(error, isEditMode ? 'Не удалось обновить публикацию.' : 'Не удалось создать публикацию.'),
      });
    }
  };

  if (isEditMode && postQuery.isLoading) {
    return <p>Загружаем публикацию...</p>;
  }

  if (isEditMode && postQuery.isError) {
    return <p className="form-error">{getErrorMessage(postQuery.error, 'Не удалось загрузить публикацию для редактирования.')}</p>;
  }

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <label htmlFor="post-title">Заголовок</label>
      <input
        id="post-title"
        type="text"
        placeholder="Введите заголовок"
        value={formData.title}
        onChange={(event) => updateField('title', event.target.value)}
        required
      />

      <label htmlFor="post-content">Текст публикации</label>
      <textarea
        id="post-content"
        value={formData.content}
        onChange={(event) => updateField('content', event.target.value)}
        rows={10}
        required
      />

      <label htmlFor="post-status">Статус</label>
      <select
        id="post-status"
        value={formData.status}
        onChange={(event) => updateField('status', event.target.value)}
      >
        <option value="draft">Черновик</option>
        <option value="publish">Опубликовать</option>
        <option value="private">Приватно</option>
      </select>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Сохраняем...' : isEditMode ? 'Обновить публикацию' : 'Создать публикацию'}
      </button>
    </form>
  );
};
