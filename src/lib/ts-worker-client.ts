export function createWorker(): Worker {
  return new Worker(new URL("./ts-worker.ts", import.meta.url), {
    type: "module",
  });
}
