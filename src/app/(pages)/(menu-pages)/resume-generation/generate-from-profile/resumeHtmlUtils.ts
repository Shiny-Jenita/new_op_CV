// import { Certification } from "@/app/interfaces";
// import { ResumeJSON } from "@/stores/resume/interface";
// import { CertificationsData } from "../pick-preview/tabs/interface";

// export function parseHtmlToJson(root: HTMLDivElement, current: ResumeJSON) {
//   const out = JSON.parse(JSON.stringify(current));

//   function findSection(title: string): HTMLElement | undefined {
//   const normalizedTitle = title.toLowerCase().trim();
//   return Array.from(root.querySelectorAll("section")).find((sec) => {
//     const h2 = sec.querySelector("h2");
//     if (!h2 || !h2.textContent) return false;
//     const text = h2.textContent.toLowerCase().trim();
//     if (text === normalizedTitle) return true;
//     return false;
//   });
// }
// {
//   const nameEl = root.querySelector(".name");
//   if (nameEl) out.profile.name = nameEl.textContent?.trim();

//   const designationEl = root.querySelector(".designation");
//   if (designationEl) out.profile.designation = designationEl.textContent?.trim();

//   const phoneEl = root.querySelector(".phone");
//   if (phoneEl) out.profile.phone = phoneEl.textContent?.trim();

//   const emailEl = root.querySelector(".email");
//   if (emailEl) {
//     out.profile.email = emailEl.textContent?.trim() || (emailEl as HTMLAnchorElement).href.replace(/^mailto:/, "").trim();
//   }

//   const locationEl = root.querySelector(".location");
//   if (locationEl) out.profile.location = locationEl.textContent?.trim();
//   const websiteEls = root.querySelectorAll(".website");
//   const websites: string[] = [];

//   websiteEls.forEach((el) => {
//     const url = (el as HTMLAnchorElement).href || el.textContent?.trim();
//     if (url) websites.push(url.trim());
//   });

//   if (websites.length === 0) {
//     const singleWebsiteEl = root.querySelector(".website");
//     if (singleWebsiteEl) {
//       const parts = singleWebsiteEl.textContent?.split("|").map(s => s.trim()).filter(Boolean);
//       if (parts?.length) {
//         websites.push(...parts);
//       }
//     }
//   }

//   if (websites.length) {
//     out.profile.websites = websites.map(url => ({ url }));
//   }

// const summarySection =
//   findSection("SUMMARY") ||
//   findSection("Professional Summary") ||
//   findSection("Profile") ||
//   document.getElementById("profile-summary");

// if (summarySection) {
//   let summaryText = "";

//   // Try commonly used paragraph classes/structures
//   const p =
//     summarySection.querySelector(".resume-summary") ||
//     summarySection.querySelector(".summary-text") ||
//     summarySection.querySelector("p.editable-text") ||
//     summarySection.querySelector("p.editable") ||
//     summarySection.querySelector("p");

//   if (p) {
//     summaryText = p.textContent?.trim() || "";
//   }

//   out.profile = {
//     ...(out.profile || {}),
//     summary: summaryText,
//   };
// }


// const expSec = findSection("EXPERIENCE") || document.getElementById("experience");

// if (expSec) {
//   let jobs: Element[] = [];

//   jobs = Array.from(expSec.querySelectorAll(".resume-experience-item"));
//   if (jobs.length === 0) {
//     jobs = Array.from(expSec.querySelectorAll("ul.experience-list > li.experience-item"));
//   }
//   if (jobs.length === 0) {
//     jobs = Array.from(expSec.querySelectorAll("article.experience-entry"));
//   }
//   if (jobs.length === 0) {
//     jobs = Array.from(expSec.querySelectorAll(":scope > div"));
//   }

//   out.experiences = jobs.map((jobEl) => {
//     let company = "";
//     let position = "";
//     let date = "";
//     let location = "";
//     let description: string[] = [];

//     // Format 1: <article class="experience-entry">
//     if (jobEl.tagName.toLowerCase() === "article") {
//       const posCompText = jobEl.querySelector(".experience-title")?.textContent || "";
//       const splitIndex = posCompText.toLowerCase().indexOf(" at ");
//       if (splitIndex !== -1) {
//         position = posCompText.substring(0, splitIndex).trim();
//         company = posCompText.substring(splitIndex + 4).trim();
//       } else {
//         position = posCompText.trim();
//       }

//       date = jobEl.querySelector(".experience-date")?.textContent?.trim() || "";
//       location = jobEl.querySelector(".experience-location")?.textContent?.trim() || "";

//       description = Array.from(jobEl.querySelectorAll("ul li"))
//         .map((li) => li.textContent?.trim() || "");
//     }

//     // Format 2: <li class="experience-item">
//     else if (jobEl.classList.contains("experience-item")) {
//       position = jobEl.querySelector(".job-title, .position")?.textContent?.trim() || "";

