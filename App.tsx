
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskList } from './components/TaskList';
import { useTaskManager } from './hooks/useTaskManager';
import { getAIRecommendations } from './services/geminiService';
import { AIRecommendation } from './types';
import { EDITORS } from './constants';

const App: React.FC = () => {
  const { tasks, addTask, updateTask, markAsDone, toggleUrgent, currentDate, setDate } = useTaskManager();
  const [aiRecs, setAiRecs] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGetAIRecommendations = useCallback(async () => {
    setIsLoadingAI(true);
    setAiError(null);
    setAiRecs(null);
    try {
      const recs = await getAIRecommendations(tasks, EDITORS);
      setAiRecs(recs);
    } catch (error) {
      if (error instanceof Error) {
        setAiError(error.message);
      } else {
        setAiError("An unknown error occurred.");
      }
    } finally {
      setIsLoadingAI(false);
    }
  }, [tasks]);

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <AddTaskForm onAddTask={addTask} />
        
        <div className="bg-brand-surface p-6 rounded-lg shadow-xl mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold text-brand-text">Daily Tasks</h2>
                <div className="flex items-center gap-4">
                    <input 
                        type="date" 
                        value={currentDate} 
                        onChange={e => setDate(e.target.value)}
                        className="bg-brand-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary [color-scheme:dark]"
                    />
                     <button 
                        onClick={handleGetAIRecommendations}
                        disabled={isLoadingAI}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-all flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                       {isLoadingAI ? 'Analyzing...' : 'Get AI Insight'}
                    </button>
                </div>
            </div>

            {aiError && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-4">{aiError}</div>}
            
            {aiRecs && (
                 <div className="bg-brand-primary/50 border border-purple-500 p-4 rounded-lg mb-6 space-y-4">
                    <h3 className="text-lg font-semibold text-purple-300">✨ AI Recommendations</h3>
                    <div>
                        <h4 className="font-bold">Task Prioritization:</h4>
                        <p className="text-sm text-brand-text-secondary">{aiRecs.taskOrdering}</p>
                    </div>
                     <div>
                        <h4 className="font-bold">Bottleneck Alerts:</h4>
                        <p className="text-sm text-brand-text-secondary">{aiRecs.bottleneckAlerts}</p>
                    </div>
                     <div>
                        <h4 className="font-bold">Workload Balance:</h4>
                        <p className="text-sm text-brand-text-secondary">{aiRecs.workloadBalance}</p>
                    </div>
                 </div>
            )}
           
            <TaskList 
                tasks={tasks} 
                onUpdateTask={updateTask} 
                onMarkAsDone={markAsDone} 
                onToggleUrgent={toggleUrgent} 
            />
        </div>
      </main>
    </div>
  );
};

export default App;
