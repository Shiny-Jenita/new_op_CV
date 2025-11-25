"use client"
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ControlledBulletTextarea, ControlledCheckbox, ControlledDatePicker } from "./WorkExperienceForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useScoreTracker } from "@/hooks/useScoreTrack";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

type Option = {
  label: string;
  value: string;
};

interface ControlledSelectProps {
  name: string;
  label: string;
  options: Option[];
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const ControlledSelect = ({
  name,
  label,
  options,
  disabled = false,
  placeholder = "Select...",
  required = false,
}: ControlledSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="min-h-[30px] w-full">
          <FormLabel className="font-medium text-sm text-[#667279]">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={disabled}
            >
              <SelectTrigger className="bg-[#F5F5F5] h-12 rounded-[10px] text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

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

export const EducationForm = ({ readOnly = false }) => {
  const { control, watch, setValue, clearErrors, trigger } = useFormContext();
  const { getScoreJson } = useScoreTracker('education');
  const allEducation = watch("education");
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });
  const hasAppended = useRef(false);

  useEffect(() => {
    if (!hasAppended.current && educationFields.length === 0) {
      appendEducation({
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
      });
      hasAppended.current = true;
    }
  }, [educationFields.length, appendEducation]);

  useEffect(() => {
    if (allEducation && Array.isArray(allEducation)) {
      allEducation.forEach((edu, idx) => {
        if (edu && edu.currentlyEnrolled && edu.endDate) {
          setValue(`education.${idx}.endDate`, "");
        }
        if (edu && edu.startDate && edu.endDate && !edu.currentlyEnrolled) {
          const startDate = new Date(edu.startDate);
          const endDate = new Date(edu.endDate);
          if (startDate > endDate) {
            setValue(`education.${idx}.endDate`, edu.startDate);
            console.log(`End date adjusted for education ${idx + 1} to maintain logical order`);
          }
        }
        // Clear score value when score type is "none"
        if (edu && edu.score && edu.score[0] && edu.score[0].type === "none" && edu.score[0].value) {
          setValue(`education.${idx}.score.0.value`, "");
        }
      });
    }
  }, [allEducation, setValue]);

