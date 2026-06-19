/**
 * Knowledge Base Configuration
 */

export const KnowledgeBaseConfig = {
    // File paths
    dataPath: './customer-preset/kb/hr-buddy',
    indexFile: './customer-preset/kb/hr-buddy/index.json',
    
    // Search settings
    search: {
        maxResults: 5,
        minScore: 0.1,
        contentLimit: 2000, // Max characters for voice response
        enableFuzzySearch: true,
        caseSensitive: false
    },
    
    // Categories and their descriptions
    categories: {
        'payroll': 'Salary, payslips, deductions, tax declarations, Form 16',
        'new-joiner': 'Onboarding documents, probation, employee ID, orientation, health insurance',
        'leave-policy': 'Leave entitlement, sick leave, carry forward, leave types, encashment',
        'company-info': 'About Certis, key highlights, leadership, community commitment',
        'company-vision': 'Innovation strategy, CEO and Chairman messages',
        'innovation': 'AI, robotics, ops-tech, and security innovation at Certis'
    },
    
    // Search weights for different fields
    searchWeights: {
        title: 3.0,
        content: 1.0,
        tags: 2.0,
        category: 1.5
    }
};