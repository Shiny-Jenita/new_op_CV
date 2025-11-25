"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon, Phone, Plus, Trash2 } from "lucide-react";

const proficiencyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

const languageSkills = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "speak", label: "Speak" },
];

const languagesList = [
  { value: "arabic", label: "Arabic" },
  { value: "bengali", label: "Bengali" },
  { value: "cantonese", label: "Chinese (Cantonese)" },
  { value: "mandarin", label: "Chinese (Mandarin)" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "gujarati", label: "Gujarati" },
  { value: "hindi", label: "Hindi" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "kannada", label: "Kannada" },
  { value: "korean", label: "Korean" },
  { value: "malayalam", label: "Malayalam" },
  { value: "marathi", label: "Marathi" },
  { value: "odia", label: "Odia (Oriya)" },
  { value: "polish", label: "Polish" },
  { value: "portuguese", label: "Portuguese" },
  { value: "punjabi", label: "Punjabi" },
  { value: "russian", label: "Russian" },
  { value: "spanish", label: "Spanish" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "thai", label: "Thai" },
  { value: "urdu", label: "Urdu" },
  { value: "vietnamese", label: "Vietnamese" },
];

const sixteenYearsAgo = new Date();
sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);

const ControlledInput = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  readOnly = false,
  icon: Icon,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: LucideIcon;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="min-h-[30px] w-full">
          <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#667279]">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4 right-3" />
              )}
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                className={`placeholder:text-slate-400 bg-[#F5F5F5] h-12 w-full rounded-[10px]`}
                readOnly={readOnly}
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ControlledSelect = ({
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="min-h-[30px]">
          <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#667279]">{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="h-12 px-4 text-base bg-[#F5F5F5]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function LanguagesForm({ readOnly }: { readOnly?: boolean }) {
  const { control } = useFormContext();

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    name: "languages",
    control,
  });

  const watchedLanguages = useWatch({
    control,
    name: "languages",
  });

  const getAvailableLanguages = (currentIndex: number) => {
    const selectedLanguages = watchedLanguages
      ? watchedLanguages
        .map((lang: any, index: number) => {
          if (index !== currentIndex && lang.name) {
            return lang.name;
          }
          return null;
        })
        .filter(Boolean)
      : [];

    return languagesList.filter(
      (language) => !selectedLanguages.includes(language.value)
    );
  };

  return (
    <div className="space-y-6 mt-14 px-6">
      <div className="space-y-4">
        {languageFields.map((field, index) => (
          <div key={field.id} className="relative mb-6 border-b pb-3">
            <div className="flex items-center mb-3">
              <h4 className="text-md font-medium text-[#2D6DA4]">
                {index === 0 ? "Language" : `Language ${index + 1}`}
              </h4>
              <div className="flex-1 border-t border-gray-300 mx-4"></div>

              {index >= 0 && (
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={() => removeLanguage(index)}
                  disabled={readOnly}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ControlledSelect
                name={`languages.${index}.name`}
                label="Language"
                options={getAvailableLanguages(index)}
                placeholder="Select Language"
                disabled={readOnly}
              />
              <ControlledSelect
                name={`languages.${index}.proficiency`}
                label="Proficiency"
                options={proficiencyLevels}
                placeholder="Select Proficiency"
                disabled={readOnly}
              />
            </div>

            <FormField
              control={control}
              name={`languages.${index}.skills`}
              render={({ field }) => (
                <FormItem className="min-h-[30px] mt-4">
                  <FormLabel className={`mb-2 block ${readOnly ? "text-gray-400 cursor-not-allowed" : "text-gray-800"
                    }`}>Skills</FormLabel>
                  <div className="flex gap-8 justify-start">
                    {languageSkills.map((skill) => (
                      <FormItem
                        key={skill.id}
                        className="flex flex-row items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            disabled={readOnly}
                            checked={field.value?.includes(skill.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), skill.id]
                                : field.value?.filter(
                                  (value: string) => value !== skill.id
                                );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className={`font-normal ${readOnly
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-800"
                          }`}>
                          {skill.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={readOnly || (watchedLanguages && watchedLanguages.length >= languagesList.length)}
          onClick={() =>
            appendLanguage({
              name: "",
              proficiency: "",
              skills: [],
            })
          }
          className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"

        >
          Add Language
          <Plus size={14} className="ml-auto" />
        </Button>
      </div>

    </div>
  );
}