/**
 * FetchTodoListTool - Fetches a todo item from JSONPlaceholder API
 */
import { Tool } from './Tool';

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

    async execute(params: unknown): Promise<object> {
        const { id = 1 } = (params as { id?: number }) || {};

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
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
