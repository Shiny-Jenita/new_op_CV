"use client";

import { useState, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { resumeFormSchema } from "@/app/schemas/profileSchema";
import Stepper from "./forms/Stepper";
import { useProfileStore } from "@/stores/profileData/profileStore";
import { useRouter } from "next/navigation";
import { MdEditDocument } from "react-icons/md";
import { HiDocumentCheck } from "react-icons/hi2";
import { StepTwoForm } from "./forms/StepTwoForm";
import { StepThreeForm } from "./forms/StepThreeForm";
import { StepOneForm } from "./forms/StepOneForm";
import { useResumeStore } from "@/stores/resume/resumeStore";

type FormData = yup.InferType<typeof resumeFormSchema>;
interface StepComponentProps {
  readOnly?: boolean;
  isCreateForm?: boolean;
}

const steps = [
  { label: "Basic Info", component: StepOneForm as React.ComponentType<StepComponentProps> },
  { label: "Work Experience", component: StepTwoForm as React.ComponentType<StepComponentProps> },
  { label: "Education", component: StepThreeForm as React.ComponentType<StepComponentProps> },
];

const hasMeaningfulData = (obj: Record<string, any>) => {
  return Object.entries(obj).some(([key, value]) => {
    if (key === 'score' && typeof value === 'object' && value !== null) {
      return Object.values(value).some(v =>
        typeof v === 'string' && v.trim() !== '');
    }

    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null) {
      return hasMeaningfulData(value);
    }
    return value !== null && value !== undefined;
  });
};

const filterMeaningfulEntries = (array?: Record<string, any>[]) => {
  return Array.isArray(array) ? array.filter(hasMeaningfulData) : [];
};

