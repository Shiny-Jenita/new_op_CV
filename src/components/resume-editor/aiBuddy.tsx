import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { EnhanceSentenceRequest, EnhanceSentenceResponse, EnhancedResult } from "@/api/resume/interface";
import { enhanceSentences } from "@/api/resume";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function AIBuddy({
  prompt,
  onEnhance,
  onRevert,
  selectedText,
  selectedChangeId,
  originalTextMap,
  aiHistory,
  onHistorySelect,
  onClose,
}: {
  prompt: string;
  onEnhance: (text: string) => void;
  onRevert: () => void;
  selectedText: string;
  selectedChangeId: string | null;
  originalTextMap: Map<string, string>;
  onClose: () => void;
  aiHistory: {
    id: string;
    original: string;
    enhanced: string;
  }[];
  onHistorySelect: (id: string) => void;
}) {
  const [sampleContext, setSampleContext] = useState("");
  const [results, setResults] = useState<EnhancedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("optimize");
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);

  const styleOptions = [
    {
      value: "professional",
      label: "Make it Professional",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      )
    },
    {
      value: "concise",
      label: "Make it Concise",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    },
    {
      value: "impactful",
      label: "Make it Impactful",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      value: "technical",
      label: "Make it Technical",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V9a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 9V4.5A2.5 2.5 0 0 1 5 2h4.5z" />
          <path d="M14.5 14A2.5 2.5 0 0 1 17 16.5V21a2.5 2.5 0 0 1-2.5 2.5H10A2.5 2.5 0 0 1 7.5 21v-4.5A2.5 2.5 0 0 1 10 14h4.5z" />
          <path d="M22 14v7" />
          <path d="M19 17h6" />
        </svg>
      )
    },
    {
      value: "leadership",
      label: "Make it Leadership",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      value: "optimize",
      label: "Make it Optimized",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
  ];

  // reset results & error when prompt changes
  useEffect(() => {
    setResults([]);
    setError(null);
    setShowHint(false);
    setTokenUsage(null);
  }, [prompt]);

  // whenever error becomes non-null, show the dialog
  useEffect(() => {
    if (error) {
      setShowErrorDialog(true);
    }
  }, [error]);

  const handleEnhance = async () => {
    setError(null);
    if (!prompt) {
      setError("No text selected to enhance.");
      return;
    }

    const payload: EnhanceSentenceRequest = {
      sentences: [prompt], // pass the whole text as one sentence
      style: selectedStyle,
      context: sampleContext || undefined,
    };

    setLoading(true);
    try {
      const data: EnhanceSentenceResponse = await enhanceSentences(payload);
      setResults(data.results);
      // Calculate total token usage from all results
      const totalTokens = data.results.reduce((sum, result) => sum + (result.token_usage || 0), 0);
      setTokenUsage(totalTokens);
    } catch (e: any) {
      setError(e.message ?? "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  let originalParagraph: string;
  let enhancedParagraph: string;

  if (selectedChangeId) {
    const hist = aiHistory.find((h) => h.id === selectedChangeId);
    if (hist) {
      originalParagraph = hist.original;
      enhancedParagraph = hist.enhanced;
    } else {
      originalParagraph = prompt;
      enhancedParagraph = "";
    }
  } else {
    originalParagraph = results.length
      ? results.map((r) => r.original).join(" ")
      : prompt;
    enhancedParagraph = results.map((r) => r.enhanced).join(" ");
  }

  const handleUseEnhanced = () => {
    onEnhance(enhancedParagraph);
    setShowHint(true);
  };

  const canRevert = !!selectedChangeId;

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setShowStyleDropdown(false);
  };

  return (
    <>
      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogTrigger asChild>
          {/* invisible trigger */}
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sky-700 text-center">Insufficient Tokens!</DialogTitle>
            <DialogDescription>
              You don't have enough tokens to complete this action.
              Please recharge your account or purchase more tokens to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
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

      {/* Main panel */}
      <div className="w-80 border border-sky-700 h-[87vh] bg-white shadow-sm flex flex-col">
        <div className="flex items-center justify-between border-b p-2 border-sky-700 sticky top-0 bg-white z-10">
          <div className="flex gap-2 items-center">
            <Image src="/ai-optimize.svg" alt="ai" width={30} height={30} />
            <h3 className="font-bold text-sm">AI Buddy</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2 flex flex-col flex-grow">
          <div className="max-h-[25vh] overflow-y-auto mb-2 space-y-3 pr-1">
            <div>
              <h4 className="text-xs font-semibold">Original</h4>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">
                {originalParagraph}
              </p>
            </div>
            <div className="border-t border-gray-200" />
            <div>
              <h4 className="text-xs font-semibold">Enhanced</h4>
              {loading && (
                <div className="flex items-center space-x-2 text-xs text-sky-700">
                  <svg
                    className="animate-spin h-4 w-4 text-sky-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Enhancing sentences...</span>
                </div>
              )}
              {(results.length > 0 || selectedChangeId) ? (
                <div className="space-y-2">
                  <p className="text-xs bg-gray-100 rounded whitespace-pre-wrap p-1">
                    {enhancedParagraph.split(" ").map((word, i) =>
                      originalParagraph.includes(word) ? (
                        <span key={i}>{word} </span>
                      ) : (
                        <strong key={i} className="text-green-700">
                          {word}{" "}
                        </strong>
                      )
                    )}
                  </p>
                  {tokenUsage && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>Tokens used: {tokenUsage}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">(No enhancements yet)</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-2 items-center">
          {!selectedChangeId && results.length > 0 && (
              <Button
                className="text-xs rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 px-3 h-7"
                onClick={handleUseEnhanced}
              >
                Apply
              </Button>
            )}
            {canRevert ? (
              <Button
                className="text-xs rounded-full bg-gray-500 text-white px-3 h-7 hover:bg-gray-600"
                onClick={onRevert}
              >
                Revert to Original
              </Button>
            ) : (
              showHint && (
                <div className="text-xs text-gray-600 italic">
                  💡 Select an edit from the AI Edit History below to revert
                </div>
              )
            )}
          </div>

          <div className="flex gap-2 mb-2">
            {!selectedChangeId && (
            <Button
              className="text-xs h-8 min-w-[90px] rounded-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90"
              onClick={handleEnhance}
              disabled={loading}
            >
              Rephrase it
            </Button>
             )}

            {/* Style Dropdown */}
            <div className="relative">
              <Button
                className="text-xs h-8 min-w-[90px] rounded-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 flex items-center justify-between px-3"
                onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                disabled={loading}
              >
                <span className="capitalize">
                  {styleOptions.find(opt => opt.value === selectedStyle)?.label.replace('Make it ', '') || 'Optimize'}
                </span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>

              {showStyleDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  {styleOptions.map((option) => (
                    <div
                      key={option.value}
                      className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => handleStyleSelect(option.value)}
                    >
                      <span className="text-sky-700">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center mb-1">
            <Input
              value={sampleContext}
              onChange={(e) => setSampleContext(e.target.value)}
              placeholder="How can I help you?"
              className="w-full pr-10 bg-gray-100 border border-gray-300 rounded-md h-10 text-sm"
            />
             {!selectedChangeId && (
            <ArrowRight
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-700 cursor-pointer"
              onClick={handleEnhance}
            />
            )}
          </div>

          <p className="text-[10px] text-gray-600">
            <span className="text-sky-700">AI Buddy</span> may occasionally
            cause errors, so double-check.
          </p>

          {/* AI history list */}
          <div className="mt-4 border-t pt-2 h-40">
            <h4 className="text-xs font-semibold mb-2">AI Edit History</h4>
            {aiHistory.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-44 pr-1">
                {aiHistory.map((change, idx) => (
                  <div
                    key={change.id}
                    className="cursor-pointer p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    onClick={() => onHistorySelect(change.id)}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-xs font-semibold text-gray-600">
                        {idx + 1}.
                      </span>
                      <div className="flex-1 flex flex-col space-y-1">
                        <div className="text-xs p-1 bg-red-100 border border-red-300 rounded text-red-800">
                          {change.original}
                        </div>
                        <div className="text-xs p-1 bg-green-100 border border-green-300 rounded text-green-800">
                          {change.enhanced}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-500">No AI edits yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}