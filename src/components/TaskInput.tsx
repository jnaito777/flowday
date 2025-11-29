import { useState } from 'react';
import './TaskInput.css';

interface TaskInputProps {
  onAddTask: (title: string, estimatedMinutes: number) => void;
}

const MIN_ESTIMATE = 5;
const MAX_ESTIMATE = 480;
const ESTIMATE_STEP = 5;
const DEFAULT_ESTIMATE = 30;

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(DEFAULT_ESTIMATE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }

    if (estimatedMinutes < MIN_ESTIMATE || estimatedMinutes > MAX_ESTIMATE) {
      setError(`Estimate must be between ${MIN_ESTIMATE} and ${MAX_ESTIMATE} minutes`);
      return;
    }

    try {
      setIsLoading(true);
      onAddTask(trimmedTitle, estimatedMinutes);
      setTitle('');
      setEstimatedMinutes(DEFAULT_ESTIMATE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <div className="task-input-group">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input-field"
          disabled={isLoading}
          aria-label="Task title"
        />
        <div className="time-estimate-group">
          <label htmlFor="minutes">Estimate:</label>
          <input
            id="minutes"
            type="number"
            min={MIN_ESTIMATE}
            max={MAX_ESTIMATE}
            step={ESTIMATE_STEP}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            className="time-input"
            disabled={isLoading}
            aria-label="Estimated minutes"
          />
          <span className="time-unit">min</span>
        </div>
        <button type="submit" className="add-task-btn" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}
