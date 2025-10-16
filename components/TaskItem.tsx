
import React from 'react';
import { Task, Status } from '../types';
import { EDITORS, PRIORITY_COLORS, URGENT_COLOR, DONE_COLOR, OVERDUE_COLOR, OVERDUE_HOUR } from '../constants';
import { FireIcon } from './icons/FireIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMarkAsDone: (taskId: string) => void;
  onToggleUrgent: (taskId: string) => void;
}

const TaskItemComponent: React.FC<TaskItemProps> = ({ task, onUpdateTask, onMarkAsDone, onToggleUrgent }) => {
  const editor = EDITORS.find(e => e.id === task.editorId);
  const isOverdue = new Date().getHours() >= OVERDUE_HOUR && task.status === Status.Pending;

  const cardColorClass = () => {
    if (task.status === Status.Done) return DONE_COLOR;
    if (isOverdue) return OVERDUE_COLOR;
    if (task.isUrgent) return URGENT_COLOR;
    return PRIORITY_COLORS[task.priority];
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask(task.id, { progress: parseInt(e.target.value, 10) });
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 transition-all duration-300 shadow-md flex flex-col space-y-4 ${cardColorClass()}`}>
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-brand-text">{task.title}</h3>
          <p className="text-sm text-brand-text-secondary">For: {task.videoType}</p>
        </div>
        <div className="flex items-center space-x-2">
           {editor && <img src={editor.avatar} alt={editor.name} title={editor.name} className="h-10 w-10 rounded-full border-2 border-brand-secondary" />}
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-brand-text-secondary">Deadline: <span className="text-brand-text font-medium">{new Date(task.deadline).toLocaleString()}</span></div>
          <div className="text-brand-text-secondary">Priority: <span className="text-brand-text font-medium">{task.priority}</span></div>
          {task.fileLink && <div className="col-span-2"><a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">File Link</a></div>}
          {task.notes && <div className="col-span-2 bg-black/20 p-2 rounded-md"><p className="text-brand-text-secondary text-xs italic">Notes: {task.notes}</p></div>}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={`progress-${task.id}`} className="text-xs text-brand-text-secondary">Progress</label>
            <span className="text-sm font-semibold text-brand-text">{task.progress}%</span>
        </div>
        <div className="w-full bg-brand-primary rounded-full h-2.5">
          <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
        </div>
        {task.status === Status.Pending && <input id={`progress-${task.id}`} type="range" min="0" max="100" value={task.progress} onChange={handleProgressChange} className="w-full h-1 bg-transparent cursor-pointer appearance-none focus:outline-none mt-2" />}
      </div>
      
      {/* Actions */}
      {task.status === Status.Pending && (
        <div className="flex justify-end items-center space-x-2 border-t border-white/10 pt-4">
          <button onClick={() => onToggleUrgent(task.id)} className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${task.isUrgent ? 'bg-yellow-500 text-black' : 'bg-brand-primary hover:bg-yellow-600/50'}`}>
            <FireIcon className="h-4 w-4" />
            {task.isUrgent ? 'Urgent' : 'Mark Urgent'}
          </button>
          <button onClick={() => onMarkAsDone(task.id)} className="px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white transition-colors">
            <CheckCircleIcon className="h-4 w-4" />
            Mark as Done
          </button>
        </div>
      )}

      {/* Done State Info */}
      {task.status === Status.Done && (
        <div className="text-center border-t border-white/10 pt-4">
            <p className="text-green-400 font-semibold flex items-center justify-center gap-2"><CheckCircleIcon className="h-5 w-5" /> Completed</p>
            <p className="text-xs text-brand-text-secondary mt-1">
              At: {task.completionTimestamp ? new Date(task.completionTimestamp).toLocaleString() : 'N/A'}
            </p>
        </div>
      )}
    </div>
  );
};

export const TaskItem = React.memo(TaskItemComponent);

