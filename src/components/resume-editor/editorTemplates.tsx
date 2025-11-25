"use client";

import { usePreviousPath } from "@/previouspathcontext";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useJDStore } from "@/stores/resume/jdStore";
import { useResumeStore } from "@/stores/resume/resumeStore";
interface Template {
  id: string;
  name?: string;
  description?: string;
  thumbnailUrl: string;
}

interface TemplatesProps {
  onTemplateSelect: (templateId: string) => void;
}

const TEMPLATES_STORAGE_KEY = "templates_display_path";

const Templates: React.FC<TemplatesProps> = ({ onTemplateSelect }) => {
  const { previousPath,beforePreviousPath } = usePreviousPath();
  const [displayPath, setDisplayPath] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showJD, setShowJD] = useState(false);
  const { jobDetails } = useJDStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {fetchTemplates } = useResumeStore();
  const templates=useResumeStore((state) => state.templateList);
  
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        await fetchTemplates();
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError(err instanceof Error ? err.message : "Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [fetchTemplates]);
  useEffect(() => {
    console.log('path',previousPath)
    const savedPath = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (savedPath) {
      setDisplayPath(savedPath);
    } else if (previousPath) {
      setDisplayPath(previousPath);
      localStorage.setItem(TEMPLATES_STORAGE_KEY, previousPath);
    }
  }, []);

 useEffect(() => {
  console.log('path', previousPath);
  const savedPath = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  if (savedPath) {
    setDisplayPath(savedPath);
  } else if (previousPath) {
    setDisplayPath(previousPath);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, previousPath);
  }
}, []);

useEffect(() => {
  if (previousPath && previousPath !== displayPath) {
    setDisplayPath(previousPath);
    console.log("disply",displayPath)
    localStorage.setItem(TEMPLATES_STORAGE_KEY, previousPath);
    setShowJD(
      previousPath === "/resume-generation/build-from-jd" || (previousPath === "/my-profile" && beforePreviousPath== "/resume-generation/build-from-jd")
    );
  }
}, [previousPath, displayPath]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onTemplateSelect(templateId);
  };

  return (
    <div className="w-80 h-[87vh] border border-[#2D6DA4] rounded-r-lg flex flex-col">
      <h3 className="text-sm font-semibold text-[#2D6DA4] text-center py-2 border-b border-[#2D6DA4]">
        Pick a Template
      </h3>

      <ScrollArea className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-sky-700">Loading templates...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 py-2">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className={`relative rounded-lg border p-1 group transition-all cursor-pointer ${
                  selectedTemplateId === template.id ? "border-2 border-sky-700" : "border-gray-300"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={template.thumbnailUrl}
                  alt={`template-${template.id}`}
                  width={150}
                  height={194} // 150 * (11 / 8.5)
                  className="w-[150px] h-[194px] object-cover rounded-md shadow-sm"
                />
                <Button
                  className={`absolute left-1/2 bottom-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                  h-6 text-xs bg-gradient-to-r from-sky-700 to-blue-800 text-white rounded shadow-md px-3 py-1`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Use this Template
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
{(displayPath === "/resume-generation/build-from-jd" || (displayPath === "/my-profile" && beforePreviousPath === "/resume-generation/build-from-jd")) && (
  <div
    className={`border-t rounded-none bg-inherit transition-all border-sky-700 p-2 ${
      showJD ? "h-80" : "h-20"
    }`}
  >
    {!showJD && (
      <Button className="my-4 bg-gradient-to-r from-sky-700 to-blue-800 text-white rounded shadow-md w-full" onClick={() => setShowJD(true)}>
        View Job Description
      </Button>
    )}

    {showJD && (
      <div className="w-full max-w-xl mx-auto relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#2D6DA4]">
            Job Description
          </h3>
          <button onClick={() => setShowJD(false)} className="text-gray-500 hover:text-red-500 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="h-60 overflow-y-auto space-y-3 pr-2">
          <p className="text-sm text-gray-700">
            <strong className="font-bold text-gray-900">Job Title: </strong> {jobDetails?.jobTitle}
          </p>
          <p className="text-sm text-gray-700">
            <strong className="font-bold text-gray-900">Company Name: </strong> {jobDetails?.companyName}
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            <strong className="font-bold text-gray-900">Job Description: </strong> {jobDetails?.jobDescription}
          </p>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default Templates;
