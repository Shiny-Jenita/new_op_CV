"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { WorkExperienceForm } from "../WorkExperienceForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ExperienceFormData } from "@/app/interfaces";

interface ExperienceFormWithProviderProps {
  existingExperiences: ExperienceFormData[];
  onSave: (experiences: ExperienceFormData[]) => void;
  onCancel?: () => void;
}

const ExperienceFormWithProvider = ({
  existingExperiences,
  onSave,
  onCancel,
}: ExperienceFormWithProviderProps) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      experience:
        existingExperiences.length > 0
          ? existingExperiences
          : [
              {
                companyName: "",
                jobTitle: "",
                skills: [],
                startDate: "",
                location: "",
                endDate: "",
                currentlyWorking: false,
                responsibilities: [],
              },
            ],
    },
  });
  const isEmptyExperience = (exp: ExperienceFormData): boolean => {
    return (
      !exp.companyName?.trim() &&
      !exp.jobTitle?.trim() &&
      !exp.location?.trim() &&
      !exp.startDate?.trim() &&
      !exp.endDate?.trim() &&
      (!exp.skills || exp.skills.length === 0) &&
      (!exp.responsibilities || exp.responsibilities.length === 0)
    );
  };

  const cleanExperienceData = (experiences: ExperienceFormData[]): ExperienceFormData[] => {
    return experiences
      .filter(exp => !isEmptyExperience(exp)) // Remove completely empty entries
      .map(exp => ({
        ...exp,
        // Clean string fields
        companyName: exp.companyName?.trim() || "",
        jobTitle: exp.jobTitle?.trim() || "",
        location: exp.location?.trim() || "",
        startDate: exp.startDate?.trim() || "",
        endDate: exp.endDate?.trim() || "",
        // Clean array fields - remove empty entries
        skills: exp.skills?.filter(skill => skill?.trim()) || [],
        responsibilities: exp.responsibilities?.filter(resp => resp?.trim()) || [],
      }));
  };

  const handleSubmit = (data: { experience: ExperienceFormData[] }) => {
    const cleanedExperiences = cleanExperienceData(data.experience);
    if (cleanedExperiences.length > 0) {
      onSave(cleanedExperiences);
    } else {
      console.warn("No valid experiences to save");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <WorkExperienceForm readOnly={false} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({
                  experience:
                    existingExperiences.length > 0
                      ? existingExperiences
                      : [
                          {
                            companyName: "",
                            jobTitle: "",
                            skills: [],
                            startDate: "",
                            location: "",
                            endDate: "",
                            currentlyWorking: false,
                            responsibilities: [],
                          },
                        ],
                });
                onCancel();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
         {methods.formState.isSubmitted && !methods.formState.isValid && (
          <p className="text-red-600 text-sm text-right">
            Please fill all required fields before saving.
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export default ExperienceFormWithProvider;