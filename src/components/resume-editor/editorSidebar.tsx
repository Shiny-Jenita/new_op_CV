import React, { useState, useEffect, RefObject } from "react";
import Image from "next/image";

interface SideToolbarProps {
  contentRef: RefObject<HTMLDivElement>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Sidetoolbar: React.FC<SideToolbarProps> = ({ contentRef, currentPage, totalPages, setCurrentPage }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (contentRef.current?.parentElement) {
      const pagesCount = contentRef.current.parentElement.children.length;
      if (pagesCount !== totalPages) {
        setCurrentPage(Math.min(currentPage, pagesCount));
      }
    }
  }, [contentRef, totalPages, setCurrentPage, currentPage]);

  const handleZoom = (type: "in" | "out") => {
    const newZoom = type === "in" ? Math.min(zoomLevel + 0.1, 2) : Math.max(zoomLevel - 0.1, 0.5);
    setZoomLevel(newZoom);

    if (contentRef.current) {
      contentRef.current.style.transform = `scale(${newZoom})`;
      contentRef.current.style.transformOrigin = "top center";
    }
  };

  return (
    <div className="flex flex-col justify-between items-center bg-[#2D6DA4] h-full p-2">
      <div className="flex flex-col items-center gap-2 mt-auto mb-4">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Image
            src="/zoom-in.svg"
            alt="zoom-in"
            width={25}
            height={25}
            onClick={() => handleZoom("in")}
            className="cursor-pointer"
          />
          <Image
            src="/zoom-out.svg"
            alt="zoom-out"
            width={25}
            height={25}
            onClick={() => handleZoom("out")}
            className="cursor-pointer"
          />
        </div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            className={`w-8 h-8 rounded-sm flex items-center justify-center ${
              pageNum === currentPage ? "bg-white text-[#2D6DA4] font-semibold" : "text-white hover:bg-[#4080B8]"
            }`}
            onClick={() => setCurrentPage(pageNum)}
          >
            {String(pageNum).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidetoolbar;
