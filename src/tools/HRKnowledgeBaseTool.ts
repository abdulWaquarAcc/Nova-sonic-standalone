/**
 * HRKnowledgeBaseTool - Search HR knowledge base for employee queries
 * Covers: Payroll, New Joiner, Leave Policy, Grievance
 */
import * as fs from 'fs';
import * as path from 'path';
import { Tool } from './Tool';

type HRCategory = 'payroll' | 'new-joiner' | 'leave-policy' | 'grievance';

interface HRKBEntry {
    id: string;
    title: string;
    content: string;
    category: HRCategory;
    tags: string[];
    source: string;
    lastUpdated: string;
    metadata?: Record<string, any>;
}

interface HRKBIndex {
    entries: HRKBEntry[];
    categories: HRCategory[];
    lastUpdated: string;
    version: string;
}

interface HRKBParams {
    query: string;
    category?: HRCategory;
    limit?: number;
}

const HR_KB_CONFIG = {
    indexFile: './customer-preset/kb/hr-buddy/index.json',
    search: {
        maxResults: 5,
        minScore: 0.1,
        contentLimit: 2000
    },
    categories: {
        'payroll': 'Salary, payslips, deductions, tax, Form 16',
        'new-joiner': 'Onboarding, probation, documents, induction',
        'leave-policy': 'Leave types, entitlement, encashment, carry forward',
        'grievance': 'Workplace complaints, escalation, confidentiality'
    },
    searchWeights: {
        title: 3.0,
        content: 1.0,
        tags: 2.0,
        category: 1.5
    }
};

function parseParams(params: unknown): HRKBParams {
    const content = params as HRKBParams;
    return {
        query: content.query || '',
        category: content.category,
        limit: content.limit || 3
    };
}

function calculateScore(entry: HRKBEntry, searchTerms: string[]): number {
    let score = 0;
    const weights = HR_KB_CONFIG.searchWeights;

    for (const term of searchTerms) {
        if (entry.title.toLowerCase().includes(term)) {
            score += weights.title;
        }
        const contentMatches = (entry.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        score += contentMatches * weights.content;
        for (const tag of entry.tags) {
            if (tag.toLowerCase().includes(term)) {
                score += weights.tags;
            }
        }
        if (entry.category.toLowerCase().includes(term)) {
            score += weights.category;
        }
    }

    const contentLength = entry.content.length;
    return contentLength > 0 ? score / Math.log(contentLength + 1) : score;
}

function getMatchedFields(entry: HRKBEntry, searchTerms: string[]): string[] {
    const matched: string[] = [];
    for (const term of searchTerms) {
        if (entry.title.toLowerCase().includes(term)) matched.push('title');
        if (entry.content.toLowerCase().includes(term)) matched.push('content');
        if (entry.tags.some(tag => tag.toLowerCase().includes(term))) matched.push('tags');
        if (entry.category.toLowerCase().includes(term)) matched.push('category');
    }
    return [...new Set(matched)];
}

let cachedKB: HRKBIndex | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

function loadKnowledgeBase(): HRKBIndex {
    const now = Date.now();
    if (cachedKB && (now - cacheTime) < CACHE_DURATION) {
        return cachedKB;
    }
    try {
        const indexPath = path.resolve(HR_KB_CONFIG.indexFile);
        if (!fs.existsSync(indexPath)) {
            console.warn('HR Knowledge Base index not found at:', indexPath);
            return { entries: [], categories: [], lastUpdated: '', version: '1.0.0' };
        }
        const data = fs.readFileSync(indexPath, 'utf-8');
        cachedKB = JSON.parse(data);
        cacheTime = now;
        console.log(`Loaded HR Knowledge Base with ${cachedKB!.entries.length} entries`);
        return cachedKB!;
    } catch (error) {
        console.error('Error loading HR Knowledge Base:', error);
        return { entries: [], categories: [], lastUpdated: '', version: '1.0.0' };
    }
}

export const HRKnowledgeBaseTool: Tool = {
    name: 'HRKnowledgeBase',
    description: `Search the HR Knowledge Base for employee-related information. Use this when users ask about HR topics such as payroll, salary, new joiner onboarding, leave policies, or grievance processes. Categories: ${Object.keys(HR_KB_CONFIG.categories).join(', ')}.`,

    inputSchema: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'Search query for the HR knowledge base. Use keywords related to the employee question.'
            },
            category: {
                type: 'string',
                enum: Object.keys(HR_KB_CONFIG.categories),
                description: 'Optional HR category to narrow down the search.'
            },
            limit: {
                type: 'number',
                minimum: 1,
                maximum: 10,
                description: 'Maximum number of results to return (default: 3, max: 10)'
            }
        },
        required: ['query']
    },

    async execute(params: unknown): Promise<object> {
        const parsed = parseParams(params);

        if (!parsed.query || !parsed.query.trim()) {
            return { error: true, message: 'Search query is required' };
        }

        try {
            const kb = loadKnowledgeBase();
            const searchTerms = parsed.query.toLowerCase().split(/\s+/);
            const results: Array<{ entry: HRKBEntry; score: number; matchedFields: string[] }> = [];

            for (const entry of kb.entries) {
                if (parsed.category && entry.category !== parsed.category) continue;

                const score = calculateScore(entry, searchTerms);
                if (score >= HR_KB_CONFIG.search.minScore) {
                    results.push({
                        entry,
                        score,
                        matchedFields: getMatchedFields(entry, searchTerms)
                    });
                }
            }

            results.sort((a, b) => b.score - a.score);
            const limited = results.slice(0, Math.min(parsed.limit || 3, 10));

            if (limited.length === 0) {
                return {
                    query: parsed.query,
                    category: parsed.category,
                    results: [],
                    message: 'No relevant HR information found for this query.'
                };
            }

            const formattedResults = limited.map(r => ({
                id: r.entry.id,
                title: r.entry.title,
                content: r.entry.content.length > HR_KB_CONFIG.search.contentLimit
                    ? r.entry.content.substring(0, HR_KB_CONFIG.search.contentLimit) + '...'
                    : r.entry.content,
                category: r.entry.category,
                tags: r.entry.tags,
                relevanceScore: Math.round(r.score * 100) / 100,
                matchedFields: r.matchedFields
            }));

            console.log(`HR KB search: "${parsed.query}" returned ${formattedResults.length} results`);

            return {
                query: parsed.query,
                category: parsed.category,
                totalResults: formattedResults.length,
                results: formattedResults
            };
        } catch (error) {
            console.error('Error searching HR Knowledge Base:', error);
            return {
                error: true,
                message: 'An error occurred while searching the HR knowledge base',
                query: parsed.query,
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
};
