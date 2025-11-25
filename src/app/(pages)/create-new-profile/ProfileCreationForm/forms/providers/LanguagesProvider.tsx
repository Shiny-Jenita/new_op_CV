"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LanguagesForm } from "../Languagesform";

interface Language {
  name: string;
  proficiency: string;
  skills: string[];
}

interface BasicInfoFormWithProviderProps {
  existingLanguages?: Language[];
  onSave: (languages: Language[]) => void;
  onCancel?: () => void;
}

const LanguagesProvider = ({
  existingLanguages = [],
  onSave,
  onCancel,
}: BasicInfoFormWithProviderProps) => {
  const methods = useForm<{ languages: Language[] }>({
    defaultValues: {
      languages:
        existingLanguages.length > 0
          ? existingLanguages
          : [
            { name: "", proficiency: "beginner", skills: [] },
          ],
    },
  });

  const handleSubmit = (data: { languages: Language[] }) => {
    const filteredLanguages = data.languages.filter(
      (lang) =>
        lang.name.trim() !== "" ||
        lang.skills.length > 0 ||
        (lang.proficiency && lang.proficiency !== "beginner")
    );

    onSave(filteredLanguages);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <LanguagesForm readOnly={false} />
        <div className="flex justify-end gap-4 px-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({
                  languages:
                    existingLanguages.length > 0
                      ? existingLanguages
                      : [
                        { name: "", proficiency: "beginner", skills: [] },
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

export default LanguagesProvider;