//       const companyBlock = jobEl.querySelector(".company");
//       if (companyBlock) {
//         company = companyBlock.querySelector(".resume-company")?.textContent?.trim() || "";
//         location = companyBlock.querySelector(".resume-location")?.textContent?.trim() || "";
//         date = companyBlock.querySelector(".resume-date")?.textContent?.trim() || "";
//       }

//       description = Array.from(jobEl.querySelectorAll(".job-description-list li, ul li"))
//         .map((li) => li.textContent?.trim() || "");
//     }

//     // Format 3: <div class="resume-experience-item">
//     else if (jobEl.classList.contains("resume-experience-item")) {
//       company = jobEl.querySelector(".resume-company")?.textContent?.trim() || "";
//       position = jobEl.querySelector(".resume-position")?.textContent?.trim() || "";
//       date = jobEl.querySelector(".resume-experience-date")?.textContent?.trim() || "";
//       location = jobEl.querySelector(".resume-location")?.textContent?.trim() || "";

//       description = Array.from(jobEl.querySelectorAll(".resume-experience-description li"))
//         .map((li) => li.textContent?.trim() || "");
//     }

//     // Fallback for unstructured <div>
//     else {
//       company = jobEl.querySelector(".company")?.textContent?.trim() || "";
//       position = jobEl.querySelector(".position")?.textContent?.trim() || "";
//       date = jobEl.querySelector(".date")?.textContent?.trim() || "";
//       location = jobEl.querySelector(".location")?.textContent?.trim() || "";

//       description = Array.from(jobEl.querySelectorAll("ul li"))
//         .map((li) => li.textContent?.trim() || "");
//     }

//     return {
//       company,
//       position,
//       date,
//       location,
//       description,
//       currentlyWorking: date.toLowerCase().includes("present"),
//     };
//   });
// }


// const eduSec = findSection("EDUCATION") || document.getElementById("education");
// if (eduSec) {
//   let items = Array.from(eduSec.querySelectorAll(".resume-education-list > .resume-education-item"));
//   if (items.length === 0) {
//     items = Array.from(eduSec.querySelectorAll("ul.education-list > li.education-item"));
//   }
//   if (items.length === 0) {
//     items = Array.from(eduSec.querySelectorAll("section.section > div.job"));
//   }
//   if (items.length === 0) {
//     items = Array.from(eduSec.querySelectorAll(":scope > article"));
//   }
//   if (items.length === 0) {
//     items = Array.from(eduSec.querySelectorAll(".resume-education-list > .resume-education-item"));
//   }

//   out.education = items.map((el) => {
//     let university = "";
//     let date = "";
//     let level = "";
//     let major = "";
//     let specialization = "";
//     let description: string[] = [];
//     let location = "";

//     university = el.querySelector(".resume-university, .university-name, .university")?.textContent?.trim() || "";
//     date = el.querySelector(".resume-education-date, .education-date, .text-md")?.textContent?.trim() || "";

//     level = el.querySelector(".resume-level, .level")?.textContent?.trim() || "";
//     major = el.querySelector(".resume-major, .major")?.textContent?.trim() || "";
//     specialization = el.querySelector(".resume-specialization, .specialization")?.textContent?.trim() || "";

//     if (!level || !major) {
//       const degreeText = el.querySelector(".degree, .job-title, .resume-degree")?.textContent || "";
//       const degreeParts = degreeText.match(/^(.+?) in (.+?)(?: \((.+)\))?$/i);
//       if (degreeParts) {
//         level = level || degreeParts[1].trim();
//         major = major || degreeParts[2].trim();
//         specialization = specialization || (degreeParts[3]?.trim() || "");
//       }
//     }

//     location = el.querySelector(".resume-location, .education-location, .location")?.textContent?.trim() || "";

//     description = Array.from(el.querySelectorAll(
//       ".education-description-list li, .school-desc ul li, .resume-education-description li, .resume-education-desc-item, ul li"
//     )).map(li => li.textContent?.trim() || "").filter(Boolean);

//     return {
//       university,
//       date,
//       level,
//       major,
//       specialization,
//       location,
//       description,
//       gpa: [],
//       score: []
//     };
//   });
// }

// const projSec = findSection("PROJECTS") || document.getElementById("projects");
// if (projSec) {
//   let items = Array.from(projSec.querySelectorAll(".resume-project-list > .resume-project-item"));
//   if (items.length === 0) {
//     items = Array.from(projSec.querySelectorAll("ul.projects-list > li.project-item"));
//   }
//   if (items.length === 0) {
//     items = Array.from(projSec.querySelectorAll("section.section > div.project"));
//   }
//   if (items.length === 0) {
//     items = Array.from(projSec.querySelectorAll(":scope > article.project-entry"));
//   }
//   if (items.length === 0) {
//     items = Array.from(projSec.querySelectorAll(".resume-projects-list > .resume-project-item"));
//   }

//   out.projects = items.map((el) => {
//     let projectName = "";
//     let projectUrl = "";
//     let projectDescription = [];
//     const titleEl = el.querySelector(
//       ".project-name a, .resume-project-name, .project-title a, h3 a, strong > a, a.resume-project-name, a"
//     );

