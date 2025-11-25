"use client";

import type React from "react";
import {
  GraduationCap,
  School,
  MapPin,
  Calendar,
  FlaskConical,
  BarChart2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EducationData, ResumeData } from "./interface";

interface EducationTabProps {
  educationData: EducationData[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function EducationTab({ educationData, setResumeData }: EducationTabProps) {
  const toggleEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => {
        if (i === index) {
          const newVisible = !edu.visible;

          return {
            ...edu,
            visible: newVisible,
            descriptionVisible: newVisible,
            descriptionSentencesVisibility: edu.description
              ? edu.description.map(() => newVisible)
              : [],
          };
        }
        return edu;
      }),
    }));
  };

  const toggleEducationDescription = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => {
        if (i === index) {
          const newDescVisible = !edu.descriptionVisible;

          return {
            ...edu,
            descriptionVisible: newDescVisible,
            descriptionSentencesVisibility: edu.description
              ? edu.description.map(() => newDescVisible)
              : [],
          };
        }
        return edu;
      }),
    }));
  };

  const toggleSentence = (eduIndex: number, sentenceIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => {
        if (i === eduIndex) {
          const currentVisibility = edu.descriptionSentencesVisibility
            ? [...edu.descriptionSentencesVisibility]
            : Array(edu.description.length).fill(true);

          currentVisibility[sentenceIndex] = !currentVisibility[sentenceIndex];

          const allUnchecked = currentVisibility.every((v) => !v);

          return {
            ...edu,
            descriptionVisible: !allUnchecked,
            descriptionSentencesVisibility: currentVisibility,
          };
        }
        return edu;
      }),
    }));
  };

  return (
    <div className="space-y-6">
      {educationData.length === 0 ? (
        <div className="text-center py-6 text-gray-400 italic">
          No education data available.
        </div>
      ) : (
        <div className="space-y-4">
          {educationData.map((education, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
            >
              {/* Education Header */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`education-${index}`}
                  checked={education.visible}
                  onCheckedChange={() => toggleEducation(index)}
                  className="mt-1"
                  aria-label={`Toggle visibility for education item ${index + 1}`}
                />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-base text-gray-800">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    {education.level} in {education.major}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <School className="w-4 h-4 text-gray-500" />
                    {education.university}
                  </div>

                  {education.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {education.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {education.date}
                  </div>

                  {education.specialization && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FlaskConical className="w-4 h-4 text-gray-500" />
                      <span>
                        <span className="font-medium">Specialization:</span>{" "}
                        {education.specialization}
                      </span>
                    </div>
                  )}
                 {education.score && education.score.length > 0 && (
  <div>
    {education.score.map((scoreItem, index) => (
      scoreItem.value ? (
        <p key={index} className="text-sm text-gray-500">
          <span className="font-medium">GPA/CGPA: </span> {scoreItem.value}
        </p>
      ) : null
    ))}
  </div>
)}
                </div>
              </div>


              {/* Description Section */}
              {education.description?.length > 0 && (
                <div className="space-y-2 ml-7">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`education-desc-${index}`}
                      checked={education.descriptionVisible}
                      onCheckedChange={() => toggleEducationDescription(index)}
                      className="mt-1"
                      aria-label={`Toggle visibility for education description ${index + 1}`}
                    />
                    <label
                      htmlFor={`education-desc-${index}`}
                      className={`flex items-center gap-2 text-sm font-semibold transition-opacity duration-300 ${
                        !education.descriptionVisible ? "opacity-40 italic" : ""
                      }`}
                    >
                      Description
                    </label>
                  </div>

                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {education.description.map((sentence, sentenceIndex) => {
                      const isVisible =
                        education.descriptionSentencesVisibility?.[sentenceIndex] ?? true;
                      return (
                        <li
                          key={sentenceIndex}
                          className="flex items-start gap-3 transition-opacity duration-300"
                        >
                          <Checkbox
                            id={`education-${index}-desc-${sentenceIndex}`}
                            checked={isVisible}
                            onCheckedChange={() =>
                              toggleSentence(index, sentenceIndex)
                            }
                            className="mt-1"
                            aria-label={`Toggle sentence ${sentenceIndex + 1} for education ${index + 1}`}
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