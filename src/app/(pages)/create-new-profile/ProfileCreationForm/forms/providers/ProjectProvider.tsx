"use client";

import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { ProjectsForm } from "../ProjectForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Project {
  projectName: string;
  projectUrl: string;
  projectDescription: string;
}

interface ProjectFormProviderProps {
  existingProjects: Project[];
  onSave: (projects: Project[]) => void;
  onCancel?: () => void;
}

const ProjectFormWithProvider = ({ existingProjects, onSave, onCancel }: ProjectFormProviderProps) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      projects: existingProjects.length > 0
        ? existingProjects
        : []
    }
  });
const handleSubmit = (data: { projects: Project[] }) => {
  const cleanedProjects = data.projects.map(project => ({
    ...project,
    projectDescription: Array.isArray(project.projectDescription)
      ? project.projectDescription.filter(desc => desc && desc.trim() !== "")
      : [],
  }));

  onSave(cleanedProjects);
};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-6">
        <ProjectsForm readOnly={false} />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({ projects: existingProjects });
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

export default ProjectFormWithProvider;
