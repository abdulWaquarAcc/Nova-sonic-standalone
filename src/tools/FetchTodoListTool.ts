/**
 * FetchTodoListTool - Fetches a todo item from JSONPlaceholder API
 */
import { Tool, ToolExecutionContext } from './Tool';

export const FetchTodoListTool: Tool = {
    name: 'fetchTodoList',
    description: 'Fetch a todo list item. Use this when the user asks to fetch a todo list or todo item.',

    inputSchema: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
                description: 'The todo item ID to fetch (default: 1)'
            }
        },
        required: []
    },

    async execute(params: unknown, context?: ToolExecutionContext): Promise<object> {
        const { id: paramId } = (params as { id?: number }) || {};
        
        // Use ID from UI input (customData) if available, otherwise use param or default to 1
        const todoId = (context?.customData?.todoId as number) || paramId || 1;

        console.log(`Fetching todo item #${todoId}`);

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Todo API returned ${response.status}`);
        }

        const todo = await response.json();

        return {
            userId: todo.userId,
            id: todo.id,
            title: todo.title,
            completed: todo.completed
        };
    }
};
