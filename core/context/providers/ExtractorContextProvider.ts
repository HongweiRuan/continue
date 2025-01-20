import type {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
  IContextProvider,
  LoadSubmenuItemsArgs,
} from "../../";

interface ContextExtractorResult {
  holeTypes: string[];
  relevantTypes: string[];
  relevantHeaders: string[];
}

interface ContextExtractor {
  extractContext(code: string, language: string): Promise<ContextExtractorResult>;
}

export class ExtractorContextProvider implements IContextProvider {
  constructor(private extractor: ContextExtractor) { }

  get description(): ContextProviderDescription {
    return {
      title: "Context Extractor",
      displayTitle: "Extracted Context",
      description: "Provides context extracted from code using language server",
      type: "normal",
    };
  }

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    // const currentFile = await extras.ide.getCurrentFile();
    // if (!currentFile?.contents) {
    //   return [];
    // }

    // try {
    //   const result = await this.extractor.extractContext(
    //     currentFile.contents,
    //     currentFile.path.split('.').pop() || '' // 从文件路径获取语言
    //   );

    //   const contextItems: ContextItem[] = [];

    //   // Add hole types
    //   if (result.holeTypes.length > 0) {
    //     contextItems.push({
    //       name: "Hole Types",
    //       description: "Types found in the code holes",
    //       content: result.holeTypes.join('\n')
    //     });
    //   }

    //   // Add relevant types
    //   if (result.relevantTypes.length > 0) {
    //     contextItems.push({
    //       name: "Relevant Types",
    //       description: "Related type definitions",
    //       content: result.relevantTypes.join('\n')
    //     });
    //   }

    //   // Add relevant headers
    //   if (result.relevantHeaders.length > 0) {
    //     contextItems.push({
    //       name: "Relevant Headers",
    //       description: "Related header information",
    //       content: result.relevantHeaders.join('\n')
    //     });
    //   }

    //   return contextItems;
    // } catch (error) {
    //   console.error("Error extracting context:", error);
    //   return [];
    // }
    return [
      {
        name: "Test Type 1",
        description: "A dummy type for testing",
        content: "interface TestType { id: number; name: string; }"
      },
      {
        name: "Test Type 2",
        description: "Another dummy type for testing",
        content: "type Status = 'active' | 'inactive' | 'pending';"
      },
      {
        name: "Test Header",
        description: "A dummy header for testing",
        content: "import { useState, useEffect } from 'react';"
      }
    ];
  }

  async loadSubmenuItems(args: LoadSubmenuItemsArgs) {
    return []; 
  }
}