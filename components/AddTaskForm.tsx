
import React, { useState } from 'react';
import { Task, Priority, VideoType } from '../types';
import { EDITORS, VIDEO_TYPES, PRIORITY_LEVELS } from '../constants';
import { PlusIcon } from './icons/PlusIcon';

interface AddTaskFormProps {
  onAddTask: (taskData: Omit<Task, 'id' | 'status' | 'isUrgent' | 'progress' | 'approvalStatus' | 'createdAt'>) => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [editorId, setEditorId] = useState(EDITORS[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [notes, setNotes] = useState('');
  const [videoType, setVideoType] = useState<VideoType>('Social Media');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !editorId || !deadline) {
      alert('Please fill in Title, Editor, and Deadline.');
      return;
    }
    onAddTask({ title, editorId, deadline, fileLink, notes, videoType, priority });
    setTitle('');
    setEditorId(EDITORS[0]?.id || '');
    setDeadline('');
    setFileLink('');
    setNotes('');
    setVideoType('Social Media');
    setPriority(Priority.Medium);
  };

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-xl mb-8">
      <h2 className="text-xl font-semibold mb-4 text-brand-secondary">Add New Video Task</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input type="text" placeholder="Video Title" value={title} onChange={e => setTitle(e.target.value)} required className="col-span-1 md:col-span-2 bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        <select value={editorId} onChange={e => setEditorId(e.target.value)} required className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary">
          {EDITORS.map(editor => <option key={editor.id} value={editor.id}>{editor.name}</option>)}
        </select>
        <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary [color-scheme:dark]" />
        <input type="url" placeholder="File Link (Optional)" value={fileLink} onChange={e => setFileLink(e.target.value)} className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        <select value={videoType} onChange={e => setVideoType(e.target.value as VideoType)} className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary">
          {VIDEO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary">
          {PRIORITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
        </select>
        <input type="text" placeholder="Notes (Optional)" value={notes} onChange={e => setNotes(e.target.value)} className="col-span-1 md:col-span-2 lg:col-span-3 bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        <button type="submit" className="col-span-1 md:col-span-2 lg:col-span-1 bg-brand-secondary text-white font-bold p-2 rounded-md hover:bg-opacity-80 transition-all flex items-center justify-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Task
        </button>
      </form>
    </div>
  );
};
