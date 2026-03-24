
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginMutation } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const loginErrorMessage = loginMutation.error?.response?.data?.message
    ?? loginMutation.error?.message
    ?? 'Не удалось войти. Проверьте логин и пароль и попробуйте снова.';

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.posts} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync(formData);
      navigate(APP_ROUTES.posts, { replace: true });
    } catch {
      // handled in UI via mutation.error
    }
  };

  return (
    <section className="auth-card">
      <h1>Вход</h1>
      <p className="muted">Введите учетные данные WordPress.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">Логин</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
          required
        />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          required
        />

        {loginMutation.isError && (
          <p className="form-error">{loginErrorMessage}</p>
        )}

        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Входим...' : 'Войти'}
        </button>
      </form>

      <p className="auth-switch">Регистрация в приложении временно отключена.</p>
    </section>
  );
};
