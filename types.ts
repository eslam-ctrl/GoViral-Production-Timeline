
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export enum Status {
  Pending = 'Pending',
  Done = 'Done',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  NeedsRevision = 'Needs Revision',
}

export type VideoType = 'Promo' | 'Social Media' | 'Ad' | 'Tutorial' | 'Internal';

export interface Editor {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  editorId: string;
  deadline: string; // ISO string format
  fileLink?: string;
  notes?: string;
  videoType: VideoType;
  priority: Priority;
  status: Status;
  isUrgent: boolean;
  progress: number; // 0-100
  completionTimestamp?: string; // ISO string format
  approvalStatus: ApprovalStatus;
  createdAt: string; // ISO string format
}

export interface AIRecommendation {
    taskOrdering: string;
    bottleneckAlerts: string;
    workloadBalance: string;
}
