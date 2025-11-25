
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/stores/resume/resumeStore";
import { useResumeSaveStore } from "@/stores/resume/resumeSaveStore";
import { ZoomIn, ZoomOut, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import DownloadDropdown from "@/components/resume-editor/download";
import { AIBuddy } from "@/components/resume-editor/aiBuddy";
import Templates from "@/components/resume-editor/editorTemplates";
import Image from "next/image";
import { EditorState } from "@/app/interfaces";
import { Toolbar } from "@/components/resume-editor/editorToolbar";
import { Card, CardContent } from "@/components/ui/card";
import { parseHtmlToJson } from "./resumeHtmlUtils";
import { v4 as uuidv4 } from 'uuid';
import { RectType, aiMessages, handleSelection as selectionHandler, setupProgressAnimation, setupMessageAnimation, setupMutationObserver } from "./editorUtils";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePreviousPath } from "@/previouspathcontext";
import { useJDStore } from "@/stores/resume/jdStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ShareLinkDialog from "@/components/resume-editor/ShareLinkDialog"
import { useRouter } from "next/navigation";

type ContentRefType = React.RefObject<HTMLDivElement>;

const GenerateFromProfilePage = () => {
  const { generateResumeFromProfile, resumeData, updateResumeJson } = useResumeStore((state) => state);
  const [html, setHtml] = useState<string>("");
  const [zoom, setZoom] = useState<number>(100);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [aiMessageIndex, setAiMessageIndex] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showAIBuddy, setShowAIBuddy] = useState<boolean>(false);
  const [aiBuddyPrompt, setAiBuddyPrompt] = useState<string | null>(null);
  const [customSelectionRects, setCustomSelectionRects] = useState<RectType[]>([]);
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [mutationTimeout, setMutationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [resumeName, setResumeName] = useState<string>(`Resume ${new Date().toLocaleDateString()}`);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [tempResumeName, setTempResumeName] = useState<string>(resumeName);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const saveResume = useResumeSaveStore((state) => state.saveResume);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("template_1");
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [originalTextMap, setOriginalTextMap] = useState<Map<string, string>>(new Map());
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const hasResumeId = Boolean(resumeId);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [isDragMode, setIsDragMode] = useState<boolean>(false);
  const [draggedSection, setDraggedSection] = useState<Element | null>(null);
  const [dragPlaceholder, setDragPlaceholder] = useState<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [localResumeId, setLocalResumeId] = useState<string | null>(resumeId);
  const [ResumeName, setResumename] = useState(useResumeStore.getState().resumeData.resumeName);
  const [aiHistory, setAiHistory] = useState<{
    id: string;
    original: string;
    enhanced: string;
  }[]>([]);
  const [showJDNotification, setShowJDNotification] = useState(false);
  const router = useRouter();
  const handleShare = async () => {
    const currentResumeId = resumeId || localResumeId;
    if (!currentResumeId) return;

    try {
      const res = await fetch(
        `https://dev-api.optimizedcv.ai/api/v1/resume/${currentResumeId}`
      );
      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Unknown API error");
      }

      // Build the public share link:
      const link = `https://stage.optimizedcv.ai/resume/${currentResumeId}`;

      // Instead of alert, store it and open our dialog:
      setShareLink(link);
      setIsShareDialogOpen(true);
    } catch (err: any) {
      console.error("Error generating share link:", err);
      toast.error("Failed to generate share link. Check console for details.");
    }
  };

  const updateJsonFromHtml = useCallback(() => {
    if (!contentRef.current || !resumeData.resumeJson) return;

    const updatedData = parseHtmlToJson(contentRef.current, resumeData.resumeJson);

    if (
      updatedData.profile.name &&
      JSON.stringify(updatedData) !== JSON.stringify(resumeData.resumeJson)
    ) {
      updateResumeJson(updatedData);
      console.log("Updated Resume JSON:", updatedData);
    }
  }, [resumeData.resumeJson, updateResumeJson]);

  const contentRef = useRef<HTMLDivElement>(null);
  const { previousPath, beforePreviousPath } = usePreviousPath();
  const { jobDetails } = useJDStore();
  const resetSectionStyles = useCallback((section: HTMLElement) => {
    const stylesToReset = [
      'opacity', 'transform', 'backgroundColor', 'borderColor',
      'boxShadow', 'transition', 'border', 'borderRadius'
    ];

    stylesToReset.forEach(style => {
      section.style.removeProperty(style.replace(/([A-Z])/g, '-$1').toLowerCase());
    });
    section.classList.remove('dragging', 'drag-hover');
    section.offsetHeight;
  }, []);

  const storeOriginalStyles = useCallback((section: HTMLElement) => {
    const computedStyles = window.getComputedStyle(section);
    const stylesToStore = [
      'position', 'margin', 'padding', 'border', 'borderRadius',
      'backgroundColor', 'boxShadow', 'transform', 'opacity'
    ];

    stylesToStore.forEach(property => {
      const kebabCase = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      const currentValue = section.style.getPropertyValue(kebabCase) || '';
      section.setAttribute(`data-original-${kebabCase}`, currentValue);
    });
  }, []);
  const restoreOriginalStyles = useCallback((section: HTMLElement) => {
    const stylesToRestore = [
      'position', 'margin', 'padding', 'border', 'border-radius',
      'background-color', 'box-shadow', 'transform', 'opacity'
    ];

    stylesToRestore.forEach(property => {
      const originalValue = section.getAttribute(`data-original-${property}`);
      if (originalValue !== null) {
        if (originalValue === '') {
          section.style.removeProperty(property);
        } else {
          section.style.setProperty(property, originalValue);
        }
        section.removeAttribute(`data-original-${property}`);
      }
    });

    section.offsetHeight;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.stopPropagation();
        console.log("Undo (Ctrl+Z/Cmd+Z) is disabled");
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [])
useEffect(() => {
  if (!contentRef.current) return;

 const sections = contentRef.current.querySelectorAll('.section');

  console.log("Found sections:", sections);
}, []);

  // const initializeDragAndDrop = useCallback(() => {
  //   if (!contentRef.current || !isDragMode) return;
  //   const sections = contentRef.current.querySelectorAll('section');

  //   sections.forEach((section, index) => {
  //     const sectionElement = section as HTMLElement;

  //     storeOriginalStyles(sectionElement);
  //     section.setAttribute('data-drag-section', `section-${index}`);
  //     section.setAttribute('draggable', 'true');

  //     if (!section.querySelector('.drag-handle')) {
  //       const dragHandle = document.createElement('div');
  //       dragHandle.className = 'drag-handle';
  //       dragHandle.innerHTML = '⋮⋮';
  //       dragHandle.style.cssText = `
  //       position: absolute;
  //       top: 8px;
  //       right: 8px;
  //       color: #0369a1;
  //       background: rgba(255, 255, 255, 0.95);
  //       border: 1px solid #0369a1;
  //       border-radius: 4px;
  //       padding: 4px 6px;
  //       font-size: 14px;
  //       cursor: grab;
  //       z-index: 20;
  //       opacity: 0.8;
  //       transition: all 0.2s ease;
  //       user-select: none;
  //       font-weight: bold;
  //       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  //       pointer-events: auto;
  //     `;
  //       sectionElement.style.position = sectionElement.style.position || 'relative';
  //       sectionElement.style.border = '2px dashed transparent';
  //       sectionElement.style.borderRadius = '6px';
  //       sectionElement.style.transition = 'all 0.2s ease';

  //       section.appendChild(dragHandle);

  //       const handleMouseEnter = () => {
  //         dragHandle.style.opacity = '1';
  //         dragHandle.style.transform = 'scale(1.05)';
  //         sectionElement.classList.add('drag-hover');
  //         sectionElement.style.backgroundColor = 'rgba(3, 105, 161, 0.03)';
  //         sectionElement.style.borderColor = '#0369a1';
  //         sectionElement.style.boxShadow = '0 2px 8px rgba(3, 105, 161, 0.1)';
  //       };

  //       const handleMouseLeave = () => {
  //         if (!section.classList.contains('dragging')) {
  //           dragHandle.style.opacity = '0.8';
  //           dragHandle.style.transform = 'scale(1)';
  //           sectionElement.classList.remove('drag-hover');
  //           sectionElement.style.backgroundColor = '';
  //           sectionElement.style.borderColor = 'transparent';
  //           sectionElement.style.boxShadow = '';
  //         }
  //       };

  //       section.addEventListener('mouseenter', handleMouseEnter);
  //       section.addEventListener('mouseleave', handleMouseLeave);

  //       section.setAttribute('data-has-listeners', 'true');
  //       dragHandle.addEventListener('mousedown', () => {
  //         dragHandle.style.cursor = 'grabbing';
  //       });

  //       dragHandle.addEventListener('mouseup', () => {
  //         dragHandle.style.cursor = 'grab';
  //       });
  //     }
  //   });
  // }, [isDragMode, storeOriginalStyles]);

  // const toggleDragMode = useCallback(() => {
  //   const newDragMode = !isDragMode;
  //   setIsDragMode(newDragMode);
  //   if (contentRef.current) {
  //     if (newDragMode) {
  //       contentRef.current.classList.add('drag-mode-active');
  //     } else {
  //       contentRef.current.classList.remove('drag-mode-active');
  //     }
  //   }

  //   if (!newDragMode && contentRef.current) {
  //     const sections = contentRef.current.querySelectorAll('section');
  //     sections.forEach(section => {
  //       const sectionElement = section as HTMLElement;
  //       const dragHandle = section.querySelector('.drag-handle');
  //       if (dragHandle) {
  //         dragHandle.remove();
  //       }
  //       if (section.hasAttribute('data-has-listeners')) {
  //         section.removeAttribute('data-has-listeners');
  //       }
  //       restoreOriginalStyles(sectionElement);
  //       section.removeAttribute('draggable');
  //       section.removeAttribute('data-drag-section');
  //       section.classList.remove('dragging', 'drag-hover');
  //       resetSectionStyles(sectionElement);
  //     });
  //     setDraggedSection(null);
  //     if (dragPlaceholder && dragPlaceholder.parentNode) {
  //       dragPlaceholder.parentNode.removeChild(dragPlaceholder);
  //     }
  //     setDragPlaceholder(null);
  //   }
  // }, [isDragMode, restoreOriginalStyles, resetSectionStyles, dragPlaceholder]);

  // const handleDragStart = useCallback((e: DragEvent) => {
  //   const target = e.target as HTMLElement;
  //   const section = target.closest('section');

  //   if (section && section.hasAttribute('data-drag-section')) {
  //     setDraggedSection(section);

  //     section.classList.add('dragging');
  //     const sectionElement = section as HTMLElement;
  //     sectionElement.style.opacity = '0.5';
  //     sectionElement.style.transform = 'rotate(2deg)';
  //     sectionElement.style.zIndex = '1000';

  //     e.dataTransfer?.setData('text/plain', section.getAttribute('data-drag-section') || '');
  //   }
  // }, []);

  // const handleDragEnd = useCallback((e: DragEvent) => {
  //   const target = e.target as HTMLElement;
  //   const section = target.closest('section');

  //   if (section) {
  //     section.classList.remove('dragging');
  //     const sectionElement = section as HTMLElement;
  //     resetSectionStyles(sectionElement);
  //     if (isDragMode) {
  //       sectionElement.style.position = 'relative';
  //       sectionElement.style.border = '2px dashed transparent';
  //       sectionElement.style.borderRadius = '6px';
  //       sectionElement.style.transition = 'all 0.2s ease';
  //     }
  //   }

  //   if (dragPlaceholder && dragPlaceholder.parentNode) {
  //     dragPlaceholder.parentNode.removeChild(dragPlaceholder);
  //   }
  //   setDragPlaceholder(null);
  //   setDraggedSection(null);
  // }, [dragPlaceholder, isDragMode, resetSectionStyles]);

  // const SCROLL_ZONE = 60;
  // const SCROLL_SPEED = 100;

  // const handleDragOver = useCallback((e: DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   const scrollEl = scrollRef.current;
  //   if (scrollEl) {
  //     const { top, bottom } = scrollEl.getBoundingClientRect();
  //     if (e.clientY < top + SCROLL_ZONE) {
  //       scrollEl.scrollBy({ top: -SCROLL_SPEED, behavior: 'smooth' });
  //     } else if (e.clientY > bottom - SCROLL_ZONE) {
  //       scrollEl.scrollBy({ top: SCROLL_SPEED, behavior: 'smooth' });
  //     }
  //   }

  //   const target = e.target as HTMLElement;
  //   const section = target.closest('section');

  //   if (
  //     draggedSection &&
  //     section &&
  //     section !== draggedSection &&
  //     section.hasAttribute('data-drag-section')
  //   ) {
  //     const rect = section.getBoundingClientRect();
  //     const midpoint = rect.top + rect.height / 2;
  //     const insertAfter = e.clientY > midpoint;

  //     const container = section.parentElement;
  //     if (!container) return;

  //     const currentPosition = Array.from(container.children).indexOf(draggedSection);
  //     const targetPosition = Array.from(container.children).indexOf(section);
  //     const willInsertAfter = insertAfter && targetPosition > currentPosition;
  //     const willInsertBefore = !insertAfter && targetPosition < currentPosition;

  //     if (willInsertAfter || willInsertBefore) {
  //       container.insertBefore(
  //         draggedSection,
  //         insertAfter ? section.nextElementSibling : section
  //       );
  //     }
  //   }
  // }, [draggedSection]);
  // const handleDrop = useCallback((e: DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   try {
  //     if (draggedSection) {
  //       const draggedElement = draggedSection as HTMLElement;
  //       resetSectionStyles(draggedElement);

  //       if (isDragMode) {
  //         draggedElement.style.position = 'relative';
  //         draggedElement.style.border = '2px dashed transparent';
  //         draggedElement.style.borderRadius = '6px';
  //         draggedElement.style.transition = 'all 0.2s ease';
  //       }

  //       if (contentRef.current) {
  //         contentRef.current.offsetHeight;
  //         requestAnimationFrame(() => {
  //           requestAnimationFrame(() => {
  //             try {
  //               if (contentRef.current) {
  //                 const updatedHtml = contentRef.current.innerHTML;
  //                 setHtml(updatedHtml);

  //                 const MAX_HISTORY_SIZE = 100;
  //                 const newHistory = [...history.slice(0, historyIndex + 1), updatedHtml];
  //                 if (newHistory.length > MAX_HISTORY_SIZE) {
  //                   newHistory.shift();
  //                 }
  //                 setHistory(newHistory);
  //                 setHistoryIndex(newHistory.length - 1);

  //                 setTimeout(() => {
  //                   updateJsonFromHtml();
  //                 }, 100);
  //               }
  //             } catch (error) {
  //               console.error('Failed to update HTML after drop:', error);
  //             }
  //           });
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Drop operation failed:', error);
  //   } finally {
  //     setDraggedSection(null);
  //   }
  // }, [
  //   draggedSection,
  //   history,
  //   historyIndex,
  //   setHtml,
  //   setHistory,
  //   setHistoryIndex,
  //   isDragMode,
  //   resetSectionStyles,
  //   updateJsonFromHtml
  // ]);

  // useEffect(() => {
  //   if (isDragMode) {
  //     initializeDragAndDrop();

  //     const container = contentRef.current;
  //     if (!container) return;

  //     const dragStartHandler = (e: Event) => handleDragStart(e as DragEvent);
  //     const dragEndHandler = (e: Event) => handleDragEnd(e as DragEvent);
  //     const dragOverHandler = (e: Event) => handleDragOver(e as DragEvent);
  //     const dropHandler = (e: Event) => handleDrop(e as DragEvent);

  //     container.addEventListener('dragstart', dragStartHandler, { passive: false });
  //     container.addEventListener('dragend', dragEndHandler, { passive: false });
  //     container.addEventListener('dragover', dragOverHandler, { passive: false });
  //     container.addEventListener('drop', dropHandler, { passive: false });

  //     const documentDragOverHandler = (e: Event) => {
  //       const dragEvent = e as DragEvent;
  //       if (container.contains(dragEvent.target as Node)) {
  //         handleDragOver(dragEvent);
  //       }
  //     };

  //     const documentDropHandler = (e: Event) => {
  //       const dragEvent = e as DragEvent;
  //       if (container.contains(dragEvent.target as Node)) {
  //         handleDrop(dragEvent);
  //       }
  //     };

  //     document.addEventListener('dragover', documentDragOverHandler, { passive: false });
  //     document.addEventListener('drop', documentDropHandler, { passive: false });

  //     return () => {
  //       container.removeEventListener('dragstart', dragStartHandler);
  //       container.removeEventListener('dragend', dragEndHandler);
  //       container.removeEventListener('dragover', dragOverHandler);
  //       container.removeEventListener('drop', dropHandler);

  //       document.removeEventListener('dragover', documentDragOverHandler);
  //       document.removeEventListener('drop', documentDropHandler);
  //     };
  //   }
  // }, [isDragMode, initializeDragAndDrop, handleDragStart, handleDragEnd, handleDragOver, handleDrop]);
const initializeDragAndDrop = useCallback(() => {
  if (!contentRef.current || !isDragMode) return;
  // Change this line to select div elements with class "section"
  const sections = contentRef.current.querySelectorAll('div.section');

  sections.forEach((section, index) => {
    const sectionElement = section as HTMLElement;

    storeOriginalStyles(sectionElement);
    section.setAttribute('data-drag-section', `section-${index}`);
    section.setAttribute('draggable', 'true');

    if (!section.querySelector('.drag-handle')) {
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '⋮⋮';
      dragHandle.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        color: #0369a1;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #0369a1;
        border-radius: 4px;
        padding: 4px 6px;
        font-size: 14px;
        cursor: grab;
        z-index: 20;
        opacity: 0.8;
        transition: all 0.2s ease;
        user-select: none;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        pointer-events: auto;
      `;
      sectionElement.style.position = sectionElement.style.position || 'relative';
      sectionElement.style.border = '2px dashed transparent';
      sectionElement.style.borderRadius = '6px';
      sectionElement.style.transition = 'all 0.2s ease';

      section.appendChild(dragHandle);

      const handleMouseEnter = () => {
        dragHandle.style.opacity = '1';
        dragHandle.style.transform = 'scale(1.05)';
        sectionElement.classList.add('drag-hover');
        sectionElement.style.backgroundColor = 'rgba(3, 105, 161, 0.03)';
        sectionElement.style.borderColor = '#0369a1';
        sectionElement.style.boxShadow = '0 2px 8px rgba(3, 105, 161, 0.1)';
      };

      const handleMouseLeave = () => {
        if (!section.classList.contains('dragging')) {
          dragHandle.style.opacity = '0.8';
          dragHandle.style.transform = 'scale(1)';
          sectionElement.classList.remove('drag-hover');
          sectionElement.style.backgroundColor = '';
          sectionElement.style.borderColor = 'transparent';
          sectionElement.style.boxShadow = '';
        }
      };

      section.addEventListener('mouseenter', handleMouseEnter);
      section.addEventListener('mouseleave', handleMouseLeave);

      section.setAttribute('data-has-listeners', 'true');
      dragHandle.addEventListener('mousedown', () => {
        dragHandle.style.cursor = 'grabbing';
      });

      dragHandle.addEventListener('mouseup', () => {
        dragHandle.style.cursor = 'grab';
      });
    }
  });
}, [isDragMode, storeOriginalStyles]);

const toggleDragMode = useCallback(() => {
  const newDragMode = !isDragMode;
  setIsDragMode(newDragMode);
  if (contentRef.current) {
    if (newDragMode) {
      contentRef.current.classList.add('drag-mode-active');
    } else {
      contentRef.current.classList.remove('drag-mode-active');
    }
  }

  if (!newDragMode && contentRef.current) {
    // Change this line to select div elements with class "section"
    const sections = contentRef.current.querySelectorAll('div.section');
    sections.forEach(section => {
      const sectionElement = section as HTMLElement;
      const dragHandle = section.querySelector('.drag-handle');
      if (dragHandle) {
        dragHandle.remove();
      }
      if (section.hasAttribute('data-has-listeners')) {
        section.removeAttribute('data-has-listeners');
      }
      restoreOriginalStyles(sectionElement);
      section.removeAttribute('draggable');
      section.removeAttribute('data-drag-section');
      section.classList.remove('dragging', 'drag-hover');
      resetSectionStyles(sectionElement);
    });
    setDraggedSection(null);
    if (dragPlaceholder && dragPlaceholder.parentNode) {
      dragPlaceholder.parentNode.removeChild(dragPlaceholder);
    }
    setDragPlaceholder(null);
  }
}, [isDragMode, restoreOriginalStyles, resetSectionStyles, dragPlaceholder]);

const handleDragStart = useCallback((e: DragEvent) => {
  const target = e.target as HTMLElement;
  // Change this line to look for div elements with class "section"
  const section = target.closest('div.section');

  if (section && section.hasAttribute('data-drag-section')) {
    setDraggedSection(section);

    section.classList.add('dragging');
    const sectionElement = section as HTMLElement;
    sectionElement.style.opacity = '0.5';
    sectionElement.style.transform = 'rotate(2deg)';
    sectionElement.style.zIndex = '1000';

    e.dataTransfer?.setData('text/plain', section.getAttribute('data-drag-section') || '');
  }
}, []);

const handleDragEnd = useCallback((e: DragEvent) => {
  const target = e.target as HTMLElement;
  // Change this line to look for div elements with class "section"
  const section = target.closest('div.section');

  if (section) {
    section.classList.remove('dragging');
    const sectionElement = section as HTMLElement;
    resetSectionStyles(sectionElement);
    if (isDragMode) {
      sectionElement.style.position = 'relative';
      sectionElement.style.border = '2px dashed transparent';
      sectionElement.style.borderRadius = '6px';
      sectionElement.style.transition = 'all 0.2s ease';
    }
  }

  if (dragPlaceholder && dragPlaceholder.parentNode) {
    dragPlaceholder.parentNode.removeChild(dragPlaceholder);
  }
  setDragPlaceholder(null);
  setDraggedSection(null);
}, [dragPlaceholder, isDragMode, resetSectionStyles]);

const SCROLL_ZONE = 60;
const SCROLL_SPEED = 100;

const handleDragOver = useCallback((e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  const scrollEl = scrollRef.current;
  if (scrollEl) {
    const { top, bottom } = scrollEl.getBoundingClientRect();
    if (e.clientY < top + SCROLL_ZONE) {
      scrollEl.scrollBy({ top: -SCROLL_SPEED, behavior: 'smooth' });
    } else if (e.clientY > bottom - SCROLL_ZONE) {
      scrollEl.scrollBy({ top: SCROLL_SPEED, behavior: 'smooth' });
    }
  }

  const target = e.target as HTMLElement;
  // Change this line to look for div elements with class "section"
  const section = target.closest('div.section');

  if (
    draggedSection &&
    section &&
    section !== draggedSection &&
    section.hasAttribute('data-drag-section')
  ) {
    const rect = section.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const insertAfter = e.clientY > midpoint;

    const container = section.parentElement;
    if (!container) return;

    const currentPosition = Array.from(container.children).indexOf(draggedSection);
    const targetPosition = Array.from(container.children).indexOf(section);
    const willInsertAfter = insertAfter && targetPosition > currentPosition;
    const willInsertBefore = !insertAfter && targetPosition < currentPosition;

    if (willInsertAfter || willInsertBefore) {
      container.insertBefore(
        draggedSection,
        insertAfter ? section.nextElementSibling : section
      );
    }
  }
}, [draggedSection]);

const handleDrop = useCallback((e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    if (draggedSection) {
      const draggedElement = draggedSection as HTMLElement;
      resetSectionStyles(draggedElement);

      if (isDragMode) {
        draggedElement.style.position = 'relative';
        draggedElement.style.border = '2px dashed transparent';
        draggedElement.style.borderRadius = '6px';
        draggedElement.style.transition = 'all 0.2s ease';
      }

      if (contentRef.current) {
        contentRef.current.offsetHeight;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              if (contentRef.current) {
                const updatedHtml = contentRef.current.innerHTML;
                setHtml(updatedHtml);

                const MAX_HISTORY_SIZE = 100;
                const newHistory = [...history.slice(0, historyIndex + 1), updatedHtml];
                if (newHistory.length > MAX_HISTORY_SIZE) {
                  newHistory.shift();
                }
                setHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);

                setTimeout(() => {
                  updateJsonFromHtml();
                }, 100);
              }
            } catch (error) {
              console.error('Failed to update HTML after drop:', error);
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('Drop operation failed:', error);
  } finally {
    setDraggedSection(null);
  }
}, [
  draggedSection,
  history,
  historyIndex,
  setHtml,
  setHistory,
  setHistoryIndex,
  isDragMode,
  resetSectionStyles,
  updateJsonFromHtml
]);

// Rest of the useEffect remains the same
useEffect(() => {
  if (isDragMode) {
    initializeDragAndDrop();

    const container = contentRef.current;
    if (!container) return;

    const dragStartHandler = (e: Event) => handleDragStart(e as DragEvent);
    const dragEndHandler = (e: Event) => handleDragEnd(e as DragEvent);
    const dragOverHandler = (e: Event) => handleDragOver(e as DragEvent);
    const dropHandler = (e: Event) => handleDrop(e as DragEvent);

    container.addEventListener('dragstart', dragStartHandler, { passive: false });
    container.addEventListener('dragend', dragEndHandler, { passive: false });
    container.addEventListener('dragover', dragOverHandler, { passive: false });
    container.addEventListener('drop', dropHandler, { passive: false });

    const documentDragOverHandler = (e: Event) => {
      const dragEvent = e as DragEvent;
      if (container.contains(dragEvent.target as Node)) {
        handleDragOver(dragEvent);
      }
    };

    const documentDropHandler = (e: Event) => {
      const dragEvent = e as DragEvent;
      if (container.contains(dragEvent.target as Node)) {
        handleDrop(dragEvent);
      }
    };

    document.addEventListener('dragover', documentDragOverHandler, { passive: false });
    document.addEventListener('drop', documentDropHandler, { passive: false });

    return () => {
      container.removeEventListener('dragstart', dragStartHandler);
      container.removeEventListener('dragend', dragEndHandler);
      container.removeEventListener('dragover', dragOverHandler);
      container.removeEventListener('drop', dropHandler);

      document.removeEventListener('dragover', documentDragOverHandler);
      document.removeEventListener('drop', documentDropHandler);
    };
  }
}, [isDragMode, initializeDragAndDrop, handleDragStart, handleDragEnd, handleDragOver, handleDrop]);

  useEffect(() => {
    if (resumeData.resumeHtml) {
      setHtml(resumeData.resumeHtml);
    }
  }, [resumeData.resumeHtml]);

  useEffect(() => {
    if (contentRef.current && html) {
      contentRef.current.innerHTML = html;
      setHistory([html]);
      setHistoryIndex(0);
    }
  }, [html]);

  useEffect(() => {
    if (html && contentRef.current) {
      contentRef.current.innerHTML = html;

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.offsetHeight;
        }
      });
    }
  }, [html]);

  useEffect(() => {
    if (resumeData.resumeHtml) {
      setHtml(resumeData.resumeHtml);
    }
  }, [resumeData.resumeHtml]);

  useEffect(() => {
    if (contentRef.current && html) {
      contentRef.current.innerHTML = html;
      setHistory([html]);
      setHistoryIndex(0);
    }
  }, [html]);

  useEffect(() => {
    if (html && contentRef.current) {
      contentRef.current.innerHTML = html;
      console.log(html)
    }
  }, [html]);

  useEffect(() => {
    if (!html) {
      return setupProgressAnimation(setUploadProgress);
    }
  }, [html]);

  useEffect(() => {
    if (!html) {
      return setupMessageAnimation(setAiMessageIndex);
    }
  }, [html]);

  useEffect(() => {
    if (
      previousPath === "/resume-generation/build-from-jd" ||
      (previousPath === "/my-profile" && beforePreviousPath === "/resume-generation/build-from-jd")
    ) {
      setShowJDNotification(true);
      toast.info("Your resume has been updated based on the Job Description provided!");
    }
  }, [previousPath, beforePreviousPath]);
  useEffect(() => {
    setSelectionPosition(null);
    setShowAIBuddy(false);
  }, [selectedTemplateId]);
  const handleSelection = () => {
    if (isDragMode) return;

    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      setSavedRange(sel.getRangeAt(0).cloneRange());
      selectionHandler(
        contentRef,
        setCustomSelectionRects,
        setSelectionPosition,
        setSelectedText
      );
    }
  };

  const replaceSelection = (newText: string) => {
    if (!savedRange || !contentRef.current) return;
    const originalText = savedRange.toString();
    const span = document.createElement("span");
    span.setAttribute("data-original", originalText);
    span.textContent = newText;
    span.classList.add("enhanced-text");
    const changeId = uuidv4();
    span.setAttribute("data-ai-id", changeId);
    savedRange.deleteContents();
    savedRange.insertNode(span);
    const updatedHtml = contentRef.current.innerHTML;
    setHtml(updatedHtml);
    const newHistory = [...history.slice(0, historyIndex + 1), updatedHtml];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    updateJsonFromHtml();
    setSavedRange(null);
    setCustomSelectionRects([]);
    setSelectionPosition(null);
    setSelectedText("");

    setAiHistory(prev => [
      ...prev,
      { id: changeId, original: originalText, enhanced: newText }
    ]);
  };

  const highlightById = (changeId: string) => {
    const span = contentRef.current?.querySelector(`span[data-ai-id="${changeId}"]`);
    if (!span) return;
    const range = document.createRange();
    range.selectNodeContents(span);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const revertById = (changeId: string) => {
    const span = contentRef.current?.querySelector(`span[data-ai-id="${changeId}"]`);
    if (!span) return;
    const original = (span as HTMLElement).getAttribute('data-original')!;
    const textNode = document.createTextNode(original);
    span.replaceWith(textNode);

    const updatedHtml = contentRef.current!.innerHTML;
    setHtml(updatedHtml);
    const newHist = [...history.slice(0, historyIndex + 1), updatedHtml];
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    updateJsonFromHtml();

    setAiHistory(prev => prev.filter(c => c.id !== changeId));
  };


  useEffect(() => {
    return setupMutationObserver(
      contentRef,
      html,
      history,
      historyIndex,
      mutationTimeout,
      setMutationTimeout,
      setHistory,
      setHistoryIndex,
      updateJsonFromHtml
    );
  }, [contentRef, html, history, historyIndex, updateJsonFromHtml, mutationTimeout]);


  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const openSaveDialog = () => {
    setTempResumeName(resumeName);
    setSaveMessage(null);
    setIsSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    if (!contentRef.current?.innerHTML) return;
    setIsSaving(true);
    try {
      const shouldIncludeJD = previousPath === "/resume-generation/build-from-jd";

      // Save the resume and get the response
      const savedResumeResponse = await saveResume(
        resumeData.resumeJson,
        contentRef.current.innerHTML,
        tempResumeName,
        selectedTemplateId,
        shouldIncludeJD ? jobDetails : undefined
      );

      // Update local resume name state
      setResumeName(tempResumeName);
      setResumename(tempResumeName);
      // Update the resume name in the store so it shows at the top
      const { updateResumeJson } = useResumeStore.getState();
      const currentResumeData = useResumeStore.getState().resumeData.resumeJson;
      if (currentResumeData) {
        updateResumeJson({
          ...currentResumeData,
          resumeName: tempResumeName
        });
      }

      // Handle resume ID - check if your saveResume returns an ID
      if (savedResumeResponse && savedResumeResponse.id) {
        // If your API returns the resume ID
        setLocalResumeId(savedResumeResponse.id);
        const newUrl = `${window.location.pathname}?resumeId=${savedResumeResponse.id}`;
        router.replace(newUrl, { scroll: false });
      } else if (savedResumeResponse && savedResumeResponse.resumeId) {
        // Alternative: if the ID is in a different property
        setLocalResumeId(savedResumeResponse.resumeId);
        const newUrl = `${window.location.pathname}?resumeId=${savedResumeResponse.resumeId}`;
        router.replace(newUrl, { scroll: false });
      } else {
        // Fallback: generate a temporary ID to enable share button
        const tempId = `resume_${Date.now()}`;
        setLocalResumeId(tempId);
        const newUrl = `${window.location.pathname}?resumeId=${tempId}`;
        router.replace(newUrl, { scroll: false });
      }

      setSaveMessage("Resume saved successfully!");
    } catch (e) {
      setSaveMessage("Failed to save resume!");
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const generateResume = async (
  templateId: string,
  sendProfileJson: boolean = true,
  prompt?: string
) => {
  const oldHtml = html;
  setHtml("");
  setSelectedTemplateId(templateId);

  try {
    const resumeJson = useResumeStore.getState().resumeData.resumeJson;
    const payload: any = {
      templateId,
      ...(sendProfileJson && { profile_json: resumeJson }),
      ...(prompt && { prompt }),
    };

    const response = await generateResumeFromProfile(payload);

    if (typeof response === "string") {
      const msg = response;
      if (msg === "You don't have enough tokens to complete this action.") {
        setShowTokenDialog(true);
      } else {
        toast.error("Failed to generate Resume!");
      }
      setHtml(oldHtml);
      setError(new Error(msg));
      return;
    }
    if (response && typeof response === "object" && "resumeHtml" in response) {
      setHtml(response.resumeHtml!);
      setUploadProgress(100);
    } else {
      const fallbackError = "Invalid response from generateResumeFromProfile";
      toast.error(fallbackError);
      setHtml(oldHtml);
      setError(new Error(fallbackError));
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while generating the resume.";
    if (errorMessage === "You don't have enough tokens to complete this action.") {
      setShowTokenDialog(true);
    } else {
      toast.error(errorMessage);
    }
    setHtml(oldHtml);
    setError(err instanceof Error ? err : new Error(errorMessage));
  }
};


  const editorState: EditorState = {
    contentRef: contentRef as ContentRefType,
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
  };

  return (
    <div className="flex min-w-screen justify-around h-[87vh] space-x-3">
      {showTokenDialog && 
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogTrigger asChild>
          {/* Invisible trigger; we'll open via state */}
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sky-700 text-center">Insufficient Tokens!</DialogTitle>
            <DialogDescription>
              You don’t have enough tokens to complete this action.
              Please recharge your account or purchase more tokens to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowTokenDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 rounded-lg shadow-md px-4 py-2"

              onClick={() => {
                window.location.href = "/settings/manage-subscription";
              }}
            >
              Buy Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      }
      <ToastContainer />
      <ShareLinkDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareLink={shareLink}
      />
      <div className="flex border border-sky-700 w-full">
        <div className="w-16 bg-[#2D6DA4] h-full p-2 flex flex-col justify-end items-center py-4">
          <div className="flex flex-col items-center mt-auto">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleZoomIn}>
              <ZoomIn size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={handleZoomOut}>
              <ZoomOut size={24} />
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col flex-1 rounded-md h-full">
          <div className="flex p-2 justify-between w-full">

            <div className="flex items-center gap-2">
              <Toolbar contentRef={contentRef as ContentRefType} editorState={editorState} />
              {/* Drag Mode Toggle Button */}
              <Tippy content="Reorder sections in your resume">
              <Button
                onClick={toggleDragMode}
                variant={isDragMode ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 md:h-[30px] lg:h-[32px] ${isDragMode
                  ? "bg-sky-700 text-white hover:bg-sky-800"
                  : "border-sky-700 text-sky-700 hover:bg-sky-50"
                  }`}
              >
                <GripVertical size={16} />
                {isDragMode ? "Exit Drag Mode" : "Drag Sections"}
              </Button>
              </Tippy>
            </div>

            <div className="flex justify-end">
              <div className="items-center space-x-2 flex mr-3">
                <Tippy content="Use AI to optimize your whole resume">
                <Image
                  src="/ai-optimize.svg"
                  alt="scroll-down"
                  width={30}
                  height={30}
                  className="md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px]"
                  onClick={() => generateResume(selectedTemplateId, true, "prompt")}

                />
                </Tippy>
                {hasResumeId ? (
                  <button
                    onClick={handleShare}
                    className="
      p-1
      hover:opacity-80
      cursor-pointer
    "
                  >
                    <Image
                      src="/arrow.svg"
                      alt="Share Resume"
                      width={30}
                      height={30}
                      className="md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px]"
                    />
                  </button>
                ) : (
                  <Tippy content="Save this resume to enable resume sharing">
                    <span>
                      <button
                        onClick={undefined}
                        disabled
                        className="
          p-1
          cursor-not-allowed
        "
                      >
                        <Image
                          src="/arrow.svg"
                          alt="Share Resume (disabled)"
                          width={30}
                          height={30}
                          className="
            md:w-[30px] md:h-[30px]
            lg:w-[32px] lg:h-[32px]
            opacity-50
          "
                        />
                      </button>
                    </span>
                  </Tippy>
                )}

              </div>
              <div className="flex items-center space-x-2 justify-end gap-x-2">
                <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-sky-700 to-blue-800 p-0 flex items-center justify-center md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px]"
                      disabled={isDragMode} >
                      <Image src="/save.svg" alt="save" width={20} height={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center justify-center text-center gap-4 min-h-32">
                    {saveMessage ? (
                      <div className="items-center">
                        <Image src="/tickSave.svg" alt="save" width={40} height={40} className="mx-auto" />
                        <p className="text-sky-700 text-lg">{saveMessage}</p>
                      </div>
                    ) : (
                      <>
                        <DialogHeader className="">
                          <DialogTitle>Save Resume</DialogTitle>
                          <DialogDescription>Enter a name below:</DialogDescription>
                        </DialogHeader>

                        <Input
                          value={tempResumeName}
                          onChange={(e) => setTempResumeName(e.target.value)}
                          placeholder="Resume Name"
                          className="w-full"
                        />

                        <DialogFooter className="w-full flex justify-center gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
                            onClick={confirmSave}
                            disabled={isSaving || !tempResumeName}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
                <DownloadDropdown html={html} />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 overflow-auto" ref={scrollRef}>
            {ResumeName && 
              <div className="w-60 mx-auto">
                <p className="text-center text-sky-700 font-semibold">
                  {ResumeName}
                </p>
              </div>
            }


            <div
              className="editor-wrapper mx-auto p-8 pt-5 min-h-[] w-[856px] relative"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              {html ? (
                <div className="relative">
                  {isDragMode && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">
                        🔄 Drag Mode Active - You can now drag and drop resume sections to reorder them
                      </p>
                    </div>
                  )}

                  {customSelectionRects.map((rect, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  ))}

                  <div
                    className="resume-preview p-2 focus:outline-none"
                    ref={contentRef}
                    spellCheck={false}
                    contentEditable={false}
                    onMouseUp={handleSelection}
                    onKeyUp={handleSelection}
                    suppressContentEditableWarning
                  />

                </div>
              ) : (
                <Card className="border-2 border-sky-700 bg-sky-50 rounded-md mb-8">
                  <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <h2 className="text-xl font-semibold text-sky-700 mb-2">
                      {aiMessages[aiMessageIndex]}
                    </h2>
                    <div className="w-full max-w-xs mb-2 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-sky-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sky-700 font-medium">{uploadProgress}% Complete</p>
                    <p className="text-sm text-sky-700 mt-2">Processing your profile</p>
                  </CardContent>
                </Card>
              )}



              {selectionPosition && !isDragMode && (
                <div
                  className="absolute flex items-center gap-2 transition-opacity duration-200 cursor-pointer"
                  style={{
                    top: `${selectionPosition.y + 20}px`,
                    left: `${selectionPosition.x + 50}px`,
                    zIndex: 1000,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAiBuddyPrompt(selectedText);
                    setShowAIBuddy(true);
                  }}
                >
                  <Image src="/ai-optimize.svg" alt="optimize" width={30} height={30} />
                  <span className="text-xs bg-gradient-to-r from-sky-700 to-blue-800 text-white rounded shadow-md p-2 text-nowrap">
                    Optimize with AI Buddy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 border-l border-gray-200">
        {showAIBuddy ? (
          <AIBuddy
            prompt={aiBuddyPrompt as string}
            onEnhance={(enhancedText) => {
              replaceSelection(enhancedText);
            }}
            selectedChangeId={selectedChangeId}
            onRevert={() => {
              if (selectedChangeId) {
                revertById(selectedChangeId);
                setSelectedChangeId(null);
              }
            }}
            selectedText={selectedText}
            originalTextMap={originalTextMap}
            onClose={() => {
              setShowAIBuddy(false);
              setAiBuddyPrompt(null);
            }}
            aiHistory={aiHistory}
            onHistorySelect={(id) => {
              highlightById(id);
              setSelectedChangeId(id);
              setShowAIBuddy(true);
            }}
            onHistoryRevert={revertById}
          />
        ) : (
          <Templates onTemplateSelect={generateResume} />
        )}
      </div>
    </div>
  )
};

export default GenerateFromProfilePage;