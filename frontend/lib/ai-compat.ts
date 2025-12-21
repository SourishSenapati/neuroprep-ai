// AI SDK streamText v3+ compatibility
import { streamText as baseStreamText, LanguageModelV1 } from 'ai';

// Wrapper to add missing properties for compatibility
export function streamText(params: any) {
  const model = params.model as LanguageModelV1;
  
  // Add missing defaultObjectGenerationMode if not present  
  const compatModel = {
    ...model,
    defaultObjectGenerationMode: model.defaultObjectGenerationMode ?? 'json' as const,
  };
  
  return baseStreamText({
    ...params,
    model: compatModel,
  });
}
