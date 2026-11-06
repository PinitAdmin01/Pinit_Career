import { NodeVM } from 'vm2'; // or standard vm
import vm from 'node:vm';
import ts from 'typescript';

// Let's test standard vm + ts
function compileAndRun(tsCode: string): string {
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;

  let captured = '';
  const context = {
    console: {
      log: (...args: any[]) => {
        captured += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
      },
      error: (...args: any[]) => {},
      warn: (...args: any[]) => {}
    },
    Date: Date,
    Math: Math,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  vm.createContext(context);
  vm.runInContext(jsCode, context);
  return captured.trim();
}
