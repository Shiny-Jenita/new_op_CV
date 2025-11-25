"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, X } from "lucide-react";
import DatePickerWithYearSelection from "@/components/ui/DatePickerWithYearSelection";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ControlledBulletTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
type ControlledInputProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
};

type ControlledSkillInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const ControlledSkillInput = ({
  name,
  label,
  placeholder = "Add a skill and press Enter or click +",
  disabled = false,
  required = false,
}: ControlledSkillInputProps) => {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedSkills: string[] = field.value || [];

        const addSkill = () => {
          const trimmed = inputValue.trim();
          if (trimmed && !selectedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
            field.onChange([...selectedSkills, trimmed]);
            setInputValue("");
          }
        };

        const removeSkill = (index: number) => {
          const updated = selectedSkills.filter((_, i) => i !== index);
          field.onChange(updated);
        };

        return (
          <FormItem className="w-full space-y-2">
            <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#667279]">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="pr-10 bg-[#F5F5F5] h-12 w-full rounded-[10px] placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#2A7BC0] hover:text-[#155a96] focus:outline-none
                  ${disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#2A7BC0] hover:text-[#155a96]"
                    }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </FormControl>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSkills.map((skill, index) => (
                <div
                  key={index}
                  className={`flex items-center px-3 py-1 rounded-md ${disabled ? "bg-sky-700 opacity-50 text-white cursor-not-allowed" : "bg-[#2A7BC0] text-white"
                    }`}
                >
                  <span className="mr-2">{skill}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-white hover:text-gray-300 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
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

export const ControlledDatePicker = ({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  maxDate,
  conditional = false,
  conditionalField = "",
  minDate,
}: {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  conditional?: boolean;
  conditionalField?: string;
}) => {
  const { control, watch } = useFormContext();
  const conditionalValue = conditionalField ? watch(conditionalField) : false;
  const showRequired = required && !(conditional && conditionalValue);

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
            {label}
            {showRequired && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <DatePickerWithYearSelection
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date ? date.toISOString() : "")}
              maxDate={maxDate || new Date()}
              minDate={minDate}
              disabled={disabled || (conditional && conditionalValue)}
              className="h-12 bg-[#F5F5F5] w-full rounded-[10px]"
              monthYearOnly={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const ControlledCheckbox = ({
  name,
  label,
  disabled = false,
  onChange,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (checked: boolean) => {
          field.onChange(checked);
          if (onChange) {
            onChange(checked);
          }
        };

        return (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={handleChange}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel className="pb-1">{label}</FormLabel>
          </FormItem>
        );
      }}
    />
  );
};

interface ControlledBulletTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledBulletTextarea: React.FC<ControlledBulletTextareaProps> = ({
  name,
  label,
  placeholder = "",
  disabled = false,
  required = false,
}) => {
  const { control, formState: { errors } } = useFormContext();

  const getNestedError = (path: string, errorsObj: any): string | undefined => {
    const parts = path.split(".");
    let cur: any = errorsObj;
    for (const p of parts) {
      if (!cur[p]) return undefined;
      cur = cur[p];
    }
    return cur?.message;
  };

  const errorMessage = getNestedError(name, errors);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: string[]) => {
  if (!Array.isArray(value)) return true;

  const nonEmptyItems = value.filter((item) => item.trim() !== "");

  if (required && nonEmptyItems.length === 0) {
    return `* ${label} is required`;
  }

  return true;
}
        // validate: (value: string[]) => {
        //   const hasAnyContent = Array.isArray(value) && value.some((item) => item.trim());
        //   if (required && (!value || value.length === 0 || !hasAnyContent)) {
        //     return `* ${label} is required`;
        //   }
        //   if (hasAnyContent && value.some((item) => !item.trim())) {
        //     return "* Responsibility cannot be empty";
        //   }
        //   return true;
        // },
      }}
      render={({ field }) => {
        const lines: string[] = Array.isArray(field.value) ? field.value : [];
        const displayValue = lines.map((l) => `• ${l}`).join("\n");
        const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
          const ta = e.currentTarget;
          if (!ta.value) {
            ta.value = "• ";
            ta.setSelectionRange(2, 2);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          const ta = e.currentTarget;
          const { selectionStart, selectionEnd, value } = ta;
          if (
            value === "" &&
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey
          ) {
            e.preventDefault();
            const charPressed = e.key;
            const newValue = `• ${charPressed}`;
            ta.value = newValue;

            const newRawLines = newValue.split("\n");
            const newProcessed = newRawLines
              .map((line) => line.replace(/^([•\*\-]\s*)+/, ""))
              .filter((c) => c.trim() !== "");
            field.onChange(newProcessed);
            ta.setSelectionRange(3, 3);
            return;
          }

          if (e.key === "Backspace" && selectionStart > 0) {
            const pre = value.slice(0, selectionStart);
            const lastNL = pre.lastIndexOf("\n");
            const lineStart = lastNL + 1;

            if (value.slice(lineStart, lineStart + 2) === "• ") {
              if (selectionStart === lineStart) {
                e.preventDefault();
                const newValue = value.slice(0, lineStart) + value.slice(lineStart + 2);
                ta.value = newValue;
                const newRawLines = newValue.split("\n");
                const newProcessed = newRawLines
                  .map((line) => line.replace(/^([•\*\-]\s*)+/, ""))
                  .filter((c) => c.trim() !== "");
                field.onChange(newProcessed);

                ta.setSelectionRange(lineStart, lineStart);
                return;
              }

              if (selectionStart === lineStart + 1) {
                e.preventDefault();
                const newValue =
                  value.slice(0, selectionStart - 1) + value.slice(selectionStart);
                ta.value = newValue;
                const newRawLines = newValue.split("\n");
                const newProcessed = newRawLines
                  .map((line) => line.replace(/^([•\*\-]\s*)+/, ""))
                  .filter((c) => c.trim() !== "");
                field.onChange(newProcessed);

                const newPos = selectionStart - 1;
                ta.setSelectionRange(newPos, newPos);
                return;
              }
            }
            e.preventDefault();
            const newValue = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
            ta.value = newValue;

            const newRawLines = newValue.split("\n");
            const newProcessed = newRawLines
              .map((line) => line.replace(/^([•\*\-]\s*)+/, ""))
              .filter((c) => c.trim() !== "");
            field.onChange(newProcessed);

            const newPos = selectionStart - 1;
            ta.setSelectionRange(newPos, newPos);
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            const before = value.slice(0, selectionStart);
            const after = value.slice(selectionStart);
            const newValue = before + "\n• " + after;
            ta.value = newValue;

            const newRawLines = newValue.split("\n");
            const newProcessed = newRawLines.map((line) =>
              line.replace(/^([•\*\-]\s*)+/, "")
            );
            field.onChange(newProcessed);

            ta.setSelectionRange(before.length + 3, before.length + 3);
          }
        }

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const text = e.target.value;
          const rawLines = text.split("\n");

          const processedLines: string[] = rawLines
            .map((line) => line.replace(/^([•\*\-]\s*)+/, ""))
            .filter((content) => content.trim() !== "");

          const currentLines: string[] = Array.isArray(field.value) ? field.value : [];
          const isSame =
            processedLines.length === currentLines.length &&
            processedLines.every((v, i) => v === currentLines[i]);

          if (!isSame) {
            field.onChange(processedLines);
          }
        };

        return (
          <FormItem className="space-y-1">
            <FormLabel className="font-medium text-sm text-[#667279]">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Textarea
                value={displayValue}
                placeholder={placeholder}
                disabled={disabled}
                className="bg-gray-100 rounded-[10px] h-32 whitespace-pre-wrap placeholder:text-gray-400"
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onBlur={field.onBlur}
              />
            </FormControl>
            {errorMessage && (
              <FormMessage className="text-red-500 text-sm mt-1">
                {errorMessage}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};


export function WorkExperienceForm({ readOnly }: { readOnly?: boolean }) {
  const { control, watch, setValue, trigger } = useFormContext();

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    name: "experience",
    control,
  });
  const hasAppended = useRef(false);

  useEffect(() => {
    if (!hasAppended.current && experienceFields.length === 0) {
      appendExperience({
        companyName: "",
        jobTitle: "",
        location: "",
        skills: [],
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: [],
      });
      hasAppended.current = true;
    }
  }, []);

  const allExperience = watch("experience");

  useEffect(() => {
    if (allExperience && Array.isArray(allExperience)) {
      allExperience.forEach((exp, idx) => {
        if (exp && exp.currentlyWorking && exp.endDate) {
          setValue(`experience.${idx}.endDate`, "");
        }
      });
    }
  }, [allExperience, setValue]);
  useEffect(() => {
    if (Array.isArray(allExperience)) {
      allExperience.forEach((exp, idx) => {
        if (exp?.currentlyWorking && exp.endDate) {
          setValue(`experience.${idx}.endDate`, "");
        }

        if (
          exp &&
          exp.startDate &&
          exp.endDate &&
          !exp.currentlyWorking
        ) {
          const sd = new Date(exp.startDate);
          const ed = new Date(exp.endDate);
          if (sd > ed) {
            setValue(`experience.${idx}.endDate`, exp.startDate);
            console.log(
              `End date adjusted for experience #${idx + 1} to match startDate`
            );
          }
        }
      });
    }
  }, [allExperience, setValue]);
  const validateExperienceFields = async () => {
    return await trigger("experience");
  };

  return (
    <div className="space-y-6">
      {experienceFields.map((field, index) => {
        const startDate = watch(`experience.${index}.startDate`);
        const endDate = watch(`experience.${index}.endDate`);
        const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

        return (
          <div key={field.id} className="relative mb-6 pb-3">
            <div className="flex items-center mb-3">
              <h4 className="text-md font-medium text-[#2D6DA4]">
                {index === 0 ? "Experience" : `Experience ${index + 1}`}
              </h4>
              <div className="flex-1 border-t border-[#2D6DA4] mx-4"></div>
              {!readOnly && experienceFields.length >= 0 && (
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={() => removeExperience(index)}
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
                  name={`experience.${index}.companyName`}
                  label="Company Name"
                  placeholder="Enter company name"
                  disabled={readOnly}
                  required={true}
                />
                <ControlledInput
                  name={`experience.${index}.jobTitle`}
                  label="Job Title"
                  placeholder="Enter job title"
                  disabled={readOnly}
                  required={true}
                />
              </div>
              <ControlledInput
                name={`experience.${index}.location`}
                label="Location"
                placeholder="Ex. City, State"
                disabled={readOnly}
              />
              <ControlledSkillInput
                name={`experience.${index}.skills`}
                label="Skills"
                disabled={readOnly}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <ControlledDatePicker
                  name={`experience.${index}.startDate`}
                  label="Start Date"
                  disabled={readOnly}
                  required={true}
                  maxDate={endDate && !currentlyWorking ? new Date(endDate) : new Date()}
                />
                <ControlledDatePicker
                  name={`experience.${index}.endDate`}
                  label="End Date"
                  disabled={readOnly || currentlyWorking || !startDate}
                  minDate={startDate ? new Date(startDate) : undefined}
                  required={!currentlyWorking}
                  conditional={true}
                  conditionalField={`experience.${index}.currentlyWorking`}
                />
              </div>

              <div className="mt-4">
                <ControlledCheckbox
                  name={`experience.${index}.currentlyWorking`}
                  label="I am currently working here"
                  disabled={readOnly}
                  onChange={(checked) => {
                    if (checked) {
                      setValue(`experience.${index}.endDate`, "");
                    }
                  }}
                />
              </div>

              <ControlledBulletTextarea
                name={`experience.${index}.responsibilities`}
                label="Description"
                placeholder="• List your responsibilities and achievements"
                disabled={readOnly}
                required={true}
              />
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="default"
        disabled={readOnly}
        size="sm"
        onClick={() =>
          appendExperience({
            companyName: "",
            jobTitle: "",
            skills: [],
            startDate: "",
            location: "",
            endDate: "",
            currentlyWorking: false,
            responsibilities: [],
          })
        }
        className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
      >
        Add Experience
        <Plus size={14} />
      </Button>
    </div>
  );
}