"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResumeSaveStore } from "@/stores/resume/resumeSaveStore";
import { useResumeStore } from "@/stores/resume/resumeStore";
import { useJDStore } from "@/stores/resume/jdStore";
import { usePreviousPath } from "@/previouspathcontext";
import { toast, ToastContainer } from "react-toastify";
import { renameResume } from "@/api/resume";
const GeneratedResumes = () => {
  const { savedResumes, fetchSavedResumes, deleteResume, setCurrentResume } =
    useResumeSaveStore((state) => state);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");
  const [resumeData, setResumeData] = useState<
    {
      id: string;
      createdAt: string;
      name: string;
      html: string;
      jdData: {
        jobTitle: string;
        companyName: string;
        jobDescription: string;
      };
    }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clickedResumeId, setClickedResumeId] = useState<string | null>(null);
  const [clickedResumeIds, setClickedResumeIds] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const { previousPath } = usePreviousPath();

  const { jobDetails } = useJDStore();

  const { generateResumeFromProfile } = useResumeStore((state) => state);
  const fetchFn = useResumeSaveStore(state => state.fetchSavedResumes);

  useEffect(() => {

    fetchFn();
  }, []);

  useEffect(() => {
    if (Array.isArray(savedResumes) && savedResumes.length > 0) {
      console.log("Saved resumes:", savedResumes);
      const formattedResumes = savedResumes.map((resume) => ({
        id: resume.id,
        name: resume.resumeName,
        html: resume.htmlContent || resume.html || "",
        createdAt: new Date(resume.createdAt).toLocaleDateString(),
        jdData: resume.jdData
          ? {
            jobTitle: resume.jdData.jobTitle || "N/A",
            companyName: resume.jdData.companyName || "N/A",
            jobDescription: resume.jdData.jobDescription || "N/A",
          }
          : null,
      }));
      setResumeData(formattedResumes);
      console.log("Formatted resumes:", formattedResumes);
    } else {
      setResumeData([]);
    }
  }, [savedResumes]);

  const handleSelectResume = async (resume: { id: string }) => {
    if (clickedResumeIds.has(resume.id)) {
      return;
    }
    setClickedResumeIds((prev) => new Set([...prev, resume.id]));

    try {
      if (previousPath === "/resume-generation/build-from-jd") {
        const payload = {
          job_description: jobDetails,
          resumeId: resume.id,
        };

        const response = await generateResumeFromProfile(payload);

        if (typeof response === "string") {
          toast.error(response);
          setClickedResumeIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(resume.id);
            return newSet;
          });
          return;
        }

        router.push(
          `/resume-generation/generate-from-profile?resumeId=${resume.id}`
        );
      } else {
        setCurrentResume(resume.id);

        const selectedResume = useResumeSaveStore
          .getState()
          .savedResumes.find((r) => r.id === resume.id);

        if (selectedResume) {
          useResumeStore.getState().setResumeFromSaved({
            html: selectedResume.htmlContent,
            resumeUrl: selectedResume.resumeUrl,
            resumeName: selectedResume.resumeName,
            json: selectedResume.resume_json,
          });
        }
        router.push(
          `/resume-generation/generate-from-profile?resumeId=${resume.id}`
        );
      }
    } catch (error: any) {
      console.error("Error selecting resume:", error);

      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Failed to select resume."
      );

      setClickedResumeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resume.id);
        return newSet;
      });
    }
  };

  const previouslyUsedJD = [
    {
      date: "12/01/2025",
      title: "Job Title",
      company: "Company Name",
      description: "Description Details",
    },
    {
      date: "2/10/2024",
      title: "Job Title",
      company: "Company Name",
      description: "Description Details",
    },
    {
      date: "2/10/2024",
      title: "Job Title",
      company: "Company Name",
      description: "Description Details",
    },
    {
      date: "17/08/2024",
      title: "Job Title",
      company: "Company Name",
      description: "Description Details",
    },
  ];

  const openRenameModal = (resume: any) => {
    setSelectedResume(resume);
    setNewResumeName(resume.name);
    setIsRenameModalOpen(true);
    setMenuOpen(null);
  };

  const openDeleteModal = (resume: any) => {
    setSelectedResume(resume);
    setIsDeleteModalOpen(true);
    setMenuOpen(null);
  };

  const handleViewResume = (resume: any) => {
    setSelectedResume(resume);
    setShowPdfViewer(true);
  };

  const handleRenameResume = () => {
    if (selectedResume && newResumeName.trim()) {
      renameResume(selectedResume.id, newResumeName.trim());

      setResumeData((prevData) =>
        prevData.map((resume) =>
          resume.id === selectedResume.id
            ? { ...resume, name: newResumeName.trim() }
            : resume
        )
      );

      setIsRenameModalOpen(false);
    }
  };

  const handleDeleteResume = () => {
    if (selectedResume) {
      deleteResume(selectedResume.id);
      setResumeData((prevData) =>
        prevData.filter((resume) => resume.id !== selectedResume.id)
      );
    }
    setIsDeleteModalOpen(false);
  };

  const createResumePreview = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const name =
      tempDiv.querySelector("h1.text-xl")?.textContent?.trim() || "Resume";
    return {
      previewHtml: `<div class="scale-[0.25] transform origin-top-left w-[400%] h-[600%] overflow-hidden">${html}</div>`,
      name: name,
    };
  };

  return (
    <>
      <ToastContainer />
      <div className="min-w-screen">
        {resumeData.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center">
            <p className="text-gray-500 mb-2">No saved resumes on file.</p>
            <Button
              className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 rounded-lg shadow-md px-4 py-2"
              onClick={() => router.push("/resume-generation")}
            >
              Create New Resume
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
            {resumeData.map((resume) => (
              <div
                key={resume.id}
                className="relative flex flex-col items-center"
              >
                <div className="relative max-w-[140px] w-full mx-auto rounded-xl shadow-md bg-white p-3 cursor-pointer group">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-all z-20"
                    onClick={() =>
                      setMenuOpen(menuOpen === resume.id ? null : resume.id)
                    }
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen === resume.id && (
                    <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg py-2 w-32 z-10 border">
                      <button
                        onClick={() => openRenameModal(resume)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => openDeleteModal(resume)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Resume Preview */}
                  <div
                    className="h-40 bg-white rounded-md flex items-center justify-center overflow-hidden relative"
                    onClick={() => {
                      setSelectedResume(resume);
                      setShowPdfViewer(true);
                    }}
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: createResumePreview(resume.html).previewHtml,
                      }}
                    />

                    <Button
                      disabled={clickedResumeIds.has(resume.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectResume(resume);
                      }}
                      className="absolute h-5 left-1/2 bottom-0 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
    bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {clickedResumeIds.has(resume.id)
                        ? "Processing..."
                        : "Edit Resume"}
                    </Button>
                  </div>
                </div>

                {/* Resume Name */}
                <div className="mt-2 text-center text-gray-700 font-medium text-sm truncate w-full px-2">
                  {resume.name}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center mt-8">
          <h3 className="text-xl font-bold text-sky-700">
            Previously Used Job Description
          </h3>
          <div className="flex-1 border-t-2 border-sky-700 ml-4"></div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-sky-700">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border-b border-sky-700">
                {[
                  "Date Created",
                  "Job Title",
                  "Company",
                  "Description",
                  "Action",
                ].map((header) => (
                  <th key={header} className="py-3 px-4 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resumeData
                .filter(
                  (jd) =>
                    jd.jdData &&
                    jd.jdData.jobTitle &&
                    jd.jdData.jobTitle !== "N/A"
                )
                .map((jd, index) => (
                  <tr
                    key={index}
                    className="border-b border-sky-700 hover:bg-gray-100 text-gray-800"
                  >
                    <td className="py-2 px-4">{jd.createdAt}</td>
                    <td className="py-2 px-4">
                      {jd.jdData?.jobTitle || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {jd.jdData?.companyName || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {jd.jdData?.jobDescription || "N/A"}
                    </td>
                    <td className="py-1 px-3 text-center">
                      <button
                        className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 rounded-lg shadow-md px-4 py-2 
                        items-center flex"
                        onClick={() => handleViewResume(jd)}
                      >
                        View Resume
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedResume?.name || "Resume Preview"}
              </DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded p-4 h-[80vh] overflow-auto">
              {selectedResume && (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedResume.html }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Resume</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newResumeName}
                onChange={(e) => setNewResumeName(e.target.value)}
                placeholder="Enter new name"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRenameModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameResume}
                className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Resume</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete "{selectedResume?.name}"? This
                action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteResume}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default GeneratedResumes;
