"use client";
import { Button } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const aiMessages = [
  "Reading your resume...",
  "Extracting experience and skills...",
  "Scanning education history...",
  "Enhancing your profile...",
];

const Uploadresume = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  if (file && uploadStatus === "idle") {
    const timer = setTimeout(() => {
      uploadFile();
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [file, uploadStatus]);


  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (uploadStatus === "uploading") {
      messageInterval = setInterval(() => {
        setAiMessageIndex((prev) => (prev + 1) % aiMessages.length);
      }, 2000);
    }

    return () => clearInterval(messageInterval);
  }, [uploadStatus]);

  const simulateProgress = (): Promise<void> => {
    return new Promise((resolve) => {
      const steps = [10, 20, 45, 55, 65, 75, 85, 95];
      let index = 0;

      progressInterval.current = setInterval(() => {
        setUploadProgress(steps[index]);
        index++;
        if (index >= steps.length) {
          clearInterval(progressInterval.current!);
          resolve();
        }
      }, 2000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("uploading");
    setUploadProgress(0);
    await simulateProgress();

    try {
      await api.post("/profile/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadProgress(100);

      setTimeout(() => {
        setUploadStatus("success");
        setTimeout(() => router.push("/create-new-profile"), 1300);
      }, 600);
    } catch (error) {
      clearInterval(progressInterval.current!);
      setUploadStatus("error");
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else {
        setErrorMessage("An unknown error occurred during upload");
      }
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");
    setAiMessageIndex(0);
    clearInterval(progressInterval.current!);
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      <div className="relative w-1/2 h-full hidden md:block">
        <Image
          src="/left.svg"
          alt="Background"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
      </div>

      <div className="w-full max-w-2xl mx-auto p-6 flex flex-col justify-center">
        <h1 className="text-3xl font-medium text-sky-700 mb-5">
          Add Resume or Manually Start
        </h1>

        {uploadStatus === "success" ? (
          <Card className="border-2 border-green-200 bg-green-50 rounded-md p-6 mb-6">
            <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                Upload Successful!
              </h2>
              <p className="text-green-600 mb-6">
                Your resume has been uploaded successfully.
              </p>
            </CardContent>
          </Card>
        ) : uploadStatus === "uploading" ? (
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
              <p className="text-sky-700 font-medium">
                {uploadProgress}% Complete
              </p>
              <p className="text-sm text-sky-700 mt-2">
                Processing {file?.name}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card
            className={`border-2 border-dashed rounded-md mb-8 ${
              isDragging
                ? "border-sky-700 bg-sky-50"
                : uploadStatus === "error"
                ? "border-red-300 bg-red-50"
                : "border-sky-700"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
              {uploadStatus === "error" ? (
                <>
                  <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-xl font-semibold text-red-700 mb-2">
                    Upload Failed
                  </h2>
                  <p className="text-red-600 mb-6">{errorMessage}</p>
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  {file ? (
                    <div className="flex items-center mb-4">
                      <FileText className="h-12 w-12 text-sky-700 mr-3" />
                      <div className="text-left">
                        <p className="font-medium text-slate-800 truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base text-slate-700 mb-0">
                      Drag your resume file to start uploading
                    </p>
                  )}

                  {!file && (
                    <>
                      <div className="flex items-center my-6 w-full justify-center">
                        <div className="flex w-20 border-t border-slate-300"></div>
                        <span className="mx-4 text-sm text-gray-400 uppercase font-medium">
                          OR
                        </span>
                        <div className="flex w-20 border-t border-slate-300"></div>
                      </div>

                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="inline-flex h-10 items-center justify-center rounded-md bg-white border-2 hover:text-white text-sky-700 border-sky-700 px-4 py-2 text-sm font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2">
                          Browse files
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>

                      <p className="text-sm text-slate-500 mt-2">
                        Browse the files in your computer to upload
                      </p>
                    </>
                  )}

                  {/* 2️⃣ Remove the manual “Upload Resume” button completely.
                      The useEffect above will call uploadFile() as soon as `file` is set. */}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          variant="default"
          onClick={() => router.push("/create-new-profile")}
          disabled={uploadStatus === "uploading"}
        >
          Manual Profile Creation
          <Upload className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Uploadresume;
