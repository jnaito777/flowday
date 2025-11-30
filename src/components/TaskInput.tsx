import { useState } from 'react';
import './TaskInput.css';

interface TaskInputProps {
  onAddTask: (title: string, estimatedMinutes: number, category?: string, description?: string) => void;
}

const MIN_ESTIMATE = 5;
const MAX_ESTIMATE = 480;
const ESTIMATE_STEP = 5;
const DEFAULT_ESTIMATE = 30;
const CATEGORIES = ['work', 'personal', 'other'];

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [estimatedMinutes, setEstimatedMinutes] = useState(DEFAULT_ESTIMATE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): string | null => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return 'Task title is required';
    if (estimatedMinutes < MIN_ESTIMATE || estimatedMinutes > MAX_ESTIMATE) {
      return `Estimate must be between ${MIN_ESTIMATE} and ${MAX_ESTIMATE} minutes`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      onAddTask(title.trim(), estimatedMinutes, category, description.trim());
      setTitle('');
      setDescription('');
      setCategory('work');
      setEstimatedMinutes(DEFAULT_ESTIMATE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('work');
    setEstimatedMinutes(DEFAULT_ESTIMATE);
    setError(null);
  };

  return (
    <div className="task-input-container">
      <h2>New Task</h2>
      <form className="task-input-form" onSubmit={handleSubmit}>
        <div className="form-row full">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
              aria-label="Task title"
            />
          </div>
        </div>

        <div className="form-row full">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Add task details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              aria-label="Task description"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              aria-label="Task category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="minutes">Estimate (minutes) *</label>
            <input
              id="minutes"
              type="number"
              min={MIN_ESTIMATE}
              max={MAX_ESTIMATE}
              step={ESTIMATE_STEP}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              disabled={isLoading}
              required
              aria-label="Estimated minutes"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Adding Task...' : 'Add Task'}
          </button>
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
