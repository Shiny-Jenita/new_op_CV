"use client"

import type { ResumeJSON } from "@/stores/resume/interface"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Briefcase,
  Lightbulb,
  FolderGit2,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  Award,
  GraduationCap,
  Star,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ResumeEditorProps {
  resumeJson?: ResumeJSON
  onUpdate: (updatedJson: ResumeJSON) => void
}

const defaultResumeJson: ResumeJSON = {
  details: {
    profile: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      location: "",
      summary: "",
      websites: [],
    },
    work: [],
    education: [],
    projects: [],
    skills: [],
    others: {
      languages: [],
      publications: [],
      certifications: [],
    },
  },
 
}
export const ResumeEditor = ({ resumeJson, onUpdate }: ResumeEditorProps) => {
  const [resumeData, setResumeData] = useState<ResumeJSON>(defaultResumeJson)
  const [activeTab, setActiveTab] = useState("profile")
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [newSkillKeyword, setNewSkillKeyword] = useState<string>("")

  useEffect(() => {
    if (resumeJson) {
      setResumeData(resumeJson)
    }
  }, [resumeJson])

  useEffect(() => {
    let totalFields = 0
    let completedFields = 0

    const basicFields = ["name", "label", "email", "summary"]
    totalFields += basicFields.length
    basicFields.forEach((field) => {
      if (resumeData.details.profile[field as keyof typeof resumeData.details.profile]) {
        completedFields++
      }
    })

    if (resumeData.details.work.length > 0) {
      resumeData.details.work.forEach((work) => {
        const workFields = ["name", "position", "startDate"]
        totalFields += workFields.length + work.highlights.length
        workFields.forEach((field) => {
          if (work[field as keyof typeof work]) {
            completedFields++
          }
        })
        work.highlights.forEach((highlight) => {
          if (highlight) completedFields++
        })
      })
    }

    if (resumeData.details.skills.length > 0) {
      resumeData.details.skills.forEach((skill) => {
        totalFields += 2 
        if (skill.name) completedFields++
        if (skill.keywords.length > 0) completedFields++
      })
    }

    if (resumeData.details.projects?.length > 0) {
      resumeData.details.projects.forEach((project) => {
        totalFields += 2 
        if (project.projectName) completedFields++
        if (project.projectDescription) completedFields++
      })
    }

    const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
    setCompletionPercentage(percentage)
  }, [resumeData])

  const updateField = (path: string[], value: any) => {
    const newJson = JSON.parse(JSON.stringify(resumeData))
    let current = newJson
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = value
    setResumeData(newJson)
    onUpdate(newJson)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const addSkillKeyword = (skillIndex: number) => {
    if (newSkillKeyword.trim()) {
      const newSkills = [...resumeData.details.skills]
      newSkills[skillIndex].keywords.push(newSkillKeyword.trim())
      updateField(["details", "skills"], newSkills)
      setNewSkillKeyword("")
    }
  }

  const removeSkillKeyword = (skillIndex: number, keywordIndex: number) => {
    const newSkills = [...resumeData.details.skills]
    newSkills[skillIndex].keywords.splice(keywordIndex, 1)
    updateField(["details", "skills"], newSkills)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Resume Completion</h3>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-6">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-semibold text-sky-700">Resume Sections</h2>
            </div>
            <div className="p-2">
              <nav className="space-y-1">
                {[
                  { id: "basics", label: "Personal", icon: <User className="h-4 w-4" /> },
                  {
                    id: "work",
                    label: "Experience",
                    icon: <Briefcase className="h-4 w-4" />,
                    count: resumeData.details.work.length,
                  },
                  {
                    id: "skills",
                    label: "Skills",
                    icon: <Lightbulb className="h-4 w-4" />,
                    count: resumeData.details.skills.length,
                  },
                  {
                    id: "projects",
                    label: "Projects",
                    icon: <FolderGit2 className="h-4 w-4" />,
                    count: resumeData.details.projects?.length || 0,
                  },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleTabChange(section.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-md transition-all",
                      activeTab === section.id
                        ? "bg-sky-700 text-primary-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span>{section.label}</span>
                    </div>
                    {section.count !== undefined && section.count > 0 && (
                      <Badge
                        variant={activeTab === section.id ? "outline" : "secondary"}
                        className={cn(
                          "ml-auto",
                          activeTab === section.id ? "text-primary-foreground border-primary-foreground" : "",
                        )}
                      >
                        {section.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <TabsContent value="basics" className="m-0 p-6 space-y-6 focus:outline-none">
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold flex items-center text-sky-700 gap-2">
                      <User className="h-5 w-5 text-primary text-sky-700" />
                      Personal Information
                    </h2>
                  </div>

                  <Card className="shadow-sm border-none bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Identity
                      </CardTitle>
                      <CardDescription>Your name and professional title</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Full Name
                          </label>
                          <Input
                            value={resumeData.details.basics.name}
                            onChange={(e) => updateField(["details", "basics", "name"], e.target.value)}
                            placeholder="John Doe"
                            className="transition-all focus-within:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-muted-foreground" />
                            Professional Title
                          </label>
                          <Input
                            value={resumeData.details.basics.label}
                            onChange={(e) => updateField(["details", "basics", "label"], e.target.value)}
                            placeholder="Software Engineer"
                            className="transition-all focus-within:border-primary"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-none bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Contact Details
                      </CardTitle>
                      <CardDescription>How employers can reach you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            Email
                          </label>
                          <Input
                            type="email"
                            value={resumeData.details.basics.email}
                            onChange={(e) => updateField(["details", "basics", "email"], e.target.value)}
                            placeholder="john.doe@example.com"
                            className="transition-all focus-within:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            Phone
                          </label>
                          <Input
                            type="tel"
                            value={resumeData.details.basics.phone || ""}
                            onChange={(e) => updateField(["details", "basics", "phone"], e.target.value)}
                            placeholder="(123) 456-7890"
                            className="transition-all focus-within:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          Website
                        </label>
                        <Input
                          type="url"
                          value={resumeData.details.basics.url || ""}
                          onChange={(e) => updateField(["details", "basics", "url"], e.target.value)}
                          placeholder="https://johndoe.com"
                          className="transition-all focus-within:border-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-none bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        Professional Summary
                      </CardTitle>
                      <CardDescription>A brief overview of your career and skills</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Textarea
                          rows={4}
                          value={resumeData.details.basics.summary}
                          onChange={(e) => updateField(["details", "basics", "summary"], e.target.value)}
                          placeholder="A brief summary of your professional background and career goals"
                          className="resize-none transition-all focus-within:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tip: Keep your summary concise and focused on your most relevant skills and experiences.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="work" className="m-0 p-6 space-y-6 focus:outline-none">
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-sky-700">
                      <Briefcase className="h-5 w-5 text-primary text-sky-700" />
                      Work Experience
                    </h2>
                  </div>

                  {resumeData.details.work.length === 0 ? (
                    <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                      <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No work experience added yet</h3>
                      <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                        Work experience will appear here once added to your resume.
                      </p>
                    </div>
                  ) : (
                    resumeData.details.work.map((work, workIndex) => (
                      <Card
                        key={workIndex}
                        className="shadow-sm border-none bg-muted/10 overflow-hidden transition-all"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            {work.name || "Company Name"}
                          </CardTitle>
                          <CardDescription>{work.position || "Position Title"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                Company
                              </label>
                              <Input
                                value={work.name}
                                onChange={(e) => {
                                  const newWork = [...resumeData.details.work]
                                  newWork[workIndex].name = e.target.value
                                  updateField(["details", "work"], newWork)
                                }}
                                placeholder="Company Name"
                                className="transition-all focus-within:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                                Position
                              </label>
                              <Input
                                value={work.position}
                                onChange={(e) => {
                                  const newWork = [...resumeData.details.work]
                                  newWork[workIndex].position = e.target.value
                                  updateField(["details", "work"], newWork)
                                }}
                                placeholder="Position Title"
                                className="transition-all focus-within:border-primary"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                Start Date
                              </label>
                              <Input
                                value={work.startDate}
                                onChange={(e) => {
                                  const newWork = [...resumeData.details.work]
                                  newWork[workIndex].startDate = e.target.value
                                  updateField(["details", "work"], newWork)
                                }}
                                placeholder="Jan 2020"
                                className="transition-all focus-within:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                End Date
                              </label>
                              <Input
                                value={work.endDate}
                                onChange={(e) => {
                                  const newWork = [...resumeData.details.work]
                                  newWork[workIndex].endDate = e.target.value
                                  updateField(["details", "work"], newWork)
                                }}
                                placeholder="Present"
                                className="transition-all focus-within:border-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                              Key Achievements & Responsibilities
                            </label>
                            <div className="space-y-3">
                              {work.highlights.map((highlight, hIndex) => (
                                <div key={hIndex} className="relative group">
                                  <Input
                                    value={highlight}
                                    onChange={(e) => {
                                      const newWork = [...resumeData.details.work]
                                      newWork[workIndex].highlights[hIndex] = e.target.value
                                      updateField(["details", "work"], newWork)
                                    }}
                                    placeholder={`Achievement ${hIndex + 1}`}
                                    className="transition-all focus-within:border-primary pl-7"
                                  />
                                  <CheckCircle2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Tip: Use action verbs and quantify your achievements when possible.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="skills" className="m-0 p-6 space-y-6 focus:outline-none">
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-sky-700">
                      <Lightbulb className="h-5 w-5 text-primary text-sky-700" />
                      Skills & Expertise
                    </h2>
                  </div>

                  {resumeData.details.skills.length === 0 ? (
                    <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                      <Lightbulb className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No skills added yet</h3>
                      <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                        Skills will appear here once added to your resume.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {resumeData.details.skills.map((skill, skillIndex) => (
                        <Card
                          key={skillIndex}
                          className="shadow-sm border-none bg-muted/10 overflow-hidden transition-all"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-primary" />
                              {skill.name || "Skill Category"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                                Skill Category
                              </label>
                              <Input
                                value={skill.name}
                                onChange={(e) => {
                                  const newSkills = [...resumeData.details.skills]
                                  newSkills[skillIndex].name = e.target.value
                                  updateField(["details", "skills"], newSkills)
                                }}
                                placeholder="Skill Category (e.g., Programming Languages)"
                                className="transition-all focus-within:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                                Keywords
                              </label>

                              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {skill.keywords.map((keyword, kIndex) => (
                                  <div
                                    key={kIndex}
                                    className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2 group"
                                  >
                                    <span className="text-sm">{keyword}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => removeSkillKeyword(skillIndex, kIndex)}
                                    >
                                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2 mt-3">
                                <Input
                                  value={newSkillKeyword}
                                  onChange={(e) => setNewSkillKeyword(e.target.value)}
                                  placeholder="Add a skill (e.g., JavaScript)"
                                  className="transition-all focus-within:border-primary"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && newSkillKeyword.trim()) {
                                      e.preventDefault()
                                      addSkillKeyword(skillIndex)
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => addSkillKeyword(skillIndex)}
                                  disabled={!newSkillKeyword.trim()}
                                >
                                  Add
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Press Enter or click Add to add a skill
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="projects" className="m-0 p-6 space-y-6 focus:outline-none">
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-sky-700">
                      <FolderGit2 className="h-5 w-5 text-primary text-sky-700" />
                      Projects & Portfolio
                    </h2>
                  </div>

                  {resumeData.details.projects?.length === 0 ? (
                    <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                      <FolderGit2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No projects added yet</h3>
                      <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                        Projects will appear here once added to your resume.
                      </p>
                    </div>
                  ) : (
                    resumeData.details.projects?.map((project, projectIndex) => (
                      <Card
                        key={projectIndex}
                        className="shadow-sm border-none bg-muted/10 overflow-hidden transition-all"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <FolderGit2 className="h-4 w-4 text-primary" />
                            {project.name || "Project Name"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <FolderGit2 className="h-3.5 w-3.5 text-muted-foreground" />
                              Project Name
                            </label>
                            <Input
                              value={project.name}
                              onChange={(e) => {
                                const newProjects = [...resumeData.details.projects]
                                newProjects[projectIndex].name = e.target.value
                                updateField(["details", "projects"], newProjects)
                              }}
                              placeholder="Project Name"
                              className="transition-all focus-within:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                              Project URL
                            </label>
                            <Input
                              value={project.url || ""}
                              onChange={(e) => {
                                const newProjects = [...resumeData.details.projects]
                                newProjects[projectIndex].url = e.target.value
                                updateField(["details", "projects"], newProjects)
                              }}
                              placeholder="https://github.com/username/project"
                              className="transition-all focus-within:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                              Description
                            </label>
                            <Textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...resumeData.details.projects]
                                newProjects[projectIndex].description = e.target.value
                                updateField(["details", "projects"], newProjects)
                              }}
                              placeholder="Describe the project, its purpose, and your role"
                              className="resize-none transition-all focus-within:border-primary"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
