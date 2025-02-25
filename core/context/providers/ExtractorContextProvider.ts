import fs from "fs";

import { extractContext } from "@jpoly1219/context-extractor";
import { Language } from "@jpoly1219/context-extractor/dist/src/types";


import { BaseContextProvider } from "../index.js";

import type {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
} from "../../";


export class ExtractorContextProvider extends BaseContextProvider {

  static description: ContextProviderDescription = {
    title: "extractor",
    displayTitle: "Extract",
    description: "Provides context extracted from code using language server",
    type: "normal",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    const currentFile = await extras.ide.getCurrentFile();
    if (!currentFile?.contents) {
      return [];
    }

    try {
      const normalizedPath = "/" + currentFile.path.replace(/^file:\/\/\//, "");
      const fileExtension = normalizedPath.split(".").pop()?.toLowerCase() || "";

      console.log("File exists:", fs.existsSync(normalizedPath));
      console.log("File contents:", currentFile.contents?.length);
      console.log("Normalized path:", normalizedPath);

      let currentLanguage: Language;

      if (fileExtension === "js" || fileExtension === "ts" || fileExtension === "jsx" || fileExtension === "tsx") {
        currentLanguage = Language.TypeScript;
      } else if (fileExtension === "ml" || fileExtension === "mli") {
        currentLanguage = Language.OCaml;
      } else {
        return [];
      }

      const workspaceDirs = await extras.ide.getWorkspaceDirs();
      const normalizedWorkspacePath = workspaceDirs[0] ? ("/" + workspaceDirs[0].replace(/^file:\/\/\//, "")) : "";

      console.log("Workspace path:", normalizedWorkspacePath);

      const result = await extractContext(
        currentLanguage,
        normalizedPath,
        normalizedWorkspacePath
      );

      const contextItems: ContextItem[] = [];

      console.log("Extractor Result:", {
        holeTypes: result?.holeType,
        relevantTypes: result?.relevantTypes,
        relevantHeaders: result?.relevantHeaders
      });

      // Add hole types
      if (result?.holeType) {
        contextItems.push({
          name: "Hole Types",
          description: "Types found in the code holes",
          content: result.holeType
        });
      }

      // Add relevant types
      if (result?.relevantTypes) {
        contextItems.push({
          name: "Relevant Types",
          description: "Related type definitions",
          content: Array.from(result.relevantTypes.values()).flat().join("\n")
        });
      }

      // Add relevant headers
      if (result?.relevantHeaders) {
        contextItems.push({
          name: "Relevant Headers",
          description: "Related header information",
          content: Array.from(result.relevantHeaders.values()).flat().join("\n")
        });
      }

      // print context items for testing
      console.log("Final Context Items:", JSON.stringify(contextItems, null, 2));

      return contextItems;
    } catch (error) {
      console.error("Error extracting context:", error);
      return [];
    }
  }
}

export default ExtractorContextProvider;