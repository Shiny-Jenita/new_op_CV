"use client";

import type React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ResumeData, SkillsData } from "./interface";
import { Sparkles } from "lucide-react";

interface SkillsTabProps {
  skillsData: SkillsData[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function SkillsTab({ skillsData, setResumeData }: SkillsTabProps) {
  const isAnySelected = skillsData.some((skill) => skill.visible);

  const toggleSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, visible: !skill.visible } : skill
      ),
    }));
  };

const toggleAllSkills = () => {
  const isAnySelected = skillsData.some((skill) => skill.visible);
  setResumeData((prev) => ({
    ...prev,
    skills: prev.skills.map((skill) => ({
      ...skill,
      visible: !isAnySelected, // If any are selected, uncheck all; else check all
    })),
  }));
};

  return (
    <div className="overflow-y-auto space-y-4 max-h-64">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="selectAllSkills"
          checked={isAnySelected}
          onCheckedChange={toggleAllSkills}
          className="mt-1"
          aria-label="Toggle all skills"
        />
        <label
          htmlFor="selectAllSkills"
          className="flex items-center gap-2 text-lg font-semibold text-gray-800"
        >
          <Sparkles className="w-4 h-4 text-gray-500" />
          Skills
        </label>
      </div>

      <p className="text-sm text-gray-500 italic">
        Selecting 10-15 core skills is recommended. These will be prioritized in your resume.
      </p>

      {/* Conditional content */}
      {skillsData.length === 0 ? (
        <div className="text-center py-6 text-gray-400">No skills data available.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pl-1">
          {skillsData.map((skill, index) => (
            <div key={index} className="flex items-start gap-3">
              <Checkbox
                id={`skill-${index}`}
                checked={skill.visible}
                onCheckedChange={() => toggleSkill(index)}
                className="mt-1"
                aria-label={`Toggle skill ${skill.name}`}
              />
              <label
                htmlFor={`skill-${index}`}
                className={`text-sm font-medium transition-opacity duration-300 ${
                  skill.visible ? "text-gray-700" : "text-gray-500 opacity-50 italic"
                }`}
              >
                {skill.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
