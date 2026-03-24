
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';

export const Register = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await registerMutation.mutateAsync(formData);
      navigate(APP_ROUTES.login, { replace: true });
    } catch {
      // handled in UI via mutation.error
    }
  };

  return (
    <section className="auth-card">
      <h1>Регистрация</h1>
      <p className="muted">Создайте учетную запись WordPress для управления публикациями.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="register-username">Логин</label>
        <input
          id="register-username"
          type="text"
          value={formData.username}
          onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          required
        />

        <label htmlFor="register-password">Пароль</label>
        <input
          id="register-password"
          type="password"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          required
          minLength={8}
        />

        {registerMutation.isError && (
          <p className="form-error">
            Endpoint регистрации недоступен или вернул ошибку.
          </p>
        )}

        <button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Создаем аккаунт...' : 'Создать аккаунт'}
        </button>
      </form>

      <p className="auth-switch">
        Уже есть аккаунт? <Link to={APP_ROUTES.login}>Войти</Link>
      </p>
    </section>
  );
};
