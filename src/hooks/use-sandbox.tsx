"use client";

import { useCallback, useEffect, useRef } from "react";
import type { LogEntry } from "@/stores/repl-store";
import { transpileTypeScript } from "@/lib/transpile-ts";

const SANDBOX_HTML = `
<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        function safeStringify(value) {
          try {
            if (typeof value === 'string') return value
            if (value instanceof Error) return value.stack || value.message
            if (typeof value === 'function') return value.toString()
            return JSON.stringify(value, (k, v) => {
              if (v instanceof Error) return v.message
              if (typeof v === 'function') return '[Function]'
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

        window.addEventListener('message', function (event) {
          const data = event.data
          if (!data || data.target !== 'repl-exec') return
          ;(async function run() {
            try {
              await eval(data.code)
            } catch (err) {
              send('error', (err && (err.stack || err.message)) || String(err))
            }
          })()
        })

        send('ready', '')
      })()
    </script>
  </body>
</html>
`.trim();

export function useSandbox(onMessage: (entry: LogEntry) => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "repl") return;
      if (data.type === "ready") {
        readyRef.current = true;
        if (pendingRef.current != null) {
          const code = pendingRef.current;
          pendingRef.current = null;
          postExec(code);
        }
        return;
      }
      if (data.type === "log") {
        const payload = (data.payload as string[]) ?? [];
        onMessageRef.current({ type: "log", message: payload.join(" ") });
      } else if (data.type === "error") {
        onMessageRef.current({ type: "error", message: String(data.payload) });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const ensureIframe = useCallback(() => {
    if (iframeRef.current) return iframeRef.current;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.position = "absolute";
    iframe.srcdoc = SANDBOX_HTML;
    containerRef.current?.appendChild(iframe);
    iframeRef.current = iframe;
    readyRef.current = false;
    return iframe;
  }, []);

  const postExec = useCallback((code: string) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ target: "repl-exec", code }, "*");
  }, []);

  const run = useCallback(async (code: string) => {
    ensureIframe();

    const result = await transpileTypeScript(code);
    if (!result.success && result.errors.length > 0) {
      for (const error of result.errors) {
        onMessageRef.current({
          type: "error",
          message: `[TS Compilation] ${error}`,
        });
      }
      if (!result.code) return;
    }

    const executableCode = result.code || code;

    if (readyRef.current) {
      postExec(executableCode);
    } else {
      pendingRef.current = executableCode;
    }
  }, [ensureIframe, postExec]);

  return { containerRef, run };
}
