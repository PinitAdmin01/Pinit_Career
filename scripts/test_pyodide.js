const { loadPyodide } = require('pyodide');

async function main() {
  const pyodide = await loadPyodide();
  pyodide.setStdout({ batched: (line) => console.log('OUT:', line) });
  pyodide.setStderr({ batched: (line) => console.error('ERR:', line) });
  
  await pyodide.runPythonAsync(`
import asyncio

async def test():
    return 'hello from pyodide'

res = await test()
print('Result from top-level await:', res)
`);
}

main().catch(console.error);