  return (
    <div className="">
      <div className="space-y-4">
        {educationFields.map((field, index) => {
          const scoreType = watch(`education.${index}.score.0.type`);
          const scoreValue = watch(`education.${index}.score.0.value`);
          const startDate = watch(`education.${index}.startDate`);
          const currentlyEnrolled = watch(`education.${index}.currentlyEnrolled`);
          const scoreJson = getScoreJson(index);
          const endDate = watch(`education.${index}.endDate`);

          return (
            <div key={field.id} className="relative mb-6 pb-3">
              <div className="flex items-center mb-3">
                <h4 className="text-md font-medium text-[#2D6DA4]">
                  {index === 0 ? "Education" : `Education ${index + 1}`}
                </h4>
                <div className="flex-1 border-t border-gray-300 mx-4"></div>
                {!readOnly && educationFields.length > 0 && (
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={() => removeEducation(index)}
                    disabled={readOnly}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ControlledInput
                  name={`education.${index}.level`}
                  label="Education"
                  placeholder="Ex. Master of Science"
                  disabled={readOnly}
                  required={true}
                />
                <ControlledInput
                  name={`education.${index}.university`}
                  label="Institution"
                  placeholder="Ex. NYU"
                  disabled={readOnly}
                  required={true}
                />
              </div>
              <ControlledInput
                name={`education.${index}.location`}
                label="Location"
                placeholder="Ex. City, State"
                disabled={readOnly}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <ControlledInput
                  name={`education.${index}.major`}
                  label="Degree"
                  placeholder="Ex. Computer Science"
                  disabled={readOnly}
                  required={true}
                />
                <ControlledInput
                  name={`education.${index}.specialization`}
                  label="Specialization"
                  placeholder="Ex. Data Science"
                  disabled={readOnly}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <ControlledDatePicker
                  name={`education.${index}.startDate`}
                  label="Start Date"
                  disabled={readOnly}
                  required={true}
                  maxDate={endDate && !currentlyEnrolled ? new Date(endDate) : new Date()}
                />
                <ControlledDatePicker
                  name={`education.${index}.endDate`}
                  label="End Date"
                  disabled={readOnly || !startDate || currentlyEnrolled}
                  minDate={startDate ? new Date(startDate) : undefined}
                  required={!currentlyEnrolled}
                  conditional={true}
                  conditionalField={`education.${index}.currentlyEnrolled`}
                />

              </div>
              <div className="mt-4">
                <ControlledCheckbox
                  name={`education.${index}.currentlyEnrolled`}
                  label="Currently Enrolled"
                  disabled={readOnly}
                  onChange={(checked) => {
                    if (checked) {
                      // Clear the endDate value and its validation error
                      setValue(`education.${index}.endDate`, "");
                      clearErrors(`education.${index}.endDate`);
                    } else {

                      trigger(`education.${index}.endDate`);
                    }
                  }}

                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <FormField
                  control={control}
                  name={`education.${index}.score.0.type`}
                  render={({ field }) => (
                    <FormItem className="min-h-[30px] w-full">
                      <FormLabel className="font-medium text-sm text-[#667279]">
                        GPA / CGPA
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Clear the score value when "none" is selected
                            if (value === "none") {
                              setValue(`education.${index}.score.0.value`, "");
                            }
                          }}
                          value={field.value ?? ""}
                          disabled={readOnly}
                        >
                          <SelectTrigger className="bg-[#F5F5F5] h-12 rounded-[10px] text-sm">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="cgpa">CGPA</SelectItem>
                            <SelectItem value="gpa">GPA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.score.0.value`}
                  rules={{
                    validate: (value: any) => {
                      if (scoreType && scoreType !== "none") {
                        if (value == null) {
                          return "Value is required when GPA/CGPA is selected";
                        }
                        if (typeof value === "string") {
                          if (value.trim() === "") {
                            return "Value is required when GPA/CGPA is selected";
                          }
                        }
                        else {
                          value = String(value);
                          if (value.trim() === "") {
                            return "Value is required when GPA/CGPA is selected";
                          }
                        }
                      }
                      if (value != null) {
                        let strVal: string;
                        if (typeof value === "string") {
                          strVal = value.trim();
                        } else {
                          if (typeof value === "number") {
                            strVal = String(value);
                          } else {
                            return "Score must be a valid number";
                          }
                        }
                        if (strVal !== "" && !/^[0-9]*\.?[0-9]+$/.test(strVal)) {
                          return "Score must be a valid number";
                        }
                      }
                      return true;
                    }

                  }}

                  render={({ field }) => (
                    <FormItem className="min-h-[30px] w-full">
                      <FormLabel className="text-sm text-[#667279]">
                        Value
                        {(scoreType === "gpa" || scoreType === "cgpa") && (
                          <span className="text-red-500"> *</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            scoreType === "gpa"
                              ? "Enter GPA (e.g., 3.8)"
                              : scoreType === "cgpa"
                                ? "Enter CGPA (e.g., 9.1)"
                                : "Enter Score"
                          }
                          disabled={readOnly || !scoreType || scoreType === "none"}

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
              </div>

              <div className="mt-4">
                <ControlledBulletTextarea
                  name={`education.${index}.description`}
                  label="Description"
                  placeholder="• List your coursework, achievements and other relevant details"
                  disabled={readOnly}
                  required={false}
                />
              </div>
              <input
                type="hidden"
                name={`education.${index}.scoreJson`}
                value={scoreJson}
              />
            </div>
          );
        })}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => {
            appendEducation({
              level: "",
              university: "",
              major: "",
              specialization: "",
              startDate: "",
              endDate: "",
              score: [
                { type: "none", value: "" }
              ],
              description: [],
              scoreJson: "{}"
            });
          }}
          disabled={readOnly}
          className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
        >
          Add Education
          <Plus size={14} className="ml-auto" />
        </Button>
      </div>
    </div>
  );
};