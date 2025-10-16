
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Task, Status, Priority, ApprovalStatus } from '../types';
import { OVERDUE_HOUR } from '../constants';

const getInitialTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem('videoTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Failed to parse tasks from localStorage", error);
    return [];
  }
};

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [overdueTrigger, setOverdueTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('videoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const checkOverdueTasks = useCallback(() => {
    const now = new Date();
    if (now.getHours() >= OVERDUE_HOUR) {
        const anyChanged = tasks.some(task => {
            const taskDate = new Date(task.createdAt);
            const isToday = taskDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            return isToday && task.status === Status.Pending;
        });
        if (anyChanged) {
            // Trigger re-render if overdue status might change
            setOverdueTrigger(prev => prev + 1);
        }
    }
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkOverdueTasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'isUrgent' | 'progress' | 'approvalStatus' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: Status.Pending,
      isUrgent: false,
      progress: 0,
      approvalStatus: ApprovalStatus.Pending,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };
  
  const markAsDone = (taskId: string) => {
    updateTask(taskId, {
        status: Status.Done,
        completionTimestamp: new Date().toISOString(),
        progress: 100,
    });
  };

  const toggleUrgent = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if(task) {
        updateTask(taskId, { isUrgent: !task.isUrgent });
    }
  };
  
  const filteredAndSortedTasks = useMemo(() => {
    const isOverdue = new Date().getHours() >= OVERDUE_HOUR;
    const priorityOrder: Record<Priority, number> = {
      [Priority.Urgent]: 4,
      [Priority.High]: 3,
      [Priority.Medium]: 2,
      [Priority.Low]: 1,
    };
    
    return tasks
      .filter(task => {
          const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
          return taskDate === date;
      })
      .sort((a, b) => {
        if (a.status === Status.Done && b.status !== Status.Done) return 1;
        if (a.status !== Status.Done && b.status === Status.Done) return -1;

        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        
        const aIsOverdue = isOverdue && a.status === Status.Pending;
        const bIsOverdue = isOverdue && b.status === Status.Pending;

        if (aIsOverdue && !bIsOverdue) return -1;
        if (!aIsOverdue && bIsOverdue) return 1;

        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  }, [tasks, date, overdueTrigger]);

  return {
    tasks: filteredAndSortedTasks,
    addTask,
    updateTask,
    markAsDone,
    toggleUrgent,
    currentDate: date,
    setDate,
  };
};
