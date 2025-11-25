"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Tippy from '@tippyjs/react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  AlignJustify,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { EditorState } from "@/app/interfaces";

interface ToolbarProps {
  contentRef: React.RefObject<HTMLDivElement>;
  editorState: EditorState;
}

interface ToolbarButtonProps {
  imageSrc?: string;
  alt?: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
const saveHistory = (editorState: EditorState) => {
};

export function Toolbar({ contentRef, editorState }: ToolbarProps) {
  const [fontFamilyValue, setFontFamilyValue] = useState("Calibri Light");
  const [fontSizeValue, setFontSizeValue] = useState("16");
  const [textColor, setTextColor] = useState("#4C515C");
  const [selectedAlign, setSelectedAlign] = useState("justifyLeft");
const [linkText, setLinkText] = useState("");
const [linkUrl, setLinkUrl] = useState("");
const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
const [editingLinkNode, setEditingLinkNode] = useState<HTMLAnchorElement | null>(null);
// const contentRef = useRef<HTMLDivElement>(null);
const fonts = [
  "Arial",
  "Calibri Light",
  "Garamond",
  "Georgia",
  "Helvetica",
  "Times New Roman",
  "Verdana",
];
const fontSizeOptions = [
  { label: "8", className: "text-[8px]" },
  { label: "9", className: "text-[9px]" },
  { label: "10", className: "text-[10px]" },
  { label: "11", className: "text-[11px]" },
  { label: "12", className: "text-[12px]" },
  { label: "14", className: "text-[14px]" },
  { label: "16", className: "text-[16px]" },
  { label: "18", className: "text-[18px]" },
  { label: "20", className: "text-[20px]" },
  { label: "24", className: "text-[24px]" },
  { label: "28", className: "text-[28px]" },
  { label: "32", className: "text-[32px]" },
  // { label: "36", className: "text-[36px]" },
  // { label: "48", className: "text-[48px]" },
  // { label: "64", className: "text-[64px]" },
];

const colors = [
  "#000000", // Black
  "#FF0000", // Red
  "#008000", // Green
  "#0000FF", // Blue
  "#FFA500", // Orange
  "#800080", // Purple
  "#00CED1", // Dark Turquoise
  "#FFC0CB", // Pink
  "#FFD700", // Gold
  "#2F4F4F", // Dark Slate Gray
  "#4B0082", // Indigo
  "#A52A2A", // Brown
  "#00FF7F", // Spring Green
  "#FF4500", // Orange Red
  "#1E90FF"  // Dodger Blue
];

  const savedSelection = useRef<Range | null>(null);
   const getSelectedBlocks = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return [];

    const range = sel.getRangeAt(0);
    const blocks: HTMLElement[] = [];
    if (range.collapsed) {
      let node = range.startContainer as Node;
      while (node && node !== contentRef.current) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          ["P", "DIV", "LI", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
            (node as Element).tagName
          )
        ) {
          blocks.push(node as HTMLElement);
          break;
        }
        node = node.parentNode!;
      }
      return blocks;
    }

    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (
            ["P", "DIV", "LI", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
              (node as Element).tagName
            )
          ) {
            const nodeRange = document.createRange();
            nodeRange.selectNode(node);
            if (
              range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0 &&
              range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      blocks.push(node as HTMLElement);
    }

    return blocks;
  };

 const handleCustomIndent = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    const selectedBlocks = getSelectedBlocks();
    
    if (selectedBlocks.length === 0) {
      let node = sel.getRangeAt(0).startContainer as HTMLElement | null;
      while (node && node.nodeName !== 'LI') {
        node = node.parentElement;
      }
      if (node && node.nodeName === 'LI') {
        const cur = parseInt(getComputedStyle(node).marginLeft) || 0;
        node.style.marginLeft = `${cur + 20}px`;
      } else {
        document.execCommand('indent');
      }
    } else {
      selectedBlocks.forEach(block => {
        if (block.nodeName === 'LI') {
          const cur = parseInt(getComputedStyle(block).marginLeft) || 0;
          block.style.marginLeft = `${cur + 20}px`;
        } else {
          const cur = parseInt(getComputedStyle(block).marginLeft) || 0;
          block.style.marginLeft = `${cur + 20}px`;
        }
      });
    }
    
    saveHistory(editorState);
  };
