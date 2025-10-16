
import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMarkAsDone: (taskId: string) => void;
  onToggleUrgent: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onMarkAsDone, onToggleUrgent }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-brand-surface rounded-lg">
        <h3 className="text-xl text-brand-text-secondary">No tasks for this day.</h3>
        <p className="text-brand-text-secondary/70">Add a new task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onMarkAsDone={onMarkAsDone}
          onToggleUrgent={onToggleUrgent}
        />
      ))}
    </div>
  );
};
