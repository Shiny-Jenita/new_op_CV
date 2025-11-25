import { ResumeJSON } from "@/stores/resume/interface";

export function convertJsonToTypstData(json: ResumeJSON): string {
  // Helper to escape special characters in strings
  const escape = (str: string) => {
    if (!str) return "";
    return str.replace(/"/g, '\\"')
              .replace(/\n/g, ' ')
              .replace(/\\/g, '\\\\');
  };

  const formatArray = (items: string[]) => {
    if (items.length === 0) return "()";
    if (items.length === 1) return `(${items[0]},)`;
    return `(${items.join(', ')})`;
  };

  // Create work array with proper sequence formatting
  const workItems = json.details.work.map(work => {
    const highlights = work.highlights?.map(h => `"${escape(h)}"`) || [];
    return `(
      name: "${escape(work.name)}", 
      position: "${escape(work.position)}", 
      location: "${escape(work.location)}", 
      startDate: "${escape(work.startDate)}", 
      endDate: "${escape(work.endDate)}", 
      highlights: ${formatArray(highlights)}
    )`;
  });

  // Create education array with proper sequence formatting
  const educationItems = json.details.education.map(edu => {
    const courses = edu.courses?.map(c => `"${escape(c)}"`) || [];
    const highlights = edu.highlights?.map(h => `"${escape(h)}"`) || [];
    return `(
      institution: "${escape(edu.institution)}", 
      area: "${escape(edu.area)}", 
      studyType: "${escape(edu.studyType)}", 
      startDate: "${escape(edu.startDate)}", 
      endDate: "${escape(edu.endDate)}", 
      courses: ${formatArray(courses)},
      highlights: ${formatArray(highlights)}
    )`;
  });

  // Create skills array with proper sequence formatting
  const skillsItems = json.details.skills.map(skill => {
    const keywords = skill.keywords?.map(k => `"${escape(k)}"`) || [];
    return `(
      name: "${escape(skill.name)}", 
      keywords: ${formatArray(keywords)},
      highlights: ()
    )`;
  });

  // Create projects array with proper sequence formatting
  const projectsItems = json.details.projects.map(project => {
    const descItems = Array.isArray(project.description)
      ? project.description.map(d => `"${escape(d.trim())}"`)
      : [`"${escape(project.description)}"`];
    
    return `(
      name: "${escape(project?.name)}", 
      description: ${formatArray(descItems)},
      highlights: ()
    )`;
  });

  // Create each section carefully with proper Typst syntax
  return `#let data = (
  details: (
    basics: (
      name: "${escape(json.details.basics.name)}",
      label: "${escape(json.details.basics.label)}",
      email: "${escape(json.details.basics.email)}",
      summary: "${escape(json.details.basics.summary)}",
      location: (
        city: "${escape(json.details.basics.location.city)}",
        countryCode: "${escape(json.details.basics.location.countryCode)}"
      ),
      highlights: () // Add empty highlights field for basics
    ),
    work: ${formatArray(workItems)},
    education: ${formatArray(educationItems)},
    skills: ${formatArray(skillsItems)},
    projects: ${formatArray(projectsItems)}
  )
)`
}