"use client";

import * as React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ControlledBulletTextarea } from "./WorkExperienceForm";

type ControlledInputProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
};

const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        validate: (val: any) =>
          required && (!val || val.length === 0)
            ? `* ${label} is required`
            : true,
      }}
      render={({ field }) => (
        <FormItem className="min-h-[30px] w-full">
          <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#667279]">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className="placeholder:text-slate-400 bg-[#F5F5F5] h-12 w-full rounded-[10px]"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


export function ProjectsForm({ readOnly }: { readOnly?: boolean }) {
  const { control } = useFormContext();

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    name: "projects",
    control,
  });

  return (
    <div className="space-y-6">
      {projectFields.map((field, index) => (
        <div key={field.id} className="relative mb-4 pb-3">
          <div className="flex items-center mb-3">
            <h4 className="text-md font-medium text-[#2D6DA4]">
              {index === 0 ? "Project" : `Project ${index + 1}`}
            </h4>
            <div className="flex-1 border-t border-[#2D6DA4] mx-4" />
            {!readOnly && (
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => removeProject(index)}
                disabled={readOnly}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ControlledInput
                name={`projects.${index}.projectName`}
                label="Project Title"
                placeholder="Enter project title"
                disabled={readOnly}
                required={true}
              />
              <ControlledInput
                name={`projects.${index}.projectUrl`}
                label="Project URL"
                placeholder="Enter project URL"
                disabled={readOnly}
              />
            </div>
            <ControlledBulletTextarea
              name={`projects.${index}.projectDescription`}
              label="Description"
              placeholder="• List your project details"
              disabled={readOnly}
              required={false}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="default"
        disabled={readOnly}
        size="sm"
        onClick={() =>
          appendProject({
            projectName: "",
            projectUrl: "",
            projectDescription: [],
          })
        }
        className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
      >
        Add Project
        <Plus size={14} className="ml-auto"/>
      </Button>
    </div>
  );
}
