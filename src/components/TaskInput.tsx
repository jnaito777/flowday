import { useState } from 'react';
import './TaskInput.css';

interface TaskInputProps {
  onAddTask: (title: string, estimatedMinutes: number) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), estimatedMinutes);
      setTitle('');
      setEstimatedMinutes(30);
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
        />
        <div className="time-estimate-group">
          <label htmlFor="minutes">Estimate:</label>
          <input
            id="minutes"
            type="number"
            min="5"
            max="480"
            step="5"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            className="time-input"
          />
          <span className="time-unit">min</span>
        </div>
        <button type="submit" className="add-task-btn">
          Add Task
        </button>
      </div>
    </form>
  );
}



