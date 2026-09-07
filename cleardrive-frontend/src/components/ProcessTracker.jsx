import './ProcessTracker.css';

export default function ProcessTracker({ booking }) {
  return (
    <div className="tracker">
      {booking.stages.map((stage, index) => {
        const status =
          index < booking.currentStageIndex
            ? 'done'
            : index === booking.currentStageIndex
            ? 'current'
            : 'pending';

        return (
          <div key={stage} className={`tracker-step ${status}`}>
            <div className="tracker-dot">{status === 'done' ? '✓' : index + 1}</div>
            <div className="tracker-label">
              <div className="tracker-title">{stage}</div>
              {status === 'current' && <div className="tracker-status">In progress</div>}
              {status === 'done' && <div className="tracker-status done-text">Completed</div>}
            </div>
            {index < booking.stages.length - 1 && (
              <div className={`tracker-line ${status === 'done' ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
