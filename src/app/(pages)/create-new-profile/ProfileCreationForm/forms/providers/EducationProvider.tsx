"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { EducationForm } from "../EducationForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Education, EducationFormData } from "@/app/interfaces";
import { EducationData } from "@/app/(pages)/(menu-pages)/resume-generation/pick-preview/tabs/interface";

interface EducationFormWithProviderProps {
  existingEducation: EducationData[];
  onSave: (education: Education[]) => void;
  onCancel?: () => void;
}

const EducationFormWithProvider = ({
  existingEducation,
  onSave,
  onCancel,
}: EducationFormWithProviderProps) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      education:
        existingEducation.length > 0
          ? existingEducation
          : [
              {
                level: "",
                university: "",
                major: "",
                specialization: "",
                startDate: "",
                endDate: "",
                location: "",
                score: [{ type: "gpa", value: "" }],
                description: [],
                scoreJson: "{}",
              },
            ],
    },
  });

  const handleSubmit = (data: { education: Education[] }) => {
  let hasErrors = false;

  data.education.forEach((edu, eduIndex) => {
    // Clean out empty descriptions
    edu.description = edu.description.filter(desc => desc && String(desc).trim() !== "");

    edu.score.forEach((scoreItem, scoreIndex) => {
      const fieldName = `education.${eduIndex}.score.${scoreIndex}.value` as const;

      const value = String(scoreItem.value || "").trim(); // ✅ Convert to string safely

      // Only validate if a value is present
      if (value !== "") {
        let errorMessage = "";
        const floatValue = parseFloat(value);

        const hasMoreThanTwoDecimals = (v: string) => {
          const parts = v.split(".");
          return parts.length === 2 && parts[1].length > 2;
        };

        switch (scoreItem.type) {
          case "gpa":
            if (isNaN(floatValue)) {
              errorMessage = "GPA must be a valid number";
            } else if (floatValue < 0 || floatValue > 5.0) {
              errorMessage = "GPA must be between 0.0 and 5.0";
            } else if (hasMoreThanTwoDecimals(value)) {
              errorMessage = "GPA can have at most 2 decimal places";
            }
            break;

          case "percentage":
            if (isNaN(floatValue)) {
              errorMessage = "Percentage must be a valid number";
            } else if (floatValue < 0 || floatValue > 100) {
              errorMessage = "Percentage must be between 0 and 100";
            } else if (hasMoreThanTwoDecimals(value)) {
              errorMessage = "Percentage can have at most 2 decimal places";
            }
            break;

          case "cgpa":
            if (isNaN(floatValue)) {
              errorMessage = "CGPA must be a valid number";
            } else if (floatValue < 0 || floatValue > 10) {
              errorMessage = "CGPA must be between 0 and 10";
            } else if (hasMoreThanTwoDecimals(value)) {
              errorMessage = "CGPA can have at most 2 decimal places";
            }
            break;
        }

        if (errorMessage) {
          methods.setError(fieldName, {
            type: "manual",
            message: errorMessage,
          });
          hasErrors = true;
        }
      }
    });
  });

  if (hasErrors) return;

  methods.clearErrors();
  onSave(data.education);
};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <EducationForm readOnly={false} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({
                  education:
                    existingEducation.length > 0
                      ? existingEducation
                      : [
                          {
                            level: "",
                            university: "",
                            major: "",
                            specialization: "",
                            startDate: "",
                            endDate: "",
                            location: "",
                            score: [{ type: "gpa", value: "" }],
                            description: [],
                            scoreJson: "{}",
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

export default EducationFormWithProvider;