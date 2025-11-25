import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ChevronDown, ChevronUp, Lock, Loader2 } from "lucide-react";
import { downloadResumeDOCX, downloadResumePDF } from "@/api/resume";

interface DownloadDropdownProps {
  html?: string;
}

const DownloadDropdown = ({ html }: DownloadDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  const handleDownload = async (format: string) => {
    const payload = JSON.stringify({ html });
    console.log("Payload (stringified):", JSON.stringify(payload));

    setIsLoading(true);
    setLoadingFormat(format);

    try {
      let downloadUrl: string;
      
      if (format === "pdf") {
        const { pdfUrl } = await downloadResumePDF(payload);
        downloadUrl = pdfUrl;
      } else if (format === "docx") {
        const { docxUrl } = await downloadResumeDOCX(payload);
        downloadUrl = docxUrl;
      } else {
        throw new Error("Unsupported format");
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `resume.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Error downloading ${format.toUpperCase()}:`, err);
    } finally {
      setIsLoading(false);
      setLoadingFormat(null);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 px-2 py-2 rounded-md bg-gradient-to-r from-sky-700 to-blue-800 text-white shadow-md md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image src="/download.svg" alt="Download" width={20} height={20} />
          )}
          {/* {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />} */}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-[180px] space-y-2 bg-gradient-to-r from-sky-700 to-blue-800 p-2"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-3 bg-[#FFF4D4] hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleDownload("pdf")}
          disabled={isLoading}
        >
          {isLoading && loadingFormat === "pdf" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Downloading PDF...</span>
            </>
          ) : (
            <span>Download as PDF</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-3 bg-[#FFF4D4] hover:bg-[#FFE7A3] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleDownload("docx")}
          disabled={isLoading}
        >
          {isLoading && loadingFormat === "docx" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Downloading Docx...</span>
            </>
          ) : (
            <>
              <span>Download as Docx</span>
              <Lock className="h-5 w-5" />
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadDropdown;