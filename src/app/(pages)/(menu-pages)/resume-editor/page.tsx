"use client";

import Templates from "@/components/resume-editor/editorTemplates";
import { AIBuddy } from "@/components/resume-editor/aiBuddy";
import { useState } from "react";

const ResumeEditor = () => {
  const [showAIBuddy] = useState(false);
  return (
    <div className="">
      <div className="flex flex-row h-screen justify-around">
        {/* <Editor toggleAIBuddy={toggleAIBuddy} /> */}
        <div className="hidden sm:hidden md:block h-full border-l">
          
          {showAIBuddy ? <AIBuddy />:<Templates />}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;

