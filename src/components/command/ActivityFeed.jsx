function formatIncidentTime(value) {
  if (!value) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderSourceLink(label, url) {
  if (!url) {
    return <span className="activity-source-link">{label}</span>;
  }

  const isExternal = url.startsWith("http");

  return (
    <a
      className="activity-source-link"
      href={url}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {label}
    </a>
  );
}

export default function ActivityFeed({ items }) {
  return (
    <article className="command-rail-card">
      <div className="panel-heading">
        <span>Live activity feed</span>
        <strong>Persisted incident events</strong>
      </div>

      <div className="activity-feed">
        {items.length === 0 ? (
          <div className="command-feed-empty">
            <p>No persisted incident events yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <article className="activity-item" key={item.id}>
              <div className="activity-item-top">
                <span className={`activity-kind activity-${item.kind}`}>{item.actor}</span>
                <span className="activity-time">{formatIncidentTime(item.occurredAt)}</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.message}</p>
              <div className="activity-source-row">
                {renderSourceLink(item.sourceLabel, item.sourceUrl)}
              </div>
            </article>
          ))
        )}
      </div>
    </article>
  );
}
