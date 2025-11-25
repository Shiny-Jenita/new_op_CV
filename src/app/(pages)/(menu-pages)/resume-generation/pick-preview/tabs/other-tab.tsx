"use client";

import type React from "react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CertificationsData,
  LanguageData,
  PublicationData,
  ResumeData,
} from "./interface";
import { BookOpen, Award, Calendar, UserRound, Barcode, Building2, Languages, BadgeCheck } from "lucide-react";

interface OtherTabProps {
  othersData: {
    languages: LanguageData[];
    publications: PublicationData[];
    certifications: CertificationsData[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function OtherTab({ othersData, setResumeData }: OtherTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("publications");

  const togglePublication = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      others: {
        ...prev.others,
        publications: prev.others.publications.map((pub, i) => {
          if (i === index) {
            const isNowVisible = !pub.visible;

            return {
              ...pub,
              visible: isNowVisible,
              descriptionVisible: isNowVisible ? pub.descriptionVisible : false,
              descriptionSentencesVisibility: isNowVisible
                ? pub.descriptionSentencesVisibility ?? Array(pub.description?.length || 0).fill(true)
                : Array(pub.description?.length || 0).fill(false),
            };
          }
          return pub;
        }),
      },
    }));
  };

  const togglePublicationDescription = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      others: {
        ...prev.others,
        publications: prev.others.publications.map((pub, i) => {
          if (i === index) {
            const newVisible = !pub.descriptionVisible;

            return {
              ...pub,
              descriptionVisible: newVisible,
              descriptionSentencesVisibility: Array(pub.description?.length || 0).fill(newVisible),
            };
          }
          return pub;
        }),
      },
    }));
  };

  const togglePublicationSentence = (pubIndex: number, sentenceIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      others: {
        ...prev.others,
        publications: prev.others.publications.map((pub, i) => {
          if (i === pubIndex) {
            const descLen = pub.description?.length || 0;
            const currentVisibility = pub.descriptionSentencesVisibility
              ? [...pub.descriptionSentencesVisibility]
              : Array(descLen).fill(true);

            // Toggle selected sentence visibility
            currentVisibility[sentenceIndex] = !currentVisibility[sentenceIndex];

            // If any sentence is checked, descriptionVisible should be true
            const anyChecked = currentVisibility.some((val) => val);

            return {
              ...pub,
              descriptionVisible: anyChecked,
              descriptionSentencesVisibility: currentVisibility,
            };
          }
          return pub;
        }),
      },
    }));
  };

  const toggleCertification = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      others: {
        ...prev.others,
        certifications: prev.others.certifications.map((cert, i) =>
          i === index ? { ...cert, visible: !cert.visible } : cert
        ),
      },
    }));
  };

  const toggleLanguage = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      others: {
        ...prev.others,
        languages: prev.others.languages.map((lang, i) =>
          i === index ? { ...lang, visible: !lang.visible } : lang
        ),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="publications" className="flex items-center gap-2">
            Publications
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            Languages
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Publications Tab */}
          <TabsContent value="publications">
            {othersData.publications.length === 0 ? (
              <div className="text-center py-6 text-gray-400 italic">
                No publications data available.
              </div>
            ) : (
              <div className="space-y-4">
                {othersData.publications.map((pub, pubIndex) => (
                  <div
                    key={pubIndex}
                    className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
                  >
                    {/* Top-level publication checkbox */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`publication-${pubIndex}`}
                        checked={pub.visible}
                        onCheckedChange={() => togglePublication(pubIndex)}
                        className="mt-1"
                        aria-label={`Toggle visibility for publication ${pubIndex + 1}`}
                      />
                      <div className={`space-y-1 ${!pub.visible ? "opacity-40 italic" : ""}`}>
                        <div className="flex items-center gap-2 font-semibold text-base text-gray-800">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          {pub.title}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {pub.publishedDate}
                        </div>

                        {pub.publisher && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                            {pub.publisher}
                          </div>
                        )}

                        {pub.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <UserRound className="w-4 h-4 text-gray-500" />
                            <span>
                              <span className="font-medium">Author(s):</span> {pub.author}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description section */}
                    {pub.description?.length > 0 && (
                      <div className="space-y-2 ml-7">
                        {/* Description toggle */}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`pub-desc-${pubIndex}`}
                            checked={pub.descriptionVisible}
                            onCheckedChange={() => togglePublicationDescription(pubIndex)}
                            className="mt-1"
                            aria-label={`Toggle visibility for publication description ${pubIndex + 1}`}
                          />
                          <label
                            htmlFor={`pub-desc-${pubIndex}`}
                            className={`flex items-center gap-2 text-sm font-semibold transition-opacity duration-300 ${
                              !pub.descriptionVisible ? "opacity-40 italic" : ""
                            }`}
                          >
                            Description
                          </label>
                        </div>

                        {/* Sentence-level toggles */}
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                          {pub.description.map((sentence, sentenceIndex) => {
                            const isVisible =
                              pub.descriptionSentencesVisibility?.[sentenceIndex] ?? true;
                            return (
                              <li
                                key={sentenceIndex}
                                className="flex items-start gap-3 transition-opacity duration-300"
                              >
                                <Checkbox
                                  id={`pub-${pubIndex}-desc-${sentenceIndex}`}
                                  checked={isVisible}
                                  onCheckedChange={() =>
                                    togglePublicationSentence(pubIndex, sentenceIndex)
                                  }
                                  className="mt-1"
                                  aria-label={`Toggle sentence ${sentenceIndex + 1} for publication ${pubIndex + 1}`}
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
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            {othersData.certifications.length === 0 ? (
              <div className="text-center py-6 text-gray-400 italic">
                No certification data available.
              </div>
            ) : (
              <div className="space-y-4">
                {othersData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
                  >
                    {/* Top-level checkbox */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`cert-${idx}`}
                        checked={cert.visible}
                        onCheckedChange={() => toggleCertification(idx)}
                        className="mt-1"
                        aria-label={`Toggle visibility for certification ${idx + 1}`}
                      />
                      <div className={`space-y-1 ${!cert.visible ? "opacity-40 italic" : ""}`}>
                        <div className="flex items-center gap-2 font-semibold text-base text-gray-800">
                          <Award className="w-4 h-4 text-gray-500" />
                          {cert.certificateName}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          {cert.issuer}
                        </div>

                        {cert.completionId && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Barcode className="w-4 h-4 text-gray-500" />
                            ID: {cert.completionId}
                          </div>
                        )}

                        {cert.date && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {cert.date}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            {othersData.languages.length === 0 ? (
              <div className="text-center py-6 text-gray-400 italic">
                No language data available.
              </div>
            ) : (
              <div className="space-y-4">
                {othersData.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="space-y-4 p-4 border rounded-xl bg-gray-50 shadow-sm"
                  >
                    {/* Language Header */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`language-${idx}`}
                        checked={lang.visible}
                        onCheckedChange={() => toggleLanguage(idx)}
                        className="mt-1"
                        aria-label={`Toggle visibility for language ${lang.name}`}
                      />
                      <div className="flex items-center gap-2 text-base text-gray-800 capitalize font-semibold">
                        <Languages className="w-4 h-4 text-gray-500" />
                        <span>
                          {lang.name}
                          <span className="ml-2 text-sm text-gray-500 font-normal">({lang.proficiency})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
