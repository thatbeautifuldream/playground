import ts from "typescript";

export interface TranspileResult {
  success: boolean;
  code: string;
  errors: string[];
}

export function transpileTypeScript(sourceCode: string): TranspileResult {
  try {
    const result = ts.transpileModule(sourceCode, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        skipLibCheck: true,
        noEmit: false,
      },
      reportDiagnostics: true,
    });

    const errors: string[] = [];
    if (result.diagnostics && result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );

        if (diagnostic.file && diagnostic.start !== undefined) {
          const { line, character } =
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          errors.push(`Line ${line + 1}:${character + 1} - ${message}`);
        } else {
          errors.push(message);
        }
      }
    }

    return {
      success: errors.length === 0,
      code: result.outputText,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      code: "",
      errors: [
        `Transpilation error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}