//     if (titleEl) {
//       projectName = titleEl.textContent?.trim() || "";
//       projectUrl = titleEl.getAttribute("href") || "";
//     } else {
//       const nameEl = el.querySelector(".project-name, .resume-project-name, h3");
//       if (nameEl) projectName = nameEl.textContent?.trim() || "";
//     }

//     // Descriptions: try multiple list types
//     const descItems = Array.from(
//       el.querySelectorAll(
//         ".project-description-list li, .resume-project-description li, .resume-project-desc-item, ul li"
//       )
//     ).map(li => li.textContent?.trim() || "").filter(Boolean);

//     if (descItems.length > 0) {
//       projectDescription = descItems;
//     } else {
//       // fallback: try paragraph
//       const p = el.querySelector("p");
//       if (p) projectDescription = [p.textContent?.trim()];
//     }

//     // Skip if no data found
//     const isEmpty = !projectName && !projectUrl && projectDescription.length === 0;
//     if (isEmpty) return null;

//     return {
//       projectName,
//       projectUrl,
//       projectDescription,
//     };
//   }).filter(Boolean); // remove null entries
// }

// const skillsSec = findSection("SKILLS") || findSection("EXPERTISE") || findSection("Technical Skills");
// if (skillsSec) {
//   out.skills = [];
//   out.others = out.others || {};
//   out.others.languages = [];

//   // ✳️ Handle <p> blocks that contain skills/languages
//   const ps = skillsSec.querySelectorAll("p");
//   ps.forEach(p => {
//     const text = p.textContent || "";
//     if (text.includes("Technical Skills:")) {
//       const raw = p.querySelector(".resume-skills-list")?.textContent || text.replace("Technical Skills:", "");
//       const skills = raw
//         .split(/[,|•]/) // allow comma or bullet delimiters
//         .map(s => s.trim())
//         .filter(Boolean);
//       skills.forEach(name => {
//         if (!out.skills.find(s => s.name === name)) {
//           out.skills.push({ name });
//         }
//       });
//     }

//     if (text.includes("Languages:")) {
//       const raw = p.querySelector(".resume-languages-list")?.textContent || text.replace("Languages:", "");
//       const langs = raw
//         .split(/[,|•]/)
//         .map(s => s.trim())
//         .filter(Boolean);
//       langs.forEach(name => {
//         if (!out.others.languages.find(l => l.name === name)) {
//           out.others.languages.push({ name, proficiency: "" });
//         }
//       });
//     }
//   });

//   // ✳️ Handle list-based skills: <ul><li> and other fallback formats
//   const skillListItems = skillsSec.querySelectorAll(
//     "ul.skills-list li, ul li.skill-item, .skills-section ul li, #skills ul li, .section-skills ul li"
//   );
//   skillListItems.forEach(li => {
//     const name = li.textContent?.trim();
//     if (name && !out.skills.find(s => s.name === name)) {
//       out.skills.push({ name });
//     }
//   });

//   // 🔁 Final fallback: catch span-only patterns (just in case)
//   const spanSkills = skillsSec.querySelectorAll(".resume-skills-list span, .resume-skills-list");
//   spanSkills.forEach(el => {
//     const raw = el.textContent || "";
//     raw.split(/[,|•]/).forEach(name => {
//       name = name.trim();
//       if (name && !out.skills.find(s => s.name === name)) {
//         out.skills.push({ name });
//       }
//     });
//   });
// }

//  const langSec = findSection("LANGUAGES") || findSection("Languages") || findSection("language");
// if (langSec) {
//   out.others = out.others || {};
//   out.others.languages = [];

//   // Case 1: If languages are listed in a <ul><li> format
//   const langListItems = langSec.querySelectorAll("ul li");
//   langListItems.forEach(li => {
//     const name = li.textContent?.trim();
//     if (name && !out.others.languages.find(l => l.name === name)) {
//       out.others.languages.push({ name, proficiency: "" });
//     }
//   });

//   // Case 2: Your actual HTML format with .resume-language-name
//   const langDivs = langSec.querySelectorAll(".language-item .resume-language-name, .resume-language-item strong");
//   langDivs.forEach(strong => {
//     const name = strong.textContent?.trim();
//     if (name && !out.others.languages.find(l => l.name === name)) {
//       out.others.languages.push({ name, proficiency: "" });
//     }
//   });
// }

// const certSec = findSection("CERTIFICATES") || findSection("CERTIFICATIONS");

// if (certSec) {
//   const certs: CertificationsData[] = [];

//   // Format 1: list items
//   const liItems = certSec.querySelectorAll("li");
//   if (liItems.length) {
//     liItems.forEach((li) => {
//       const parts = li.textContent?.split("|").map((p) => p.trim()) || [];
//       const a = li.querySelector("a");
//       const url = a?.getAttribute("href") || (parts[2]?.startsWith("http") ? parts[2] : "");

