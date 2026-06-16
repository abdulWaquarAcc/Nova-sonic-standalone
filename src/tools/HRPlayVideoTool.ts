/**
 * HRPlayVideoTool - Plays HR Buddy video content
 */
import { Tool } from './Tool';

interface HRPlayVideoParams {
    action?: string;
}

function parseParams(params: unknown): HRPlayVideoParams {
    const content = params as HRPlayVideoParams;
    return {
        action: content.action || 'play_video'
    };
}

export const HRPlayVideoTool: Tool = {
    name: 'HRPlayVideo',
    description: 'Play HR Buddy video content. Use this when the user asks to play a video, show the video, or watch the HR Buddy video.',

    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['play_video'],
                description: 'The video action to perform. Currently supports playing the HR Buddy video.'
            }
        },
        required: []
    },

    async execute(params: unknown): Promise<object> {
        const parsed = parseParams(params);

        if (parsed.action === 'play_video') {
            return {
                action: 'playVideo',
                url: '/audio/hr_buddy_video_1.mp4',
                label: 'HR Buddy Video',
                autoplay: true
            };
        }

        return {
            error: true,
            message: `Unknown video action: ${parsed.action}`
        };
    }
};
