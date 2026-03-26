function formatIncidentTime(value) {
  if (!value) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderSourceLink(label, url) {
  if (!url) {
    return <span className="rail-source-link">{label}</span>;
  }

  const isExternal = url.startsWith("http");

  return (
    <a
      className="rail-source-link"
      href={url}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {label}
    </a>
  );
}

export default function TimelineRail({ items }) {
  return (
    <article className="command-rail-card">
      <div className="panel-heading">
        <span>Incident timeline</span>
        <strong>Minute-by-minute rail</strong>
      </div>

      <div className="timeline-rail">
        {items.length === 0 ? (
          <div className="command-feed-empty">
            <p>No persisted incident events yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <div className="rail-item" key={item.id}>
              <span className="rail-time">{formatIncidentTime(item.occurredAt)}</span>
              <h4>{item.title}</h4>
              <p>{item.message}</p>
              <div className="rail-source-row">
                {renderSourceLink(item.sourceLabel, item.sourceUrl)}
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
