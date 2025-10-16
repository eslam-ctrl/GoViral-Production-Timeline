
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Editor, AIRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getAIRecommendations = async (tasks: Task[], editors: Editor[]): Promise<AIRecommendation> => {
    const prompt = `
        As an expert project manager for a busy video production agency, analyze the following task list and editor assignments.
        Provide actionable recommendations to optimize the workflow.
        
        Current Editors:
        ${editors.map(e => `- ${e.name} (ID: ${e.id})`).join('\n')}

        Current Tasks:
        ${tasks.map(t => `- "${t.title}" (Priority: ${t.priority}, Urgent: ${t.isUrgent}, Deadline: ${t.deadline}, Assigned to: ${editors.find(e => e.id === t.editorId)?.name || 'Unassigned'}, Progress: ${t.progress}%)`).join('\n')}

        Based on this data, provide:
        1.  Task Ordering: A brief suggestion on the top 3-5 tasks that should be tackled immediately, considering urgency, priority, and deadlines.
        2.  Bottleneck Alerts: Identify any editors who are overloaded or tasks that are at high risk of delay. Mention specific tasks or editors.
        3.  Workload Balance: Suggest any task re-assignments that could balance the workload more effectively and prevent burnout.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taskOrdering: { 
                            type: Type.STRING, 
                            description: "Suggestions for prioritizing the next tasks." 
                        },
                        bottleneckAlerts: { 
                            type: Type.STRING,
                            description: "Alerts about potential delays or overloaded editors."
                        },
                        workloadBalance: {
                            type: Type.STRING,
                            description: "Recommendations for re-assigning tasks to balance workload."
                        }
                    },
                    required: ["taskOrdering", "bottleneckAlerts", "workloadBalance"]
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIRecommendation;

    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        throw new Error("Failed to get recommendations from AI. Please check the API key and connection.");
    }
};
