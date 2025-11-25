"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerWithYearSelection from "@/components/ui/DatePickerWithYearSelection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ControlledBulletTextarea } from "./WorkExperienceForm";

const ControlledInput = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  required = false
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
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
          <FormLabel className="font-medium text-sm text-[#667279]">{label} {required && <span className="text-red-500">*</span>}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="placeholder:text-slate-400 bg-[#F5F5F5] h-12 w-full rounded-[10px]"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ControlledDatePicker = ({
  name,
  label,
  disabled = false,
  required = false,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
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
        <FormItem className="min-h-[30px]">
          <FormLabel className="font-medium text-sm text-[#667279]">{label} {required && <span className="text-red-500">*</span>}</FormLabel>
          <FormControl>
            <DatePickerWithYearSelection
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date ? date.toISOString() : "")}
              maxDate={new Date()}
              disabled={disabled}
              className="h-12 bg-[#F5F5F5]"
              monthYearOnly={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function PublicationForm({ readOnly = false }: { readOnly?: boolean }) {
  const { control } = useFormContext();
  const {
    fields: publicationFields,
    append: appendPublication,
    remove: removePublication,
  } = useFieldArray({
    name: "publications",
    control,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {publicationFields.map((field, index) => (
          <div key={field.id} className="relative mb-6 pb-3">
            <div className="flex items-center mb-3">
              <h4 className="text-md font-medium text-[#2D6DA4]">
                {index === 0 ? "Publication" : `Publication ${index + 1}`}
              </h4>
              <div className="flex-1 border-t border-gray-300 mx-4"></div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={() => removePublication(index)}
                  disabled={readOnly}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ControlledInput
                name={`publications.${index}.title`}
                label="Title"
                placeholder="Enter publication title"
                disabled={readOnly}
                required={true}
              />
              <ControlledInput
                name={`publications.${index}.author`}
                label="Author(s)"
                placeholder="Enter author(s) name (comma separated)"
                disabled={readOnly}
                required={true}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <ControlledDatePicker
                name={`publications.${index}.publishedDate`}
                label="Publication Date"
                disabled={readOnly}
                required={true}
              />
              <ControlledInput
                name={`publications.${index}.publisherUrl`}
                label="URL"
                placeholder="Enter publication URL"
                disabled={readOnly}
              />
            </div>
            <div className="mt-4">
              <ControlledInput
                name={`publications.${index}.publisher`}
                label="Publisher"
                placeholder="Enter publisher name"
                disabled={readOnly}
                required={false}
              />
            </div>

            <div className="mt-4">
              <ControlledBulletTextarea
                name={`publications.${index}.description`}
                label="Description"
                placeholder="Describe the publication"
                disabled={readOnly}
                required={false}
              />
            </div>

          </div>
        ))}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() =>
            appendPublication({
              title: "",
              author: "",
              description: [],
              publishedDate: "",
              publisherUrl: "",
              publisher: ""
            })
          }
          disabled={readOnly}
          className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
        >
          Add Publication
          <Plus size={14} className="ml-auto"/>
        </Button>
      </div>
    </div>
  );
}
