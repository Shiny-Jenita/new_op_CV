"use client";

import type React from "react";
import { Briefcase, Building, MapPin, Calendar } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox";
import { ExperienceData, ResumeData } from "./interface";

interface ExperienceTabProps {
  experienceData: ExperienceData[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ExperienceTab({ experienceData, setResumeData }: ExperienceTabProps) {
  const toggleExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => {
        if (i === index) {
          const newVisible = !exp.visible;
          return {
            ...exp,
            visible: newVisible,
            descriptionVisible: newVisible,
            descriptionSentencesVisibility: exp.description?.map(() => newVisible) ?? [],
          };
        }
        return exp;
      }),
    }));
  };

  const toggleDescription = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => {
        if (i === index) {
          const newVisible = !exp.descriptionVisible;
          return {
            ...exp,
            descriptionVisible: newVisible,
            descriptionSentencesVisibility: exp.description?.map(() => newVisible) ?? [],
          };
        }
        return exp;
      }),
    }));
  };

  const toggleSentence = (expIndex: number, sentenceIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => {
        if (i === expIndex) {
          const currentVisibility = exp.descriptionSentencesVisibility
            ? [...exp.descriptionSentencesVisibility]
            : Array(exp.description?.length ?? 0).fill(true);

          currentVisibility[sentenceIndex] = !currentVisibility[sentenceIndex];

          const allUnchecked = currentVisibility.every((v) => !v);

          return {
            ...exp,
            descriptionSentencesVisibility: currentVisibility,
            descriptionVisible: !allUnchecked,
          };
        }
        return exp;
      }),
    }));
  };

  return (
  <div className="space-y-6">
    {experienceData.length === 0 ? (
      <div className="text-center py-6 text-gray-400 italic">
        No experience data available.
      </div>
    ) : (
      <div className="space-y-4">
        {experienceData.map((experience, index) => (
          <div
            key={index}
            className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
          >
            {/* Top-level Experience Toggle */}
            <div className="flex items-start gap-3">
              <Checkbox
                id={`experience-${index}`}
                checked={experience.visible}
                onCheckedChange={() => toggleExperience(index)}
                className="mt-1"
                aria-label={`Toggle visibility for experience at ${experience.company}`}
              />
              <div
                className={`space-y-1 transition-opacity duration-300 ${
                  !experience.visible ? "opacity-40 italic" : "text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-base">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  {experience.position}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-gray-500" />
                  {experience.company}
                </div>
                {experience.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {experience.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {experience.date}
                </div>
              </div>
            </div>

            {/* Description Section */}
            {experience.description && experience.description.length > 0 && (
              <div className="space-y-2 ml-7">
                {/* Description Toggle */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`experience-desc-${index}`}
                    checked={experience.descriptionVisible}
                    onCheckedChange={() => toggleDescription(index)}
                    className="mt-1"
                    aria-label={`Toggle description visibility for experience at ${experience.company}`}
                  />
                  <label
                    htmlFor={`experience-desc-${index}`}
                    className={`text-sm font-semibold transition-opacity duration-300 ${
                      !experience.descriptionVisible ? "opacity-40 italic" : ""
                    }`}
                  >
                    Description
                  </label>
                </div>

                {/* Sentence-level Description Items */}
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  {experience.description.map((sentence, sentenceIndex) => {
                    const isVisible =
                      experience.descriptionSentencesVisibility?.[sentenceIndex] ?? true

                    return (
                      <li
                        key={sentenceIndex}
                        className={`flex items-start gap-3 transition-opacity duration-300 ${
                          !isVisible ? "opacity-40 italic" : ""
                        }`}
                      >
                        <Checkbox
                          id={`experience-${index}-desc-${sentenceIndex}`}
                          checked={isVisible}
                          onCheckedChange={() =>
                            toggleSentence(index, sentenceIndex)
                          }
                          className="mt-1"
                          aria-label={`Toggle visibility for sentence ${sentenceIndex + 1}`}
                        />
                        <span>{sentence.trim()}</span>
                      </li>
                    )
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