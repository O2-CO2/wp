
import { Link, useNavigate } from 'react-router-dom';
import { useDeletePost, usePosts } from '../../hooks/usePosts';
import { PostCard } from './PostCard';
import { APP_ROUTES } from '../../utils/constants';

const getErrorMessage = (error, fallbackText) => {
  return error?.response?.data?.message
    ?? error?.response?.data?.error_description
    ?? error?.message
    ?? fallbackText;
};

export const PostsList = ({ status = 'all', onNotify }) => {
  const navigate = useNavigate();
  const { data: posts, isLoading, isError, error } = usePosts(1, status);
  const deletePost = useDeletePost();
  const errorMessage = error?.response?.data?.message
    ?? error?.response?.data?.error_description
    ?? error?.message
    ?? 'Не удалось загрузить публикации. Проверьте права доступа или токен.';

  const handleEdit = (postId) => {
    navigate(APP_ROUTES.editPost(postId));
  };

  const handleDelete = async (postId, postTitle) => {
    const confirmed = window.confirm(`Удалить публикацию "${postTitle}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deletePost.mutateAsync(postId);
      onNotify?.({ type: 'success', message: 'Публикация удалена.' });
    } catch (deleteError) {
      onNotify?.({
        type: 'error',
        message: getErrorMessage(deleteError, 'Не удалось удалить публикацию.'),
      });
    }
  };

  if (isLoading) {
    return <p className="panel-message">Загружаем последние публикации...</p>;
  }

  if (isError) {
    return (
      <div className="panel-message">
        <p>Не удалось загрузить публикации.</p>
        <p className="form-error">{errorMessage}</p>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <p className="panel-message">
        В этом разделе пока нет публикаций. <Link to={APP_ROUTES.createPost}>Напишите первую.</Link>
      </p>
    );
  }

  return (
    <section className="posts-feed">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deletePost.isPending}
        />
      ))}
    </section>
  );
};
