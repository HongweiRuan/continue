import { completeWithLLM, extractContext } from "@jpoly1219/context-extractor";
import { Language } from "@jpoly1219/context-extractor/dist/src/types";

import { IDE } from "../index";
import { DEFAULT_AUTOCOMPLETE_OPTS } from "../util/parameters";

import { languageForFilepath } from "./constants/AutocompleteLanguageInfo";
import { HelperVars } from "./util/HelperVars";
import { AutocompleteInput, AutocompleteOutcome } from "./util/types";

export class ContextExtractorCompletionProvider {
  constructor(
    private readonly ide: IDE,
  ) { }

  public async provideInlineCompletionItems(
    input: AutocompleteInput,
  ): Promise<AutocompleteOutcome | undefined> {
    try {
      const language = this.mapLanguage(input.filepath);
      if (!language) {
        return undefined;
      }

      // use HelperVars to process prefix/suffix
      const helper = await HelperVars.create(
        input,
        DEFAULT_AUTOCOMPLETE_OPTS,  // use default config
        "context-extractor",
        this.ide
      );

      // 1. get context
      const workspaceDirs = await this.ide.getWorkspaceDirs();
      const ctx = await extractContext(
        language,
        input.filepath,
        workspaceDirs[0] || ""
      );

      if (!ctx) {
        return undefined;
      }

      // 2. use context to complete
      const completion = await completeWithLLM(
        ctx,
        language,
        input.filepath,
        await this.getConfigPath()
      );

      if (!completion) {
        return undefined;
      }

      return {
        completion,
        time: Date.now(),
        prefix: helper.prunedPrefix,    // use HelperVars processed prefix
        suffix: helper.prunedSuffix,    // use HelperVars processed suffix
        prompt: "",
        modelProvider: "context-extractor",
        modelName: "context-extractor",
        completionOptions: {},
        filepath: input.filepath,
        completionId: input.completionId,
        gitRepo: await this.ide.getRepoName(input.filepath),
        uniqueId: await this.ide.getUniqueId(),
        timestamp: Date.now(),
        cacheHit: false,
        ...DEFAULT_AUTOCOMPLETE_OPTS  // add all default options
      };

    } catch (e) {
      return undefined;
    }
  }

  private mapLanguage(filepath: string): Language | undefined {
    const lang = languageForFilepath(filepath);

    switch (lang.name) {
      case "typescript":
      case "tsx":
        return Language.TypeScript;
      case "ocaml":
        return Language.OCaml;
      default:
        return undefined;
    }
  }

  private async getConfigPath(): Promise<string> {
    const workspaceDirs = await this.ide.getWorkspaceDirs();
    return `${workspaceDirs[0]}/config.json`;  // use first workspace directory
  }
} 