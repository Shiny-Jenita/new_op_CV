import { useEffect, useState, useCallback } from "react";

const useFetchHtml = (filePath: string) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHtmlFile = useCallback(async () => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("Failed to load file");

      const html = await response.text();
      setHtmlContent(html || "Welcome");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching HTML file:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    fetchHtmlFile();
  }, [fetchHtmlFile]);

  return { htmlContent, isLoading, error };
};

export default useFetchHtml;
