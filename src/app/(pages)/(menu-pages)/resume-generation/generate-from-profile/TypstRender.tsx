"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface TypstViewerProps {
  content: string | Buffer;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  width?: number;
  height?: number;
}

interface Typst {
  setCompilerInitOptions: (options: { getModule: () => string }) => void;
  setRendererInitOptions: (options: { getModule: () => string }) => void;
  svg: (options: {
    mainContent?: string;
    artifact?: Uint8Array;
    format: "text" | "binary" | "base64";
  }) => Promise<string>;
}

declare global {
  interface Window {
    $typst?: Typst;
  }
}

export const TypstViewer = ({ 
  content, 
  onError, 
  onSuccess,
  width = 650, 
  height = 842 
}: TypstViewerProps) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const typstLoaded = useRef(false);
  const renderAttempts = useRef(0);
  const maxRetries = 3;
  const contentKey = useRef<string>("");

  const adjustSvgSize = useCallback(() => {
    if (!contentRef.current) return;
    
    requestAnimationFrame(() => {
      const svgElem = contentRef.current?.querySelector("svg");
      if (!svgElem) return;

      try {
        // Set dimensions
        svgElem.setAttribute("width", `${width}`);
        svgElem.setAttribute("height", `${height}`);
        svgElem.setAttribute("viewBox", `0 0 ${width} ${height}`);

        // Apply styles
        Object.assign(svgElem.style, {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 auto"
        });

        // Fix background
        svgElem.querySelectorAll("rect").forEach(rect => {
          if (rect.getAttribute("width") === `${width}`) {
            rect.setAttribute("fill", "#ffffff");
          }
        });

        // Scale text
        svgElem.querySelectorAll("text").forEach(text => {
          const fontSize = parseFloat(text.getAttribute("font-size") || "12");
          text.setAttribute("font-size", `${fontSize * 1.5}`);
        });
      } catch (error) {
        console.error("Error adjusting SVG:", error);
      }
    });
  }, [width, height]);

  const renderContent = useCallback(async (retryCount = 0) => {
    if (!typstLoaded.current || !window.$typst) return;
    
    // Generate a content key for comparison
    const newContentKey = typeof content === 'string' 
      ? content.substring(0, 100) 
      : content instanceof Buffer 
        ? content.slice(0, 100).toString('hex')
        : '';
    
    // Skip if same content is being rendered again
    if (contentKey.current === newContentKey && svgContent && retryCount === 0) {
      return;
    }
    
    contentKey.current = newContentKey;
    renderAttempts.current = retryCount;

    try {
      let typstContent: string | Uint8Array;
      let format: "text" | "binary" | "base64" = "text";

      if (content instanceof Buffer) {
        const isTextFile = content.slice(0, 100).toString().trim().startsWith("#");
        typstContent = isTextFile ? content.toString("utf-8") : new Uint8Array(content);
        format = isTextFile ? "text" : "binary";
      } else {
        typstContent = content;
      }

      const svg = await window.$typst.svg({ 
        mainContent: typeof typstContent === 'string' ? typstContent : undefined,
        artifact: typeof typstContent === 'string' ? undefined : typstContent,
        format 
      });

      if (!svg) {
        throw new Error("Empty SVG generated");
      }

      setSvgContent(svg);
      requestAnimationFrame(adjustSvgSize);
      renderAttempts.current = 0;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(`Render attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < maxRetries) {
        setTimeout(() => {
          renderContent(retryCount + 1);
        }, 200 * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        onError?.(error instanceof Error ? error : new Error("Failed to render Typst content"));
      }
    }
  }, [content, adjustSvgSize, onError, onSuccess, svgContent]);

  // Initialize Typst once
  useEffect(() => {
    const loadTypstScript = () => {
      if (typstLoaded.current) return;

      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js";
      script.id = "typst";
      
      script.onload = () => {
        if (!window.$typst) {
          onError?.(new Error("Typst library failed to load"));
          return;
        }

        window.$typst.setCompilerInitOptions({
          getModule: () => "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm",
        });

        window.$typst.setRendererInitOptions({
          getModule: () => "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm",
        });

        typstLoaded.current = true;
        renderContent();
      };

      document.head.appendChild(script);
    };

    if (!document.getElementById("typst")) {
      loadTypstScript();
    } else if (!typstLoaded.current) {
      typstLoaded.current = true;
      renderContent();
    }

    return () => {
      renderAttempts.current = 0;
    };
  }, [renderContent, onError]);

  // Re-render when content changes
  useEffect(() => {
    if (typstLoaded.current) {
      renderContent();
    }
  }, [content, renderContent]);

  return (
    <div className="flex-1 overflow-auto flex justify-center">
      {renderAttempts.current > 0 && svgContent && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <p className="text-gray-700">Rendering document...</p>
        </div>
      )}
      
      <div
        ref={contentRef}
        className="bg-white p-4 shadow-md w-full"
        style={{ maxWidth: width, position: "relative" }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      
      {!svgContent && (
        <div className="text-gray-500 p-4 text-center">
          <p>Rendering document...</p>
          {renderAttempts.current > 0 && (
            <p className="text-sm mt-2">
              Attempt {renderAttempts.current} of {maxRetries}...
            </p>
          )}
        </div>
      )}
    </div>
  );
};