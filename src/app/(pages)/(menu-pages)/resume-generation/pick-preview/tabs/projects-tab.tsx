"use client";

import type React from "react";
import { FolderKanban } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectData, ResumeData } from "./interface";

interface ProjectsTabProps {
  projectsData: ProjectData[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ProjectsTab({ projectsData, setResumeData }: ProjectsTabProps) {
  const toggleProject = (index: number) => {
  setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => {
        if (i === index) {
          const newVisible = !proj.visible;

          // Handle descriptionVisible and descriptionSentencesVisibility
          const newDescriptionVisible = newVisible; // mirror project visibility
          const newSentencesVisibility = proj.projectDescription
            ? proj.projectDescription.map(() => newVisible)
            : [];

          return {
            ...proj,
            visible: newVisible,
            descriptionVisible: newDescriptionVisible,
            descriptionSentencesVisibility: newSentencesVisibility,
          };
        }
        return proj;
      }),
    }));
  };

  const toggleDescription = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => {
        if (i === index) {
          const newDescriptionVisible = !proj.descriptionVisible;
          let newSentencesVisibility = proj.descriptionSentencesVisibility;

          if (proj.projectDescription) {
            newSentencesVisibility = proj.projectDescription.map(() => newDescriptionVisible);
          }

          return {
            ...proj,
            descriptionVisible: newDescriptionVisible,
            descriptionSentencesVisibility: newSentencesVisibility,
          };
        }
        return proj;
      }),
    }));
  };

  const toggleSentence = (projIndex: number, sentenceIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => {
        if (i === projIndex) {
          const currentVisibility = proj.descriptionSentencesVisibility
            ? [...proj.descriptionSentencesVisibility]
            : Array(proj.projectDescription?.length ?? 0).fill(true);

          currentVisibility[sentenceIndex] = !currentVisibility[sentenceIndex];

          const allUnchecked = currentVisibility.every((v) => !v);

          return {
            ...proj,
            descriptionVisible: !allUnchecked,
            descriptionSentencesVisibility: currentVisibility,
          };
        }
        return proj;
      }),
    }));
  };

  return (
  <div className="space-y-6">
    {projectsData.length === 0 ? (
      <div className="text-center py-6 text-gray-400 italic">
        No projects data available.
      </div>
    ) : (
      <div className="space-y-4">
        {projectsData.map((project, index) => (
          <div
            key={index}
            className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
          >
            {/* Top-level project checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id={`project-${index}`}
                checked={project.visible}
                onCheckedChange={() => toggleProject(index)}
                className="mt-1"
                aria-label={`Toggle visibility for project ${index + 1}`}
              />
              <div className="flex items-center gap-2 font-semibold text-base text-gray-800">
                <FolderKanban className="w-4 h-4 text-gray-500" />
                {project.projectName}
              </div>
            </div>

            {/* Description section */}
            {project.projectDescription && project.projectDescription.length > 0 && (
              <div className="space-y-2 ml-7">
                {/* Description toggle */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`project-desc-${index}`}
                    checked={project.descriptionVisible}
                    onCheckedChange={() => toggleDescription(index)}
                    className="mt-1"
                    aria-label={`Toggle visibility for project description ${index + 1}`}
                  />
                  <label
                    htmlFor={`project-desc-${index}`}
                    className={`flex items-center gap-2 text-sm font-semibold transition-opacity duration-300 ${
                      !project.descriptionVisible ? "opacity-40 italic" : ""
                    }`}
                  >
                    Description
                  </label>
                </div>

                {/* Sentence-level toggles */}
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {project.projectDescription.map((sentence, sentenceIndex) => {
                    const isVisible =
                      project.descriptionSentencesVisibility?.[sentenceIndex] ?? true;
                    return (
                      <li
                        key={sentenceIndex}
                        className="flex items-start gap-3 transition-opacity duration-300"
                      >
                        <Checkbox
                          id={`project-${index}-desc-${sentenceIndex}`}
                          checked={isVisible}
                          onCheckedChange={() =>
                            toggleSentence(index, sentenceIndex)
                          }
                          className="mt-1"
                          aria-label={`Toggle sentence ${sentenceIndex + 1} for project ${index + 1}`}
                        />
                        <span
                          className={`text-sm text-gray-700 ${
                            !isVisible ? "opacity-40 italic" : ""
                          }`}
                        >
                          {sentence.trim()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
  );
}