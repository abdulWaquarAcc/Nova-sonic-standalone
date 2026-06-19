/**
 * Tool exports and default registry setup
 */
export type { Tool, ToolSpec } from './Tool';
export { ToolRegistry } from './Tool';
export { DateTimeTool } from './DateTimeTool';
export { WeatherTool } from './WeatherTool';
export { LocationSearchTool } from './LocationSearchTool';
export { ReasoningTool } from './ReasoningTool';
export { WikipediaTool } from './WikipediaTool';
export { TranscriptCorrectionTool } from './TranscriptCorrectionTool';
// export { KnowledgeBaseTool } from './KnowledgeBaseTool';
export { BedrockKnowledgeBaseTool } from './BedrockKnowledgeBaseTool';
export { TranslationTool } from './TranslationTool';
// export { HRKnowledgeBaseTool } from './HRKnowledgeBaseTool';
export { HRPlayAudioTool } from './HRPlayAudioTool';
export { HRPlayVideoTool } from './HRPlayVideoTool';
export { FetchTodoListTool } from './FetchTodoListTool';

import { ToolRegistry } from './Tool';
import { DateTimeTool } from './DateTimeTool';
import { WeatherTool } from './WeatherTool';
import { LocationSearchTool } from './LocationSearchTool';
import { ReasoningTool } from './ReasoningTool';
import { WikipediaTool } from './WikipediaTool';
import { TranscriptCorrectionTool } from './TranscriptCorrectionTool';
// import { KnowledgeBaseTool } from './KnowledgeBaseTool';
import { BedrockKnowledgeBaseTool } from './BedrockKnowledgeBaseTool';
import { TranslationTool } from './TranslationTool';
// import { HRKnowledgeBaseTool } from './HRKnowledgeBaseTool';
import { HRPlayAudioTool } from './HRPlayAudioTool';
import { HRPlayVideoTool } from './HRPlayVideoTool';
import { FetchTodoListTool } from './FetchTodoListTool';

/**
 * Creates a ToolRegistry with all default tools registered
 */
export function createDefaultToolRegistry(): ToolRegistry {
  const registry = new ToolRegistry();
  registry.register(DateTimeTool);
  registry.register(WeatherTool);
  registry.register(LocationSearchTool);
  registry.register(ReasoningTool);
  registry.register(WikipediaTool);
  registry.register(TranscriptCorrectionTool);
  // registry.register(KnowledgeBaseTool);
  registry.register(BedrockKnowledgeBaseTool);
  registry.register(TranslationTool);
  // registry.register(HRKnowledgeBaseTool);
  registry.register(HRPlayAudioTool);
  registry.register(HRPlayVideoTool);
  registry.register(FetchTodoListTool);
  return registry;
}