export default function ProfileForm({
  readOnly = false,
  isEditForm = false,
  isCreateForm = false,
  onClose,
}: {
  readOnly?: boolean;
  isEditForm?: boolean;
  isCreateForm?: boolean;
  onClose?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  // Add state to store form data across steps
  const [formData, setFormData] = useState<Partial<FormData>>({});
  
  const route = useRouter();
  const { profileData, updateProfileData, fetchProfileData } = useProfileStore();
  const { generateResumeFromProfile } = useResumeStore();

  const getSafeDefaults = (data: Partial<FormData> = {}): FormData => ({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    dob: data.dob || "",
    email: data.email || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    zipcode: data.zipcode || "",
    phone: data.phone || "",
    currentTitle: data.currentTitle || "",
    industry: data.industry || "",
    websites: data.websites || [],
    languages: data.languages || [],
    experience:
      data.experience && data.experience.length > 0
        ? data.experience
        : [
            {
              companyName: "",
              jobTitle: "",
              location: "",
              skills: [],
              startDate: "",
              endDate: "",
              currentlyWorking: false,
              responsibilities: [],
            },
          ],
    projects: data.projects || [],
    education:
      Array.isArray(data.education) && data.education.length > 0
        ? data.education.map((edu) => ({
            ...edu,
            score: edu?.score || [{ type: "", value: "" }],
          }))
        : [
            {
              level: "",
              university: "",
              major: "",
              specialization: "",
              location: "",
              currentlyEnrolled: false,
              startDate: "",
              endDate: "",
              score: [{ type: "none", value: "" }],
              description: [],
              scoreJson: "{}",
            },
          ],
    certifications: data.certifications || [],
    publications: data.publications || [],
  });

  const methods = useForm<FormData>({
    resolver: yupResolver(resumeFormSchema),
    mode: "onChange",
    defaultValues: isCreateForm ? getSafeDefaults() : getSafeDefaults(profileData),
  });
  const { reset, trigger, getValues, setValue } = methods;

  useEffect(() => {
    if (!isCreateForm) {
      fetchProfileData();
    }
  }, [fetchProfileData, isCreateForm]);

  useEffect(() => {
    if (!isCreateForm) {
      // Merge profileData with formData, giving priority to formData for user input
      const mergedData = { ...profileData };
      
      // Only merge non-empty values from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'string' && value.trim() !== '') {
            mergedData[key] = value;
          } else if (Array.isArray(value) && value.length > 0) {
            mergedData[key] = value;
          } else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
            mergedData[key] = value;
          } else if (typeof value === 'boolean' || typeof value === 'number') {
            mergedData[key] = value;
          }
        }
      });
      
      reset(getSafeDefaults(mergedData));
    }
  }, [profileData, reset, isCreateForm, formData]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFirstError = () => {
    const firstError = document.querySelector('[data-state="error"]');
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getStepData = (currentStep: number, allData: FormData) => {
    switch (currentStep) {
      case 0:
        return {
          firstName: allData.firstName,
          lastName: allData.lastName,
          dob: allData.dob,
          email: allData.email,
          address: allData.address,
          city: allData.city,
          state: allData.state,
          country: allData.country,
          zipcode: allData.zipcode,
          phone: allData.phone,
          currentTitle: allData.currentTitle,
          industry: allData.industry,
          websites: allData.websites,
          languages: allData.languages,
        };
      case 1:
        return {
          experience: allData.experience,
          projects: allData.projects,
        };
      case 2:
        return {
          education: allData.education,
          certifications: allData.certifications,
          publications: allData.publications,
        };
      default:
        return {};
    }
  };

  // Function to save current step data (only meaningful values)
  const saveCurrentStepData = (saveEmpty = false) => {
    const currentFormData = getValues();
    const stepData = getStepData(step, currentFormData);
    
    if (saveEmpty) {
      // When going back, save all values to preserve user input
      setFormData(prev => ({ ...prev, ...stepData }));
    } else {
      // When going forward, only save meaningful data
      const cleanedStepData = cleanMeaningfulData(stepData);
      setFormData(prev => ({ ...prev, ...cleanedStepData }));
    }
  };

  // Function to clean data and keep only meaningful values
  const cleanMeaningfulData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.filter(item => {
        if (typeof item === 'object' && item !== null) {
          return hasMeaningfulData(item);
        }
        return item !== null && item !== undefined && item !== '';
      }).map(cleanMeaningfulData);
    }
    
    if (typeof data === 'object' && data !== null) {
      const cleaned: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          cleaned[key] = value;
        } else if (Array.isArray(value)) {
          const cleanedArray = cleanMeaningfulData(value);
          if (cleanedArray.length > 0) {
            cleaned[key] = cleanedArray;
          }
        } else if (typeof value === 'object' && value !== null) {
          const cleanedObject = cleanMeaningfulData(value);
          if (Object.keys(cleanedObject).length > 0) {
            cleaned[key] = cleanedObject;
          }
        } else if (typeof value === 'boolean' || typeof value === 'number') {
          cleaned[key] = value;
        }
      });
      return cleaned;
    }
    
    return data;
  };

  // Function to ensure minimum required empty forms for user interaction
  const ensureMinimumForms = (data: FormData): FormData => {
    const result = { ...data };
    
    // Ensure at least one experience form if none exist
    if (!result.experience || result.experience.length === 0) {
      result.experience = [
        {
          companyName: "",
          jobTitle: "",
          location: "",
          skills: [],
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          responsibilities: [],
        },
      ];
    }
    
    // Ensure at least one education form if none exist
    if (!result.education || result.education.length === 0) {
      result.education = [
        {
          level: "",
          university: "",
          major: "",
          specialization: "",
          location: "",
          currentlyEnrolled: false,
          startDate: "",
          endDate: "",
          score: [{ type: "none", value: "" }],
          description: [],
          scoreJson: "{}",
        },
      ];
    }
    
    return result;
  };

  const handleConfirm = () => {
    const data = getValues();

    const getMonthYearFromDate = (
      date: Date | string | null | undefined
    ): string => {
      if (!date) return "";
      try {
        const d = typeof date === "string" ? new Date(date) : date;
        if (isNaN(d.getTime())) return "";
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];
        return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      } catch {
        return "";
      }
    };

    const transformResumeData = (data: any) => ({
      profile: {
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        email: data.email || "",
        phone: data.phone || "",
        designation: data.currentTitle || "",
        location: `${data.city || ""}, ${data.state || ""}, ${data.country || ""}`
          .replace(/(, )+/g, ", ")
          .replace(/^,|,$/g, "")
          .trim(),
        websites: data.websites || [],
        summary: data.summary || "",
      },
      experiences: (data.experience || []).map((exp: any) => ({
        company: exp.companyName || "",
        position: exp.jobTitle || "",
        date: `${getMonthYearFromDate(exp.startDate)} - ${exp.currentlyWorking ? "Present" : getMonthYearFromDate(exp.endDate)}`,
        description: exp.responsibilities || [],
      })),
      education: (data.education || []).map((edu) => ({
        university: edu.university || "",
        level: edu.level || "",
        major: edu.major || "",
        specialization: edu.specialization || "",
        date: `${getMonthYearFromDate(edu.startDate)} - ${getMonthYearFromDate(edu.endDate) || ""}`,
        gpa: (edu.score || []).map((s) => s.value).filter((v) => v !== ""),
        description: edu.description || [],
      })),
      projects: (data.projects || []).map((proj) => ({
        projectName: proj.projectName || "",
        projectDescription: proj.projectDescription || [],
      })),
      skills: Array.from(
        new Set(
          data.experience?.flatMap((exp) => exp.skills || []) || []
        )
      ).map((skill) => ({ name: skill })),
      others: {
        languages: (data.languages || []).map((lang) => ({
          name: lang.name || lang || "",
        })),
        certifications: (data.certifications || []).map((cert) => ({
          certificateName: cert.name || "",
          completionId: cert.completionId || "",
          date: `${getMonthYearFromDate(cert.startDate)} - ${getMonthYearFromDate(cert.endDate) || ""}`,
          url: cert.url || "",
        })),
        publications: data.publications || [],
      },
    });

    console.log("Final Resume JSON:", data);

    if (isEditForm && isCreateForm) {
      generateResumeFromProfile({ profile_json: transformResumeData(data) });
      route.push("/resume-generation/generate-from-profile");
    } else {
      route.push("/my-profile");
    }
  };

  const nextStep = async () => {
    scrollToTop();
    
    if (!readOnly && !previewMode && step === 0) {
      const valid = await trigger([
        "firstName",
        "lastName",
        "city",
        "state",
        "country",
        "phone",
        "currentTitle",
      ]);

      if (!valid) {
        scrollToFirstError();
        return;
      }
      const allWebsites: { type: string; url: string }[] =
        getValues("websites") || [];
      const filteredWebsites = allWebsites.filter(
        (w) => w.url && w.url.trim() !== ""
      );
      setValue("websites", filteredWebsites, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }

    if (!readOnly) {
      const allData = getValues();
      const cleanedData = {
        ...getStepData(step, allData),
      };

      if (step === 1) {
        const valid = await trigger(["experience", "projects"]);
        if (!valid) {
          scrollToFirstError();
          return;
        }

        cleanedData.experience = filterMeaningfulEntries(allData.experience);
        cleanedData.projects = filterMeaningfulEntries(allData.projects);
      }

      if (step === 2) {
        const educationFields = allData.education?.map((_, index) => [
          `education.${index}.level`,
          `education.${index}.university`,
          `education.${index}.major`,
          `education.${index}.startDate`,
          `education.${index}.endDate`,
          `education.${index}.score.0.type`,
          `education.${index}.score.0.value`,
        ]).flat() || [];

        const valid = await trigger([
          "certifications",
          "publications",
          ...educationFields,
        ]);

        if (!valid) {
          scrollToFirstError();
          return;
        }

        const isEditCreate = isEditForm && isCreateForm;

        if (isEditCreate) {
          setPreviewMode(true);
          return;
        } else {
          route.push("/create-new-profile/preview");
        }

        const cleanedEducation = filterMeaningfulEntries(allData.education);
        cleanedData.education = cleanedEducation.map((edu) => {
          let scoreData = { type: "", value: "" };

          try {
            if (edu?.scoreJson) {
              scoreData = JSON.parse(edu.scoreJson);
            } else if (edu?.score?.[0]) {
              scoreData = {
                type: edu.score[0].type || "",
                value: edu.score[0].value || "",
              };
            }
          } catch (e) {
            console.error("Error parsing score JSON:", e);
          }

          return {
            ...edu,
            score: scoreData,
            scoreJson: undefined,
          };
        });

        cleanedData.certifications = filterMeaningfulEntries(allData.certifications);
        cleanedData.publications = filterMeaningfulEntries(allData.publications);
      }

      cleanedData.websites = allData.websites;

      // Save meaningful data to local state (only non-empty values)
      const cleanedMeaningfulData = cleanMeaningfulData(cleanedData);
      setFormData(prev => ({ ...prev, ...cleanedMeaningfulData }));

      if (!isCreateForm) {
        updateProfileData(cleanedData);
      }

      if (step === steps.length - 1) {
        if (!isEditForm) {
          route.push("/create-new-profile/preview");
        } else if (onClose && !isCreateForm) {
          onClose();
        } else {
          setPreviewMode(true);
        }
      } else {
        setStep((s) => s + 1);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    // Save current step data including empty values to preserve user input
    saveCurrentStepData(true);
    setStep((s) => s - 1);
  };

  const renderStepContent = () => {
    const StepComponent = steps[step].component;
    return <StepComponent readOnly={readOnly || previewMode} isCreateForm={isCreateForm} />;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 justify-center items-center bg-white p-6 md:p-10 overflow-y-auto scrollbar-hide"
    >
      <FormProvider {...methods}>
        <form className="max-w-3xl mx-auto">
          <Stepper
            steps={steps.map((s) => s.label)}
            activeStep={step + 1}
            isPreview={readOnly || previewMode}
          />

          {(readOnly || previewMode) ? (
            <div className="mt-6 space-y-6">
              <StepOneForm readOnly isCreateForm={isCreateForm} />
              <StepTwoForm readOnly />
              <StepThreeForm readOnly />
            </div>
          ) : (
            renderStepContent()
          )}

          {(readOnly || previewMode) && (
            <div className="flex justify-end mt-4 gap-4">
              <Button
                type="button"
                onClick={() => {
                  if (isCreateForm) {
                    setPreviewMode(false);
                    setStep(0);
                  } else {
                    route.push("/create-new-profile");
                  }
                }}
                className="bg-slate-800 hover:bg-slate-700 w-22 p-2 flex items-center justify-center gap-1"
              >
                Edit Details<MdEditDocument />
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 w-22 p-2 rounded flex items-center justify-center gap-1"
              >
                Confirm<HiDocumentCheck />
              </Button>
            </div>
          )}
          {!readOnly && !previewMode && (
            <div className="flex justify-end space-x-3 mt-8">
              {step > 0 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="w-16 p-2 rounded-md"
                >
                  Prev
                </Button>
              )}
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
              >
                {isEditForm && step === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}