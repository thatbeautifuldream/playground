"use client";

import { useEffect, useRef } from "react";
import type { LogEntry } from "@/stores/repl-store";
import { transpileTypeScript } from "@/lib/transpile-ts";

export function useSandbox(onMessage: (entry: LogEntry) => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "repl") return;
      if (data.type === "log") {
        const payload = (data.payload as string[]) ?? [];
        onMessage({ type: "log", message: payload.join(" ") });
      } else if (data.type === "error") {
        onMessage({ type: "error", message: String(data.payload) });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onMessage]);

  const run = (code: string) => {
    if (iframeRef.current && containerRef.current) {
      try {
        containerRef.current.removeChild(iframeRef.current);
      } catch {}
      iframeRef.current = null;
    }

    const result = transpileTypeScript(code);

    if (!result.success && result.errors.length > 0) {
      for (const error of result.errors) {
        onMessage({ type: "error", message: `[TS Compilation] ${error}` });
      }
    }

    const executableCode = result.code || code;

    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    const html = `
<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        function safeStringify(value) {
          try {
            if (typeof value === 'string') return value
            return JSON.stringify(value, (k, v) => {
              if (v instanceof Error) return v.message
              return v
            })
          } catch (e) {
            try { return String(value) } catch { return '[Unserializable]' }
          }
        }

        const send = (type, payload) => parent.postMessage({ source: 'repl', type, payload }, '*')

        const original = { log: console.log, error: console.error, warn: console.warn, info: console.info, table: console.table, debug: console.debug }

        console.log = (...args) => {
          try { send('log', args.map(safeStringify)) } catch {}
          try { original.log.apply(console, args) } catch {}
        }
        console.info = (...args) => {
          try { send('log', args.map(safeStringify)) } catch {}
          try { original.info.apply(console, args) } catch {}
        }
        console.warn = (...args) => {
          try { send('log', args.map(safeStringify)) } catch {}
          try { original.warn.apply(console, args) } catch {}
        }
        console.debug = (...args) => {
          try { send('log', args.map(safeStringify)) } catch {}
          try { original.debug && original.debug.apply(console, args) } catch {}
        }
        console.table = (data, columns) => {
          try {
            const parts = [safeStringify(data)]
            if (columns) parts.push('columns: ' + safeStringify(columns))
            send('log', parts)
          } catch (e) {
            send('log', ['[table]', '[unserializable]'])
          }
          try { original.table && original.table.call(console, data, columns) } catch {}
        }
        console.error = (...args) => {
          try { send('error', args.map(safeStringify).join(' ')) } catch {}
          try { original.error.apply(console, args) } catch {}
        }

        window.onerror = function (message, source, lineno, colno, error) {
          const details = (error && (error.stack || error.message)) || String(message)
          send('error', details + ' at ' + lineno + ':' + colno)
        }
        window.addEventListener('unhandledrejection', function (e) {
          const r = e.reason
          send('error', (r && (r.stack || r.message)) || String(r))
        })

        ;(async function run() {
          try {
            ${executableCode}
          } catch (err) {
            send('error', (err && (err.stack || err.message)) || String(err))
          }
        })()
      })()
    </script>
  </body>
</html>
`.trim();

    iframe.srcdoc = html;
    containerRef.current?.appendChild(iframe);
    iframeRef.current = iframe;
  };

  return { containerRef, run };
}