//       certs.push({
//         certificateName: parts[0] || "",
//         date: parts[1] || "",
//         url: url || "",
//         issuer: "", // No issuer in this format
//       });
//     });
//   } else {
//     // Format 2: articles
//     const articles = certSec.querySelectorAll("article");
//     if (articles.length) {
//       articles.forEach((article) => {
//         const titleText = article.querySelector("h3")?.textContent || "";
//         const [certificateName, date] = titleText.split("-").map((s) => s.trim());

//         const url = article.querySelector("a")?.getAttribute("href") || "";

//         certs.push({
//           certificateName: certificateName || "",
//           date: date || "",
//           url,
//           issuer: "", // no issuer in this format either
//         });
//       });
//     } else {
//       // ✅ Format 3: .resume-certification-item
//       const divCerts = certSec.querySelectorAll(".resume-certification-item");
//       divCerts.forEach((div) => {
//         const certificateName =
//           div.querySelector(".resume-certification-name strong")?.textContent?.trim() || "";

//         const date =
//           div.querySelector(".resume-certification-date")?.textContent?.trim() || "";

//         const url =
//           div.querySelector(".resume-certification-url")?.getAttribute("href")?.trim() || "";

//         const issuer =
//           div.querySelector(".resume-certification-issuer")?.textContent?.replace("Issued by", "").trim() || "";

//         certs.push({
//           certificateName,
//           date,
//           url,
//           issuer,
//         });
//       });
//     }
//   }

//   out.others = out.others || {};
//   out.others.certifications = certs;
// }


//   // Certifications
// //  const certSec = findSection("CERTIFICATES") || findSection("CERTIFICATIONS");
// // if (certSec) {
// //   const certs: CertificationsData[] = [];
// //   const liItems = certSec.querySelectorAll("li");
// //   if (liItems.length) {
// //     liItems.forEach(li => {
// //       // Expecting text like: "Certificate Name | Date | url"
// //       const parts = li.textContent?.split("|").map(p => p.trim()) || [];

// //       // Try to find a URL from the <a> tag if present (overrides text parse)
// //       const a = li.querySelector("a");
// //       const url = a?.getAttribute("href") || (parts[2]?.startsWith("http") ? parts[2] : "");

// //       certs.push({
// //         certificateName: parts[0] || "",
// //         date: parts[1] || "",
// //         url: url || "",
// //         issuer:
// //       });
// //     });
// //   } else {
// //     // If no <li>, try extracting from <article> (format #4)
// //     const articles = certSec.querySelectorAll("article");
// //     articles.forEach(article => {
// //       const titleText = article.querySelector("h3")?.textContent || "";
// //       const [certificateName, date] = titleText.split("-").map(s => s.trim());

// //       const url = article.querySelector("a")?.getAttribute("href") || "";

// //       certs.push({
// //         certificateName: certificateName || "",
// //         date: date || "",
// //         url,
// //       });
// //     });
// //   }

// //   out.others = out.others || {};
// //   out.others.certifications = certs;
// // }


//   // Publications
// //  const pubSec = findSection("PUBLICATIONS");
// // if (pubSec) {
// //   // Use consistent class-first selection like in eduSec
// //   let items = Array.from(pubSec.querySelectorAll(".resume-publications-list > .resume-publication-item"));

// //   if (items.length === 0) {
// //     items = Array.from(pubSec.querySelectorAll("ul.publications-list > li"));
// //   }
// //   if (items.length === 0) {
// //     items = Array.from(pubSec.querySelectorAll("section.section-publications > article.publication-entry"));
// //   }
// //   if (items.length === 0) {
// //     items = Array.from(pubSec.querySelectorAll(":scope > div.publication-item"));
// //   }
// //   if (items.length === 0) {
// //     items = Array.from(pubSec.querySelectorAll(".resume-publications-list > .resume-publication-item")); // Final fallback
// //   }

// //   out.others = out.others || {};
// //   out.others.publications = items.map((el) => {
// //     let title = "";
// //     let author = "";
// //     let publisherUrl = "";
// //     let description: string[] = [];

// //     // Try class-based extraction (most accurate)
// //     title = el.querySelector(".resume-publication-title, .publication-title")?.textContent?.trim() || "";
// //     author = el.querySelector(".resume-publication-author, .publication-author")?.textContent?.trim() || "";
// //     publisherUrl = el.querySelector(".resume-publication-url, .publication-url")?.getAttribute("href") || "";

// //     // Fallback: infer author from text
// //     if (!author) {
// //       const rawText = el.textContent || "";
// //       const authorMatch = rawText.match(/by\s+(.*?)(?:[\n,.]|$)/i);
// //       if (authorMatch) author = authorMatch[1].trim();
// //     }

// //     // Fallback: extract title from <a> or <strong> if still missing
// //     if (!title) {
// //       title = el.querySelector("a, strong, h3")?.textContent?.trim() || "";
// //     }

// //     // Description list (if any present)
// //     description = Array.from(el.querySelectorAll(
// //       ".resume-publication-description li, .publication-description-list li, ul li"
// //     )).map(li => li.textContent?.trim() || "").filter(Boolean);