function applyFontSizeClass(className) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const content = range.toString();
  if (!content) return;

  const span = `<span class="${className}">${content}</span>`;
  document.execCommand("insertHTML", false, span);
}
  const handleCustomOutdent = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    const selectedBlocks = getSelectedBlocks();
    
    if (selectedBlocks.length === 0) {
      let node = sel.getRangeAt(0).startContainer as HTMLElement | null;
      while (node && node.nodeName !== 'LI') {
        node = node.parentElement;
      }
      if (node && node.nodeName === 'LI') {
        const cur = parseInt(getComputedStyle(node).marginLeft) || 0;
        node.style.marginLeft = `${Math.max(cur - 20, 0)}px`;
      } else {
        document.execCommand('outdent');
      }
    } else {
      selectedBlocks.forEach(block => {
        if (block.nodeName === 'LI') {
          const cur = parseInt(getComputedStyle(block).marginLeft) || 0;
          block.style.marginLeft = `${Math.max(cur - 20, 0)}px`;
        } else {
          const cur = parseInt(getComputedStyle(block).marginLeft) || 0;
          block.style.marginLeft = `${Math.max(cur - 20, 0)}px`;
        }
      });
    }
    
    saveHistory(editorState);
  };
  const handleCommand = (cmd: string, value?: string) => {
    restoreSelectionAndFocus();
    document.execCommand(cmd, false, value ?? "");
    saveHistory(editorState);
  };

  const applyIndent = handleCustomIndent;
  const applyOutdent = handleCustomOutdent;

  const restoreSelectionAndFocus = () => {
    const sel = window.getSelection();
    if (savedSelection.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
      contentRef.current?.focus();
    }
  };

  const insertUnorderedList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();

    if (!selectedText) return;

    const range = selection.getRangeAt(0);

    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName === "UL") {
        const ul = node;
        const parent = ul.parentNode;
        const fragment = document.createDocumentFragment();
        ul.childNodes.forEach((li) => {
          if (li.nodeName === "LI") {
            fragment.appendChild(document.createTextNode((li as HTMLElement).innerText + "\n"));
          }
        });

        parent?.replaceChild(fragment, ul);
        const textNode = fragment.lastChild;
        if (textNode) {
          const newRange = document.createRange();
          newRange.setStart(textNode, textNode.textContent?.length || 0);
          newRange.setEnd(textNode, textNode.textContent?.length || 0);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        saveHistory(editorState);
        return;
      }
      node = node.parentNode;
    }
    const lines = selectedText.split(/\r?\n/);
    const ul = document.createElement("ul");
    ul.style.paddingLeft = "20px";
    ul.style.listStyleType = "disc";

    for (const line of lines) {
      const li = document.createElement("li");
      li.textContent = line.trim() || "List item";
      ul.appendChild(li);
    }
    range.deleteContents();
    range.insertNode(ul);
    const afterUl = document.createTextNode("\u200B");
    ul.parentNode?.insertBefore(afterUl, ul.nextSibling);

    const newRange = document.createRange();
    newRange.setStartAfter(afterUl);
    newRange.setEndAfter(afterUl);

    selection.removeAllRanges();
    selection.addRange(newRange);

    saveHistory(editorState);
  };

  const alignMap: Record<string, "left" | "center" | "right" | "justify"> = {
    justifyLeft: "left",
    justifyCenter: "center",
    justifyRight: "right",
    justifyFull: "justify",
  };

  const handleSelectAlign = (cmd: keyof typeof alignMap) => {
    const align = alignMap[cmd];
    const selectedBlocks = getSelectedBlocks();
    
    if (selectedBlocks.length === 0) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      let node = range.startContainer as Node;
      while (node && node !== contentRef.current) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          ["P", "DIV", "LI", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
            (node as Element).tagName
          )
        ) {
          break;
        }
        node = node.parentNode!;
      }

      const block = node as HTMLElement;
      if (block && block !== contentRef.current) {
        block.style.textAlign = align;
      }
    } else {
      selectedBlocks.forEach(block => {
        block.style.textAlign = align;
      });
    }
    
    setSelectedAlign(cmd);
    saveHistory(editorState);
  };
  const handleInsertLink = () => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  savedSelection.current = range.cloneRange();

  const parentAnchor = range.startContainer.parentElement?.closest("a");
  if (parentAnchor) {
    // Editing an existing link
    setEditingLinkNode(parentAnchor);
    setLinkText(parentAnchor.textContent || "");
    setLinkUrl(parentAnchor.getAttribute("href") || "");
  } else {
    // Creating new link
    setEditingLinkNode(null);
    setLinkText(sel.toString());
    setLinkUrl("");
  }

  setIsLinkDialogOpen(true);
};
const applyLink = () => {
  if (!linkUrl) return setIsLinkDialogOpen(false);

  const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;

  if (editingLinkNode) {
    // Editing existing link
    editingLinkNode.href = url;
    editingLinkNode.textContent = linkText;
  } else if (savedSelection.current && contentRef.current) {
    const range = savedSelection.current;
    const a = document.createElement("a");
    a.href = url;
    a.textContent = linkText;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.color = "#0000EE";
    a.style.textDecoration = "underline";

    range.deleteContents();
    range.insertNode(a);

    // Move cursor after inserted link
    range.setStartAfter(a);
    range.setEndAfter(a);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  saveHistory(editorState);
  setIsLinkDialogOpen(false);
};
const removeLink = () => {
  if (editingLinkNode) {
    const textNode = document.createTextNode(editingLinkNode.textContent || "");
    editingLinkNode.replaceWith(textNode);
    setEditingLinkNode(null);
    saveHistory(editorState);
  }
  setIsLinkDialogOpen(false);
};

const applyFontColor = (color: string) => {
    setTextColor(color);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(range.extractContents());
    range.insertNode(span);

    // Move cursor after inserted span
    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

 const getAlignIcon = () => {
    switch (selectedAlign) {
      case "justifyLeft":
        return <AlignLeft />;
      case "justifyCenter":
        return <AlignCenter />;
      case "justifyRight":
        return <AlignRight />;
      case "justifyFull":
        return <AlignJustify />;
      default:
        return <AlignLeft />;
    }
  };

  return (
    <div className="p-1 flex gap-1 justify-between">
      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      className="flex items-center justify-between px-3 py-2 bg-inherit focus:outline-none text-sm w-[140px] md:h-[30px] lg:h-[32px]"
      type="button"
    >
      <span style={{ fontFamily: fontFamilyValue }}>{fontFamilyValue || "Font"}</span>
      <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="p-1 w-[140px]">
    {fonts.map((font) => (
      <button
        key={font}
        onClick={(e) => {
          e.preventDefault();
          setFontFamilyValue(font);
          handleCommand("fontName", font);
        }}
        className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          fontFamilyValue === font ? "bg-inherit dark:bg-gray-700 font-medium" : ""
        }`}
        style={{ fontFamily: font }}
        type="button"
      >
        {font}
      </button>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

 <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-20 text-sm justify-between bg-inherit md:h-[30px] lg:h-[32px]"
          type="button"
        >
          {fontSizeValue || "Size"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 w-20">
        {fontSizeOptions.map(({ label, className }) => (
          <button
            key={label}
            onClick={(e) => {
              e.preventDefault();
              setFontSizeValue(label);
              applyFontSizeClass(className);
            }}
            className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
              fontSizeValue === label ? "bg-gray-200 dark:bg-gray-700 font-medium" : ""
            }`}
            type="button"
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

       <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center px-3 py-2 bg-inherit focus:outline-none md:h-[30px] lg:h-[32px] "
          type="button"
        >
          <div
            className="w-5 h-5 rounded border border-gray-400 mr-2"
            style={{ backgroundColor: textColor }}
          />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-5 gap-2 w-40 p-2">
  {colors.map((color) => (
    <button
      key={color}
      className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
      style={{ backgroundColor: color }}
      onClick={(e) => {
        e.preventDefault();
        applyFontColor(color);
      }}
      aria-label={`Select color ${color}`}
      type="button"
    />
  ))}
</DropdownMenuContent>

     
    </DropdownMenu>
      <ToolbarButton
        imageSrc="/indent.svg"
        alt="Indent"
        onClick={applyIndent}
      />
      <ToolbarButton
        imageSrc="/outdent.svg"
        alt="Outdent"
        onClick={applyOutdent}
      />
      <ToolbarButton
        imageSrc="/bold.svg"
        alt="Bold"
        onClick={() => handleCommand("bold")}
      />
      <ToolbarButton
        imageSrc="/italic.svg"
        alt="Italic"
        onClick={() => handleCommand("italic")}
      />
      <ToolbarButton
        imageSrc="/underline.svg"
        alt="Underline"
        onClick={() => handleCommand("underline")}
      />
      <ToolbarButton
        imageSrc="/link.svg"
        alt="Insert Link"
        onClick={handleInsertLink}
      />
      <Dialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4 w-full">
            <div className="flex flex-col w-4/5">
              <Label htmlFor="linkText" className="mb-1 text-left w-full">
                Text
              </Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-4/5">
              <Label htmlFor="url" className="mb-1 text-left w-full">
                URL
              </Label>
              <Input
                id="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
  <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
  {editingLinkNode && (
    <Button variant="destructive" onClick={removeLink}>
      Remove Link
    </Button>
  )}
  <Button onClick={applyLink} className="bg-gradient-to-r from-sky-700 to-blue-800 w-16 h-9 p-3">
    {editingLinkNode ? "Update" : "Insert"}
  </Button>
</DialogFooter>

        </DialogContent>


      </Dialog>
      <DropdownMenu>
        <Tippy content="Alignment" placement="top" delay={100}>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center bg-inherit text-black hover:bg-inherit w-12 md:h-[30px] lg:h-[32px]">
              {getAlignIcon()}
              <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
        </Tippy>
        <DropdownMenuContent align="end" className="w-20">
          <DropdownMenuItem
            onSelect={() => handleSelectAlign("justifyLeft")}
          >
            <AlignLeft />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelectAlign("justifyCenter")}
          >
            <AlignCenter />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelectAlign("justifyRight")}
          >
            <AlignRight />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelectAlign("justifyFull")}
          >
            <AlignJustify />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarButton
        imageSrc="/bulletlist.svg"
        alt="Bullet List"
        onClick={insertUnorderedList}
      />
    </div>
  );
}

export function ToolbarButton({
  imageSrc,
  alt,
  onClick,
  disabled,
  children,
}: ToolbarButtonProps) {
  return (
    <Tippy content={alt}
      delay={100}
      placement="top"
      disabled={!alt}>
      <span>
        <Button
          variant="ghost"
          size="icon"
          onMouseDown={e => e.preventDefault()}
          onClick={onClick}
          disabled={disabled}
          className="w-8 p-1 md:h-[30px] lg:h-[32px]"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt || 'icon'}
              width={30}
              height={30}
              className="md:h-[30px] lg:h-[32px]"
            />
          ) : (
            children
          )}
        </Button>
      </span>
    </Tippy>
  );
}

