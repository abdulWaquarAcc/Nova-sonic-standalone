/**
 * HRPlayAudioTool - Plays HR Buddy theme music or audio clips
 */
import { Tool } from './Tool';

interface HRPlayAudioParams {
    action?: string;
}

function parseParams(params: unknown): HRPlayAudioParams {
    const content = params as HRPlayAudioParams;
    return {
        action: content.action || 'play_theme'
    };
}

export const HRPlayAudioTool: Tool = {
    name: 'HRPlayAudio',
    description: 'Play HR Buddy theme music or audio clips. Use this when the user asks to play music, play the theme, or hear the HR Buddy audio.',

    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['play_theme'],
                description: 'The audio action to perform. Currently supports playing the theme music.'
            }
        },
        required: []
    },

    async execute(params: unknown): Promise<object> {
        const parsed = parseParams(params);

        if (parsed.action === 'play_theme') {
            return {
                action: 'playAudio',
                url: '/audio/hr_buddy_audio_1.mp3',
                label: 'HR Buddy Theme Music',
                autoplay: true
            };
        }

        return {
            error: true,
            message: `Unknown audio action: ${parsed.action}`
        };
    }
};