// //     return {
// //       title,
// //       author,
// //       publisherUrl,
// //       url: publisherUrl, // same field
// //       description,
// //       publisher: "",        // not present in most formats, can extend later
// //       publishedDate: ""     // also optional
// //     };
// //   });
// // }
// const pubSec = findSection("PUBLICATIONS");
// if (pubSec) {
//   const items = Array.from(pubSec.querySelectorAll(".resume-publication-item"));

//   out.others = out.others || {};
//   out.others.publications = items.map((el) => {
//     const title = el.querySelector(".resume-publication-title")?.textContent?.trim() || "";
//     const authorRaw = el.querySelector(".resume-publication-author")?.textContent?.trim() || "";
//     const author = authorRaw.replace(/^By\s+/i, "");
//     const publisherUrl = el.querySelector(".resume-publication-url")?.getAttribute("href") || "";

//     return {
//       title,
//       author,
//       publisherUrl,
//       url: publisherUrl,
//       description: [],
//       publisher: "",
//       publishedDate: ""
//     };
//   });
// }

//   return out;
// }

// }

import { Certification } from "@/app/interfaces";
import { ResumeJSON } from "@/stores/resume/interface";
import { CertificationsData } from "../pick-preview/tabs/interface";

export function parseHtmlToJson(root: HTMLDivElement, current: ResumeJSON) {
  // Deep clone current
  const out = JSON.parse(JSON.stringify(current));

  // Updated: findSection now looks for elements with class "section"
  function findSection(title: string): HTMLElement | undefined {
    const normalizedTitle = title.toLowerCase().trim();
    // Query by elements having class "section"
    return Array.from(root.querySelectorAll<HTMLElement>(".section")).find((sec) => {
      const h2 = sec.querySelector("h2");
      if (!h2 || !h2.textContent) return false;
      const text = h2.textContent.toLowerCase().trim();
      return text === normalizedTitle;
    });
  }

  // PROFILE FIELDS
  const nameEl = root.querySelector(".profile-name, .name");
  if (nameEl) out.profile.name = nameEl.textContent?.trim() || "";

  const designationEl = root.querySelector(".designation");
  if (designationEl) out.profile.designation = designationEl.textContent?.trim() || "";

  const phoneEl = root.querySelector(".profile-phone, .phone");
  if (phoneEl) out.profile.phone = phoneEl.textContent?.trim() || "";

  const emailEl = root.querySelector(".profile-email, .email");
  if (emailEl) {
    const text = emailEl.textContent?.trim() || "";
    // If it's an <a href="mailto:...">
    if ((emailEl as HTMLAnchorElement).href?.startsWith("mailto:")) {
      out.profile.email = (emailEl as HTMLAnchorElement).href.replace(/^mailto:/, "").trim();
    } else {
      out.profile.email = text;
    }
  }

  const locationEl = root.querySelector(".profile-location, .location");
  if (locationEl) out.profile.location = locationEl.textContent?.trim() || "";

  // Websites: class "profile-websites" or ".website"
  const websiteEls = root.querySelectorAll(".profile-websites a, .profile-websites, .website");
  const websites: string[] = [];
  websiteEls.forEach((el) => {
    let url = "";
    if (el instanceof HTMLAnchorElement && el.href) {
      url = el.href.trim();
    } else {
      const txt = el.textContent?.trim() || "";
      url = txt;
    }
    if (url) websites.push(url);
  });
  if (websites.length === 0) {
    // fallback: maybe single element containing “|” separated
    const singleWebsiteEl = root.querySelector(".profile-websites");
    if (singleWebsiteEl) {
      const parts = singleWebsiteEl.textContent
        ?.split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts) websites.push(...parts);
    }
  }
  if (websites.length) {
    out.profile.websites = websites.map((url) => ({ url }));
  }

  // SUMMARY
  const summarySection =
    findSection("SUMMARY") ||
    findSection("Professional Summary") ||
    findSection("Profile") ||
    root.querySelector("#profile-summary") as HTMLElement | null;
  if (summarySection) {
    let summaryText = "";
    // Try class-based or generic <td>/.summary-text
    const p =
      summarySection.querySelector(".resume-summary") ||
      summarySection.querySelector(".summary-text") ||
      summarySection.querySelector("p.editable-text") ||
      summarySection.querySelector("p.editable") ||
      summarySection.querySelector("p");
    if (p) {
      summaryText = p.textContent?.trim() || "";
    }
    out.profile = {
      ...(out.profile || {}),
      summary: summaryText,
    };
  }

  // EXPERIENCE
  const expSec = findSection("EXPERIENCE") || (root.querySelector("#experience") as HTMLElement | null);
  if (expSec) {
    let jobs: Element[] = [];
    // Try class selectors matching your template, e.g., .experience-item wrappers
    jobs = Array.from(expSec.querySelectorAll(".experience-item, .resume-experience-item"));
    if (jobs.length === 0) {
      jobs = Array.from(expSec.querySelectorAll("ul.experience-list > li.experience-item"));
    }
    if (jobs.length === 0) {
      jobs = Array.from(expSec.querySelectorAll("article.experience-entry"));
    }
    if (jobs.length === 0) {
      // fallback: direct child divs
      jobs = Array.from(expSec.querySelectorAll(":scope > div"));
    }

    out.experiences = jobs.map((jobEl) => {
      let company = "";
      let position = "";
      let date = "";
      let location = "";
      let description: string[] = [];

      if (jobEl.tagName.toLowerCase() === "article" || jobEl.classList.contains("experience-entry")) {
        // ARTICLE format
        const posCompText = jobEl.querySelector(".experience-title")?.textContent || "";
        const splitIndex = posCompText.toLowerCase().indexOf(" at ");
        if (splitIndex !== -1) {
          position = posCompText.substring(0, splitIndex).trim();
          company = posCompText.substring(splitIndex + 4).trim();
        } else {
          position = posCompText.trim();
        }
        date = jobEl.querySelector(".experience-date")?.textContent?.trim() || "";
        location = jobEl.querySelector(".experience-location")?.textContent?.trim() || "";
        description = Array.from(jobEl.querySelectorAll("ul li"))
          .map((li) => li.textContent?.trim() || "")
          .filter(Boolean);
      }
    else if (jobEl.classList.contains("experience-item") || jobEl.classList.contains("resume-experience-item")) {
  company = jobEl.querySelector(".experience-company")?.textContent?.trim() || "";
  position = jobEl.querySelector(".experience-position")?.textContent?.trim() || "";
  date = jobEl.querySelector(".experience-date")?.textContent?.trim() || "";
  location = jobEl.querySelector(".experience-location")?.textContent?.trim() || "";
  description = Array.from(
    jobEl.querySelectorAll(".experience-description-list li, .experience-description-item")
  )
    .map((li) => li.textContent?.trim() || "")
    .filter(Boolean);
}

      else {
        // generic fallback
        company = jobEl.querySelector(".company")?.textContent?.trim() || "";
        position = jobEl.querySelector(".position")?.textContent?.trim() || "";
        date = jobEl.querySelector(".date, .experience-date")?.textContent?.trim() || "";
        location = jobEl.querySelector(".location, .experience-location")?.textContent?.trim() || "";
        description = Array.from(jobEl.querySelectorAll("ul li"))
          .map((li) => li.textContent?.trim() || "")
          .filter(Boolean);
      }

      return {
        company,
        position,
        date,
        location,
        description,
        currentlyWorking: date.toLowerCase().includes("present"),
      };
    });
  }

  // EDUCATION
  const eduSec = findSection("EDUCATION") || (root.querySelector("#education") as HTMLElement | null);
  // if (eduSec) {
  //   let items: Element[] = [];
  //   items = Array.from(eduSec.querySelectorAll(".education-item, .resume-education-item"));
  //   if (items.length === 0) {
  //     items = Array.from(eduSec.querySelectorAll("ul.education-list > li.education-item"));
  //   }
  //   if (items.length === 0) {
  //     items = Array.from(eduSec.querySelectorAll(".education-section > div.job")); // less likely
  //   }
  //   if (items.length === 0) {
  //     items = Array.from(eduSec.querySelectorAll("article")); // fallback
  //   }
  //   if (items.length === 0) {
  //     items = Array.from(eduSec.querySelectorAll(":scope > div")); // generic fallback
  //   }

  //   out.education = items.map((el) => {
  //     let university = "";
  //     let date = "";
  //     let level = "";
  //     let major = "";
  //     let specialization = "";
  //     let description: string[] = [];
  //     let location = "";
  //     // Extract fields by class names used in template
  //     university = el.querySelector(".education-university, .university-name, .university")?.textContent?.trim() || "";
  //     date = el.querySelector(".education-date, .resume-education-date, .text-md")?.textContent?.trim() || "";
  //     level = el.querySelector(".education-degree, .resume-level, .level")?.textContent?.trim() || "";
  //     // If level text includes "in <major>", we can split:
  //     if (level) {
  //       const parts = level.match(/^(.+?) in (.+)$/i);
  //       if (parts) {
  //         level = parts[1].trim();
  //         major = parts[2].trim();
  //       }
  //     }
  //     // If major not found above, try separate selector
  //     major = major || el.querySelector(".major, .resume-major")?.textContent?.trim() || "";
  //     specialization = el.querySelector(".education-specialization, .resume-specialization, .specialization")?.textContent?.trim() || "";
  //     location = el.querySelector(".education-location, .resume-location, .location")?.textContent?.trim() || "";
  //     // Description list items
  //     description = Array.from(
  //       el.querySelectorAll(
  //         ".education-description-list li, .resume-education-description li, ul li"
  //       )
  //     )
  //       .map((li) => li.textContent?.trim() || "")
  //       .filter(Boolean);

  //     // Initialize gpa/score fields; you may later parse .education-score spans
  //     // Here we leave them empty; parsing of edited content can fill these
  //     return {
  //       university,
  //       date,
  //       level,
  //       major,
  //       specialization,
  //       location,
  //       description,
  //       score: [],
  //     };
  //   });
  // }

  // PROJECTS
  if (eduSec) {
  let items: Element[] = [];
  items = Array.from(eduSec.querySelectorAll(".education-item, .resume-education-item"));
  if (items.length === 0) {
    items = Array.from(eduSec.querySelectorAll("ul.education-list > li.education-item"));
  }
  if (items.length === 0) {
    items = Array.from(eduSec.querySelectorAll(".education-section > div.job"));
  }
  if (items.length === 0) {
    items = Array.from(eduSec.querySelectorAll("article"));
  }
  if (items.length === 0) {
    items = Array.from(eduSec.querySelectorAll(":scope > div"));
  }

  out.education = items.map((el) => {
    let university = "";
    let date = "";
    let level = "";
    let major = "";
    let specialization = "";
    let description: string[] = [];
    let location = "";

    // Extract existing fields...
    university = el.querySelector(".education-university, .university-name, .university")?.textContent?.trim() || "";
    date = el.querySelector(".education-date, .resume-education-date, .text-md")?.textContent?.trim() || "";
    level = el.querySelector(".education-degree, .resume-level, .level")?.textContent?.trim() || "";
    if (level) {
      const parts = level.match(/^(.+?) in (.+)$/i);
      if (parts) {
        level = parts[1].trim();
        major = parts[2].trim();
      }
    }
    major = major || el.querySelector(".major, .resume-major")?.textContent?.trim() || "";
    specialization = el.querySelector(".education-specialization, .resume-specialization, .specialization")?.textContent?.trim() || "";
    location = el.querySelector(".education-location, .resume-location, .location")?.textContent?.trim() || "";
    description = Array.from(
      el.querySelectorAll(".education-description-list li, .resume-education-description li, ul li")
    )
      .map((li) => li.textContent?.trim() || "")
      .filter(Boolean);

    // ===== Parse score =====
    const scoreArr: Array<{ type: string; value: string | number }> = [];
    const scoreDiv = el.querySelector<HTMLElement>(".education-score");
    if (scoreDiv) {
      const spans = Array.from(scoreDiv.querySelectorAll<HTMLElement>(".score-item"));
      spans.forEach((span) => {
        const text = span.textContent?.trim() || "";
        // Expect format "type: value"
        const colonIndex = text.indexOf(":");
        if (colonIndex !== -1) {
          const type = text.substring(0, colonIndex).trim();
          const valStr = text.substring(colonIndex + 1).trim();
          if (type && valStr !== "") {
            // Parse number if numeric
            const num = parseFloat(valStr);
            const value = isNaN(num) ? valStr : num;
            scoreArr.push({ type, value });
          }
        } else {
          // If user typed something without colon, skip or handle as needed
        }
      });
    }
    // ===== End parse score =====

    return {
      university,
      date,
      level,
      major,
      specialization,
      location,
      description,
      score: scoreArr,
    };
  });
}

  
  const projSec = findSection("PROJECTS") || (root.querySelector("#projects") as HTMLElement | null);
  if (projSec) {
    let items: Element[] = Array.from(projSec.querySelectorAll(".project-item, .resume-project-item"));
    if (items.length === 0) {
      items = Array.from(projSec.querySelectorAll("ul.projects-list > li.project-item"));
    }
    if (items.length === 0) {
      items = Array.from(projSec.querySelectorAll("article.project-entry"));
    }
    if (items.length === 0) {
      items = Array.from(projSec.querySelectorAll(":scope > div")); // fallback
    }

    out.projects = items
      .map((el) => {
        let projectName = "";
        let projectUrl = "";
        let projectDescription: string[] = [];

        const titleEl = el.querySelector(
          ".project-name a, .resume-project-name a, .project-title a, h3 a, a.resume-project-name, a"
        ) as HTMLAnchorElement | null;
        if (titleEl) {
          projectName = titleEl.textContent?.trim() || "";
          projectUrl = titleEl.href || "";
        } else {
          const nameEl = el.querySelector(".project-name, .resume-project-name, h3");
          projectName = nameEl?.textContent?.trim() || "";
        }

        // Descriptions
        const descItems = Array.from(
          el.querySelectorAll(
            ".project-description-list li, .resume-project-description li, ul li"
          )
        )
          .map((li) => li.textContent?.trim() || "")
          .filter(Boolean);
        if (descItems.length > 0) {
          projectDescription = descItems;
        } else {
          const p = el.querySelector("p");
          if (p) projectDescription = [p.textContent?.trim() || ""];
        }

        const isEmpty = !projectName && !projectUrl && projectDescription.length === 0;
        if (isEmpty) return null;
        return {
          projectName,
          projectUrl,
          projectDescription,
        };
      })
      .filter(Boolean) as Array<{ projectName: string; projectUrl: string; projectDescription: string[] }>;
  }

