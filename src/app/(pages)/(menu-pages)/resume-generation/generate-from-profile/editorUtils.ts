import { RefObject } from 'react';

export const aiMessages = [
  "Reading your profile...",
  "Extracting data...",
  "Formatting your resume...",
  "Almost there...",
];

export interface RectType {
  left: number;
  top: number;
  width: number;
  height: number;
}
// export const handleSelection = (
//   contentRef: RefObject<HTMLDivElement>,
//   setCustomSelectionRects: (rects: RectType[]) => void,
//   setSelectionPosition: (pos: { x: number; y: number } | null) => void,
//   setSelectedText: (text: string) => void
// ) => {
//   const selection = window.getSelection();

//   if (contentRef.current) {
//     const highlights = contentRef.current.querySelectorAll('.persistent-highlight');
//     highlights.forEach(highlight => {
//       const parent = highlight.parentNode;
//       if (parent) {
//         while (highlight.firstChild) {
//           parent.insertBefore(highlight.firstChild, highlight);
//         }
//         parent.removeChild(highlight);
//       }
//     });
//   }

//   if (!selection || selection.toString().trim() === "") {
//     setCustomSelectionRects([]);
//     setSelectionPosition(null);
//     setSelectedText("");
//     return;
//   }

//   const range = selection.getRangeAt(0);
//   const container = contentRef.current;
//   if (!container) return;
//   const sectionNode = range.commonAncestorContainer.closest
//     ? range.commonAncestorContainer.closest("section")
//     : range.commonAncestorContainer.parentElement?.closest("section");

//   if (!sectionNode) {
//     setCustomSelectionRects([]);
//     setSelectionPosition(null);
//     setSelectedText("");
//     return;
//   }

//   const heading = sectionNode.querySelector("h2");
//   const headingText = heading?.textContent?.trim().toUpperCase();

//   const targetNode = range.commonAncestorContainer;
//   const parentEl = targetNode.nodeType === 1 ? targetNode as Element : targetNode.parentElement;

//   const isSummaryParagraph =
//   (headingText === "SUMMARY" || headingText === "PROFESSIONAL SUMMARY"  || headingText === "PROFILE") &&
//   parentEl?.tagName === "P";
//   const isProjectDiv =
//   headingText === "PROJECTS" &&
//   (parentEl?.tagName === "LI" || parentEl?.tagName === "UL");
//   const isExperienceAllowed =
//   headingText === "EXPERIENCE" &&
//   (parentEl?.tagName === "LI" || parentEl?.tagName === "UL");

// const isEducationAllowed =
//   headingText === "EDUCATION" &&
//   (parentEl?.tagName === "LI" || parentEl?.tagName === "UL");
//   if (isSummaryParagraph || isProjectDiv || isExperienceAllowed || isEducationAllowed) {
//     const containerRect = container.getBoundingClientRect();
//     const rects = Array.from(range.getClientRects()).map((rect) => ({
//       left: rect.left - containerRect.left,
//       top: rect.top - containerRect.top,
//       width: rect.width,
//       height: rect.height,
//     }));
//     setCustomSelectionRects(rects);

//     if (rects.length > 0) {
//       const lastRect = rects[rects.length - 1];
//       setSelectionPosition({
//         x: lastRect.left + lastRect.width,
//         y: lastRect.top + lastRect.height,
//       });
//     }

//     setSelectedText(selection.toString());
//   } else {
//     setCustomSelectionRects([]);
//     setSelectionPosition(null);
//     setSelectedText("");
//   }
// };
export const handleSelection = (
  contentRef: RefObject<HTMLDivElement>,
  setCustomSelectionRects: (rects: RectType[]) => void,
  setSelectionPosition: (pos: { x: number; y: number } | null) => void,
  setSelectedText: (text: string) => void
) => {
  const selection = window.getSelection();

  if (contentRef.current) {
    const highlights = contentRef.current.querySelectorAll('.persistent-highlight');
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        while (highlight.firstChild) {
          parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
      }
    });
  }

  if (!selection || selection.toString().trim() === "") {
    setCustomSelectionRects([]);
    setSelectionPosition(null);
    setSelectedText("");
    return;
  }

  const range = selection.getRangeAt(0);
  const container = contentRef.current;
  if (!container) return;

  const targetNode = range.commonAncestorContainer;
  const parentEl = targetNode.nodeType === 1 ? targetNode as Element : targetNode.parentElement;

  const sectionNode = parentEl?.closest(".section");
  if (!sectionNode) {
    setCustomSelectionRects([]);
    setSelectionPosition(null);
    setSelectedText("");
    return;
  }

  const sectionClass = Array.from(sectionNode.classList).find(c =>
    ["summary-section", "experience-section", "education-section", "projects-section"].includes(c)
  );

  const isAllowed = (() => {
    switch (sectionClass) {
      case "summary-section":
        return parentEl?.classList.contains("summary-text");
      case "experience-section":
        return parentEl?.classList.contains("experience-description-item") ||
               parentEl?.closest("ul")?.classList.contains("experience-description-list");
      case "education-section":
        return parentEl?.classList.contains("education-description-item") ||
               parentEl?.closest("ul")?.classList.contains("education-description-list");
      case "projects-section":
        return parentEl?.classList.contains("project-description-item") ||
               parentEl?.closest("ul")?.classList.contains("project-description-list");
      default:
        return false;
    }
  })();

  if (isAllowed) {
    const containerRect = container.getBoundingClientRect();
    const rects = Array.from(range.getClientRects()).map((rect) => ({
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    }));
    setCustomSelectionRects(rects);

    if (rects.length > 0) {
      const lastRect = rects[rects.length - 1];
      setSelectionPosition({
        x: lastRect.left + lastRect.width,
        y: lastRect.top + lastRect.height,
      });
    }

    setSelectedText(selection.toString());
  } else {
    setCustomSelectionRects([]);
    setSelectionPosition(null);
    setSelectedText("");
  }
};

export const setupProgressAnimation = (setUploadProgress: (value: number) => void) => {
  const steps = [10, 55, 75, 95];
  let index = 0;
  const progressInterval = setInterval(() => {
    setUploadProgress(steps[index]);
    index++;
    if (index >= steps.length) {
      clearInterval(progressInterval);
    }
  }, 800);

  return () => clearInterval(progressInterval);
};

export const setupMessageAnimation = (setAiMessageIndex: (cb: (prev: number) => number) => void) => {
  const messageInterval = setInterval(() => {
    setAiMessageIndex((prev) => (prev + 1) % aiMessages.length);
  }, 2000);

  return () => clearInterval(messageInterval);
};

export const setupMutationObserver = (
  contentRef: RefObject<HTMLDivElement>,
  html: string,
  history: string[],
  historyIndex: number,
  mutationTimeout: NodeJS.Timeout | null,
  setMutationTimeout: (timeout: NodeJS.Timeout | null) => void,
  setHistory: (history: string[]) => void,
  setHistoryIndex: (index: number) => void,
  updateJsonFromHtml: () => void
) => {
  if (!contentRef.current) return () => {};

  const observer = new MutationObserver(() => {
    if (mutationTimeout) clearTimeout(mutationTimeout);
    const timeout = setTimeout(() => {
      updateJsonFromHtml();
      const currentHtml = contentRef.current?.innerHTML || "";
      if (currentHtml !== history[historyIndex]) {
        const newHistory = [...history.slice(0, historyIndex + 1), currentHtml];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 500);

    setMutationTimeout(timeout);
  });

  observer.observe(contentRef.current, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    observer.disconnect();
    if (mutationTimeout) clearTimeout(mutationTimeout);
  };
};

