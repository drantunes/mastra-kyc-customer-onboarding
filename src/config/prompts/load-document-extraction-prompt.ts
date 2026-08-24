import { documentExtractionPromptV1 } from './document-extraction-v1.js';

export const loadDocumentExtractionPrompt = (version = '1.0.0') => {
  if (version !== documentExtractionPromptV1.version) {
    throw new Error(`Unknown document extraction prompt version: ${version}`);
  }
  return documentExtractionPromptV1;
};