const skillsSec = findSection("SKILLS") || findSection("EXPERTISE") || findSection("Technical Skills");
if (skillsSec) {
  // Reset arrays
  out.skills = [];
  out.others = out.others || {};
  out.others.languages = [];

  // === 1. Technical Skills via span ===
  const techSpan = skillsSec.querySelector<HTMLElement>(".technical-skills-list, .resume-skills-list");
  if (techSpan) {
    const raw = techSpan.textContent || "";
    const skills = raw.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
    out.skills = [...new Set(skills)].map(name => ({ name }));
  }

  // === 2. Languages via span ===
  const langSpan = skillsSec.querySelector<HTMLElement>(".languages-list, .resume-languages-list");
  if (langSpan) {
    const raw = langSpan.textContent || "";
    const langs = raw.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
    out.others.languages = [...new Set(langs)].map(name => ({ name, proficiency: "" }));
  }

  // === 3. Fallbacks for SKILLS only ===
  if (out.skills.length === 0) {
    // Fallback to ul > li
    const skillListItems = skillsSec.querySelectorAll(
      "ul.skills-list li, ul li.skill-item, .skills-section ul li"
    );
    skillListItems.forEach((li) => {
      const name = li.textContent?.trim();
      if (name && !out.skills.find(s => s.name === name)) {
        out.skills.push({ name });
      }
    });

    // Fallback to <p> content
    if (out.skills.length === 0) {
      skillsSec.querySelectorAll("p").forEach((p) => {
        const text = p.textContent || "";
        if (/Technical Skills:/i.test(text)) {
          const raw = p.querySelector(".technical-skills-list")?.textContent || text.replace(/Technical Skills:/i, "");
          const skills = raw.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
          out.skills = [...new Set(skills)].map(name => ({ name }));
        }
      });
    }

    // Fallback to <span> pattern
    if (out.skills.length === 0) {
      const spanSkills = skillsSec.querySelectorAll(".technical-skills-list span, .resume-skills-list span");
      spanSkills.forEach((el) => {
        const raw = el.textContent || "";
        raw.split(/[,|•]/).forEach((name) => {
          name = name.trim();
          if (name && !out.skills.find((s) => s.name === name)) {
            out.skills.push({ name });
          }
        });
      });
    }
  }
}

  // CERTIFICATES
  const certSec = findSection("CERTIFICATES") || findSection("CERTIFICATIONS");
  if (certSec) {
    const certs: CertificationsData[] = [];
    // Try <li> items
    const liItems = certSec.querySelectorAll("li");
    if (liItems.length) {
      liItems.forEach((li) => {
        const parts = li.textContent?.split("|").map((p) => p.trim()) || [];
        const a = li.querySelector("a");
        let url = "";
        if (a?.getAttribute("href")) {
          url = a.getAttribute("href")!.trim();
        } else if (parts[2]?.startsWith("http")) {
          url = parts[2].trim();
        }
        certs.push({
          certificateName: parts[0] || "",
          date: parts[1] || "",
          url,
          issuer: "", // if no issuer parsed
        });
      });
    } else {
      // Try article-based or div-based items
      const articles = certSec.querySelectorAll("article");
      if (articles.length) {
        articles.forEach((article) => {
          const titleText = article.querySelector("h3")?.textContent || "";
          const [certificateName, date] = titleText.split("-").map((s) => s.trim());
          const url = article.querySelector("a")?.getAttribute("href")?.trim() || "";
          certs.push({
            certificateName: certificateName || "",
            date: date || "",
            url,
            issuer: "",
          });
        });
      } else {
        // Fallback class-based
        certSec.querySelectorAll(".resume-certification-item").forEach((div) => {
          const certificateName =
            div.querySelector(".resume-certification-name strong")?.textContent?.trim() || "";
          const date = div.querySelector(".resume-certification-date")?.textContent?.trim() || "";
          const url =
            div.querySelector(".resume-certification-url")?.getAttribute("href")?.trim() || "";
          const issuer =
            div.querySelector(".resume-certification-issuer")?.textContent
              ?.replace(/Issued by/i, "")
              .trim() || "";
          certs.push({
            certificateName,
            date,
            url,
            issuer,
          });
        });
      }
    }
    out.others = out.others || {};
    out.others.certifications = certs;
  }

  // PUBLICATIONS
  const pubSec = findSection("PUBLICATIONS");
  if (pubSec) {
    const items = Array.from(pubSec.querySelectorAll(".publication-item, .resume-publication-item"));
    out.others = out.others || {};
    out.others.publications = items.map((el) => {
      const title = el.querySelector(".publication-title, .resume-publication-title")?.textContent?.trim() || "";
      const authorRaw = el.querySelector(".publication-author, .resume-publication-author")?.textContent?.trim() || "";
      const author = authorRaw.replace(/^By\s+/i, "");
      const publisherUrl = el.querySelector(".publication-url, .resume-publication-url")?.getAttribute("href") || "";
      return {
        title,
        author,
        publisherUrl,
        url: publisherUrl,
        description: [],
        publisher: "",
        publishedDate: "",
      };
    });
  }

  return out;
}
