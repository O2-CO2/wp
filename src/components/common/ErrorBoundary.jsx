import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Runtime error caught by ErrorBoundary:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="shell editor-shell">
          <h1>Что-то пошло не так</h1>
          <p className="muted">Произошла непредвиденная ошибка интерфейса. Обновите страницу.</p>
          <button type="button" onClick={this.handleReload}>Обновить страницу</button>
        </main>
      );
    }

    return this.props.children;
  }
}
