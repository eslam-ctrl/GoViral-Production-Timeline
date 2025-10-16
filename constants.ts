
import { Priority, Editor, VideoType } from './types';

export const EDITORS: Editor[] = [
  { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: '2', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria' },
  { id: '3', name: 'Chen Wei', avatar: 'https://i.pravatar.cc/150?u=chen' },
  { id: '4', name: 'Samira Khan', avatar: 'https://i.pravatar.cc/150?u=samira' },
];

export const VIDEO_TYPES: VideoType[] = ['Promo', 'Social Media', 'Ad', 'Tutorial', 'Internal'];

export const PRIORITY_LEVELS: Priority[] = [Priority.Low, Priority.Medium, Priority.High, Priority.Urgent];

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.Low]: 'bg-blue-600/30 border-blue-500',
  [Priority.Medium]: 'bg-cyan-600/30 border-cyan-500',
  [Priority.High]: 'bg-orange-600/30 border-orange-500',
  [Priority.Urgent]: 'bg-red-600/30 border-red-500',
};

export const URGENT_COLOR = 'bg-yellow-500/30 border-yellow-400';
export const DONE_COLOR = 'bg-green-600/30 border-green-500';
export const OVERDUE_COLOR = 'bg-red-800/50 border-red-600';

export const OVERDUE_HOUR = 18; // 6 PM
