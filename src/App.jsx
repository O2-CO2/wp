import { useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { PostForm } from './components/posts/PostForm';
import { PostsList } from './components/posts/PostsList';
import { useAuth } from './hooks/useAuth';
import { APP_ROUTES } from './utils/constants';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return children;
};

const NotificationBanner = ({ notification, onClose }) => {
  if (!notification) {
    return null;
  }

  return (
    <div className={`notice notice-${notification.type}`}>
      <p>{notification.message}</p>
      <button type="button" onClick={onClose}>Закрыть</button>
    </div>
  );
};

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'publish', label: 'Опубликовано' },
  { value: 'draft', label: 'Черновики' },
  { value: 'private', label: 'Приватные' },
];

const PostsPage = ({ notification, onNotify, onClearNotice }) => {
  const { user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const displayName = user?.user_nicename ?? user?.user_email ?? 'автор';

  return (
    <main className="shell blog-shell">
      <header className="blog-hero">
        <p className="eyebrow">Редакционная панель</p>
        <h1 className="blog-title">.BlogIn</h1>
        <p className="blog-subtitle">Публикуйте, редактируйте и курируйте материалы в одном рабочем пространстве.</p>

        <nav className="header-actions">
          <Link className="button-link" to={APP_ROUTES.createPost}>Написать статью</Link>
          <button type="button" onClick={logout}>Выйти</button>
        </nav>
      </header>

      <section className="blog-toolbar">
        <p className="muted">Вы вошли как {displayName}</p>

        <div className="filter-group">
          <label htmlFor="posts-filter" className="filter-label">Фильтр публикаций</label>
          <select
            id="posts-filter"
            className="posts-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </section>

      <NotificationBanner notification={notification} onClose={onClearNotice} />

      <PostsList status={statusFilter} onNotify={onNotify} />
    </main>
  );
};

const CreatePostPage = ({ notification, onNotify, onClearNotice }) => {
  return (
    <main className="shell editor-shell">
      <header className="shell-header">
        <h1>Новая статья</h1>
        <Link className="button-link subtle" to={APP_ROUTES.posts}>К списку публикаций</Link>
      </header>

      <NotificationBanner notification={notification} onClose={onClearNotice} />
      <PostForm mode="create" onNotify={onNotify} />
    </main>
  );
};

const EditPostPage = ({ notification, onNotify, onClearNotice }) => {
  const { id } = useParams();

  return (
    <main className="shell editor-shell">
      <header className="shell-header">
        <h1>Редактирование статьи</h1>
        <Link className="button-link subtle" to={APP_ROUTES.posts}>К списку публикаций</Link>
      </header>

      <NotificationBanner notification={notification} onClose={onClearNotice} />
      <PostForm mode="edit" postId={id} onNotify={onNotify} />
    </main>
  );
};

function App() {
  const [notification, setNotification] = useState(null);

  const notify = ({ type, message }) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={APP_ROUTES.posts} replace />} />
        <Route path={APP_ROUTES.login} element={<Login />} />
        <Route
          path={APP_ROUTES.posts}
          element={(
            <ProtectedRoute>
              <PostsPage
                notification={notification}
                onNotify={notify}
                onClearNotice={clearNotification}
              />
            </ProtectedRoute>
          )}
        />
        <Route
          path={APP_ROUTES.createPost}
          element={(
            <ProtectedRoute>
              <CreatePostPage
                notification={notification}
                onNotify={notify}
                onClearNotice={clearNotification}
              />
            </ProtectedRoute>
          )}
        />
        <Route
          path={APP_ROUTES.editPostPattern}
          element={(
            <ProtectedRoute>
              <EditPostPage
                notification={notification}
                onNotify={notify}
                onClearNotice={clearNotification}
              />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to={APP_ROUTES.posts} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
