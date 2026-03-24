
const paletteByIndex = ['mint', 'sun', 'coral', 'sky', 'cream'];
const spanByIndex = ['tile-wide', 'tile-regular', 'tile-regular', 'tile-regular', 'tile-wide'];

export const PostCard = ({ post, index, onEdit, onDelete, isDeleting }) => {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString()
    : 'Без даты';
  const statusLabel = {
    publish: 'Опубликовано',
    draft: 'Черновик',
    private: 'Приватно',
    future: 'Запланировано',
    pending: 'На модерации',
  }[post.status] ?? 'Неизвестно';
  const palette = paletteByIndex[index % paletteByIndex.length];
  const spanClass = spanByIndex[index % spanByIndex.length];

  return (
    <article className={`post-card post-card-${palette} ${spanClass}`}>
      <div className="card-blob" aria-hidden="true" />
      <header className="post-head">
        <span className="status-pill">{statusLabel}</span>
        <time className="post-date">{formattedDate}</time>
      </header>

      <h2 className="post-title" dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? 'Без названия' }} />
      <p className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered ?? 'Краткое описание отсутствует.' }} />

      <div className="post-meta">
        <div className="post-actions">
          <button type="button" onClick={() => onEdit(post.id)}>Редактировать</button>
          <button
            type="button"
            className="danger-button"
            onClick={() => onDelete(post.id, post.title?.rendered ?? 'Без названия')}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаляем...' : 'Удалить'}
          </button>
        </div>
      </div>
    </article>
  );
};
