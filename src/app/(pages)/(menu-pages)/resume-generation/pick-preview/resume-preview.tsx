"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { ResumeData } from "./tabs/interface";
import { useResumeStore } from "@/stores/resume/resumeStore";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { profile, experiences, education, skills, projects, others } = resumeData;
  const setResumeJson     = useResumeStore((s) => s.setResumeJson);
  const A4_WIDTH_PX = 660;
  const A4_HEIGHT_PX = 1123;
  const PAGE_MARGIN_PX = 40;
  const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2;

  const setGeneratedHtml = useResumeStore((s) => s.setGeneratedHtml);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(1);

const allSections = useMemo(() => (
  <div className="max-w-3xl mx-auto bg-white text-gray-900 font-garamond leading-none">
    {/* PROFILE */}
    <div key="profile" className="text-center mb-4">
      {profile.visible?.name && profile.name && (
        <h1 className="text-2xl font-bold uppercase">{profile.name}</h1>
      )}
      <p className="text-sm mt-1">
        {profile.visible?.location && profile.location}
        {profile.visible?.phone && ` | ${profile.phone}`}
        {profile.visible?.email && ` | ${profile.email}`}
        {profile.visible?.websites && profile.websites.length > 0 && (
          <>
            {" | "}
            {profile.websites
              .filter((_, i) => profile.websitesVisible?.[i])
              .map((w, i) => (
                <span key={i}>
                  {i > 0 && " | "}
                  <a href={w.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {w.url}
                  </a>
                </span>
              ))}
          </>
        )}
      </p>
    </div>

    {/* SUMMARY */}
    {profile.visible?.summary && profile.summary && (
      <section className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-1">SUMMARY</h2>
        <p className="text-md leading-relaxed">{profile.summary}</p>
      </section>
    )}

    {/* EXPERIENCE */}
    {experiences.some(e => e.visible) && (
      <section key="experience" className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-2">EXPERIENCE</h2>
        <div className="space-y-4">
          {experiences.filter(e => e.visible).map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <span className="font-bold">{exp.company}</span>
                <span className="text-md">{exp.date}</span>
              </div>
             <div className="flex justify-between text-md">
  <p>{exp.position}</p>
  {exp.location && <p className="">{exp.location}</p>}
</div>
              {exp.descriptionVisible && exp.description && (
                <ul className="list-disc pl-5 space-y-1">
                  {exp.description.map((line, j) =>
                    exp.descriptionSentencesVisibility?.[j] ? (
                      <li key={j} className="text-sm">{line}</li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* EDUCATION */}
    {education.some(e => e.visible) && (
      <section key="education" className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-2">EDUCATION</h2>
        <div className="space-y-4">
          {education.filter(e => e.visible).map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <span className="font-bold">{edu.university}</span>
                <span className="text-md">{edu.date}</span>
              </div>
             <div className="flex justify-between text-md">
  <span>{edu.level} in {edu.major}</span>
  {edu.location && <span className="">{edu.location}</span>}
</div>

              {edu.specialization && <div>{edu.specialization}</div>}
              {edu.descriptionVisible && edu.description && (
                <ul className="list-disc pl-5 space-y-1">
                  {edu.description.map((line, j) =>
                    edu.descriptionSentencesVisibility?.[j] ? (
                      <li key={j} className="text-sm">{line}</li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* PROJECTS */}
    {projects.some(p => p.visible) && (
      <section key="projects" className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-2">PROJECTS</h2>
        <div className="space-y-4">
          {projects.filter(p => p.visible).map((pr, i) => (
            <div key={i}>
              <strong>{pr.projectName}</strong>
              {pr.descriptionVisible && pr.projectDescription && (
                <ul className="list-disc pl-5 space-y-1">
                  {pr.projectDescription.map((line, j) =>
                    pr.descriptionSentencesVisibility?.[j] ? (
                      <li key={j} className="text-sm">{line}</li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* PUBLICATIONS */}
    {others.publications.some(p => p.visible) && (
      <section key="publications" className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-2">PUBLICATIONS</h2>
        <ul className="list-disc pl-5 space-y-1">
          {others.publications.filter(p => p.visible).map((pub, i) => {
            const parts = [
              pub.author,
              pub.title,
              pub.url && (
                <a key="u" href={pub.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                  {pub.url}
                </a>
              )
            ].filter(Boolean);
            return <li key={i} className="text-sm">{parts.reduce((prev, cur) => [prev, " , ", cur])}</li>;
          })}
        </ul>
      </section>
    )}

    {/* CERTIFICATIONS */}
  {others.certifications.some(c => c.visible) && (
  <section key="certifications" className="mb-3">
    <h2 className="font-bold border-b border-black pb-1 mb-2">CERTIFICATES</h2>
    <ul className="list-disc pl-5 space-y-1">
      {others.certifications.filter(c => c.visible).map((cert, i) => {
        const parts = [];
        if (cert.name) parts.push(cert.name);
        if (cert.issuer) parts.push(`Issuer: ${cert.issuer}`);
        if (cert.completionId) parts.push(`ID: ${cert.completionId}`);
        if (cert.url) parts.push(
          <a key="u" href={cert.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            Link
          </a>
        );
        if (cert.date) parts.push(cert.date);

        return (
          <li key={i} className="text-sm">
            {parts.reduce((prev, curr) => [prev, " | ", curr])}
          </li>
        );
      })}
    </ul>
  </section>
)}


    {/* SKILLS & LANGUAGES */}
    {(skills.some(s => s.visible) || others.languages.some(l => l.visible)) && (
      <section key="skills" className="mb-3">
        <h2 className="font-bold border-b border-black pb-1 mb-2">SKILLS</h2>
        {skills.some(s => s.visible) && (
          <p className="text-md mb-1">
            <strong>Technical Skills:</strong> {skills.filter(s => s.visible).map(s => s.name).join(", ")}
          </p>
        )}
        {others.languages.some(l => l.visible) && (
          <p className="text-md capitalize">
            <strong>Languages:</strong> {others.languages.filter(l => l.visible).map(l => l.name).join(", ")}
          </p>
        )}
      </section>
    )}
  </div>
), [profile, experiences, education, projects, skills, others]);
  
useEffect(() => {
    // 1) Build the JSON
    const generatedJson = {
      profile: {
        name:    profile.visible?.name    ? profile.name    : "",
        email:   profile.visible?.email   ? profile.email   : "",
        phone:   profile.visible?.phone   ? profile.phone   : "",
        designation:   profile.visible?.designation   ? profile.designation   : "",
        location:profile.visible?.location? profile.location: "",
        websites:profile.visible?.websites? profile.websites: [],
        summary: profile.visible?.summary ? profile.summary : "",
      },
      experiences: experiences
        .filter((e) => e.visible)
        .map((exp) => ({
          company:     exp.company,
          position:    exp.position,
          location:exp.location,
          date:        exp.date,
          description: exp.descriptionVisible ? exp.description : [],
        })),
education:(education || [])
.filter((edu) => edu.visible)
.map((edu) => ({
  university: edu.university,
  level: edu.level,
  major: edu.major,
  specialization: edu.specialization,
  location:edu.location,
  date: edu.date, // Make sure this is already formatted
 score: (edu.score || []).reduce((acc, s) => {
  if (s.value != null && s.value.toString().trim() !== '') {
    const num = parseFloat(s.value);
    acc[s.type] = isNaN(num) ? s.value : num;
  }
  return acc;
}, {}),
  description: edu.descriptionVisible ? edu.description : [],
})),
      
      projects: projects
        .filter((p) => p.visible)
        .map((proj) => ({
          projectName:        proj.projectName,
          projectDescription: proj.descriptionVisible ? proj.projectDescription : [],
        })),
      skills: skills
        .filter((s) => s.visible)
        .map((s) => ({ name: s.name })),
      others: {
        languages: others.languages
          .filter((l) => l.visible)
          .map((l) => ({ name: l.name })),
        certifications: others.certifications
          .filter((c) => c.visible)
          .map((c) => ({
            certificateName:         c.certificateName,
            issuer:c.issuer,
            completionId: c.completionId,
            date:         c.date,
            url:c.url
          })),
          publications: (others.publications || [])
  .filter(pub => pub.visible)
  .map(pub => ({
    title: pub.title,
    publisher: pub.publisher,
    publishedDate: pub.publishedDate,
    year: pub.year,
    publisherUrl: pub.publisherUrl,
    author: pub.author,
    description: pub.descriptionVisible ? pub.description : [],
  })),

      },
    };
    setResumeJson(generatedJson);
    const html = ReactDOMServer.renderToStaticMarkup(allSections);
    setGeneratedHtml(html);
    if (hiddenRef.current) {
      const totalH = hiddenRef.current.scrollHeight;
      setNumPages(Math.ceil(totalH / CONTENT_HEIGHT_PX));
    }
  }, [
    allSections,
    profile,
    experiences,
    education,
    projects,
    skills,
    others,
    setResumeJson,
    setGeneratedHtml,
    CONTENT_HEIGHT_PX,
  ]);
  const resumeJson = useResumeStore((s) => s.resumeData.resumeJson);

  useEffect(() => {
    console.log("✅ resumeJson just changed:", resumeJson);
  }, [resumeJson]);


  return (
    <div className="relative">
      <div
        ref={hiddenRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: A4_WIDTH_PX - PAGE_MARGIN_PX * 2 }}
      >
        {allSections}
      </div>
      <div className="flex flex-col gap-6">
 {Array.from({ length: numPages }).map((_, page) => (
          <div
            key={page}
            className="bg-white shadow-md mx-auto"
            style={{
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 
              This inner wrapper is exactly CONTENT_HEIGHT_PX tall, 
              and sits PAGE_MARGIN_PX from the top of each "page" container.
            */}
            <div
              style={{
                position: "absolute",
                top: PAGE_MARGIN_PX,
                left: PAGE_MARGIN_PX,
                width: A4_WIDTH_PX - PAGE_MARGIN_PX * 2,
                height: CONTENT_HEIGHT_PX,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform: `translateY(-${page * CONTENT_HEIGHT_PX}px)`,
                  // give the full-content block enough height to cover all pages:
                  height: CONTENT_HEIGHT_PX * numPages,
                }}
              >
                {allSections}
              </div>
            </div>

            <div className="absolute bottom-4 right-8 text-xs text-gray-500">
              Page {page + 1} of {numPages}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
