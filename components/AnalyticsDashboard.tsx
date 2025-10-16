
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Task, Status } from '../types';
import { EDITORS, VIDEO_TYPES } from '../constants';

interface AnalyticsDashboardProps {
    tasks: Task[];
}

const COLORS = ['#0f3460', '#e94560', '#16213e', '#533483', '#346751'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
    const completedTasks = useMemo(() => tasks.filter(t => t.status === Status.Done), [tasks]);
    
    const totalVideosCompleted = completedTasks.length;
    
    const averageCompletionTime = useMemo(() => {
        if (completedTasks.length === 0) return 0;
        const totalTime = completedTasks.reduce((acc, task) => {
            if (task.completionTimestamp) {
                const startTime = new Date(task.createdAt).getTime();
                const endTime = new Date(task.completionTimestamp).getTime();
                return acc + (endTime - startTime);
            }
            return acc;
        }, 0);
        const avgMilliseconds = totalTime / completedTasks.length;
        return (avgMilliseconds / (1000 * 60 * 60)).toFixed(2); // in hours
    }, [completedTasks]);
    
    const editorProductivity = useMemo(() => {
        const productivityMap = new Map<string, number>();
        EDITORS.forEach(e => productivityMap.set(e.name, 0));
        completedTasks.forEach(task => {
            const editor = EDITORS.find(e => e.id === task.editorId);
            if (editor) {
                productivityMap.set(editor.name, (productivityMap.get(editor.name) || 0) + 1);
            }
        });
        return Array.from(productivityMap.entries()).map(([name, count]) => ({ name, count }));
    }, [completedTasks]);

    const videoTypeDistribution = useMemo(() => {
        const typeMap = new Map<string, number>();
        VIDEO_TYPES.forEach(vt => typeMap.set(vt, 0));
        completedTasks.forEach(task => {
            typeMap.set(task.videoType, (typeMap.get(task.videoType) || 0) + 1);
        });
        return Array.from(typeMap.entries()).map(([name, count]) => ({ name, count }));
    }, [completedTasks]);
    
    const urgentTasksHandled = useMemo(() => tasks.filter(t => t.isUrgent).length, [tasks]);

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-xl mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-brand-secondary">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center">
                <div className="bg-brand-primary p-4 rounded-lg">
                    <p className="text-3xl font-bold text-brand-text">{totalVideosCompleted}</p>
                    <p className="text-brand-text-secondary">Videos Completed</p>
                </div>
                <div className="bg-brand-primary p-4 rounded-lg">
                    <p className="text-3xl font-bold text-brand-text">{averageCompletionTime}</p>
                    <p className="text-brand-text-secondary">Avg. Completion (Hours)</p>
                </div>
                <div className="bg-brand-primary p-4 rounded-lg">
                    <p className="text-3xl font-bold text-brand-text">{urgentTasksHandled}</p>
                    <p className="text-brand-text-secondary">Urgent Tasks Handled</p>
                </div>
                 <div className="bg-brand-primary p-4 rounded-lg">
                    <p className="text-3xl font-bold text-brand-text">{tasks.length - totalVideosCompleted}</p>
                    <p className="text-brand-text-secondary">Pending Tasks</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold mb-4 text-brand-text">Editor Productivity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={editorProductivity}>
                            <XAxis dataKey="name" stroke="#a9a9a9" fontSize={12} />
                            <YAxis stroke="#a9a9a9" />
                            <Tooltip contentStyle={{ backgroundColor: '#16213e', border: '1px solid #e94560' }} />
                            <Legend />
                            <Bar dataKey="count" name="Tasks Completed" fill="#e94560" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 text-brand-text">Video Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={videoTypeDistribution}>
                            <XAxis dataKey="name" stroke="#a9a9a9" fontSize={12} />
                            <YAxis stroke="#a9a9a9" />
                            <Tooltip contentStyle={{ backgroundColor: '#16213e', border: '1px solid #0f3460' }}/>
                            <Legend />
                            <Bar dataKey="count" name="Videos by Type">
                                {videoTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
