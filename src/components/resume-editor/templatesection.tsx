"use client";

import Templates from "@/components/resume-editor/editorTemplates";

const TemplatesSection = () => {
  return (
    <div className="hidden lg:flex w-[300px] xl:w-[350px] h-full border-l">
      <Templates />
    </div>
  );
};

export default TemplatesSection;