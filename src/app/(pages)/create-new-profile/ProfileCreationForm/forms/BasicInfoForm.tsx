"use client";

import { useFieldArray, useFormContext, RegisterOptions, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { LucideIcon, Phone, Plus, Trash2, Check, ChevronDown, Search, Globe } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { MdWeb } from "react-icons/md";

import { PhoneInputSection } from "@/components/ui/PhoneInput";

const websiteTypes = [
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { value: "github", label: "GitHub", icon: FaGithub },
  { value: "portfolio", label: "Portfolio", icon: MdWeb },
  { value: "other", label: "Other", icon: FaGlobe },
];

const sixteenYearsAgo = new Date();
sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
const validateWebsiteUrl = (value: string) => {
  if (!value) return true; // Allow empty values
  
  // Remove https:// if user typed it
  const cleanUrl = value.replace(/^https?:\/\//, '');
  
  // Check if URL starts with www.
  if (!cleanUrl.startsWith('www.')) {
    return "URL must start with www. (e.g., www.example.com)";
  }
  
  // Basic URL pattern validation (after www.)
  const urlPattern = /^www\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\w\.-]*)*\/?$/;
  if (!urlPattern.test(cleanUrl)) {
    return "Please enter a valid URL format (e.g., www.example.com)";
  }
  
  return true;
};

const ControlledInput = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  readOnly = false,
  required = false,
  icon: Icon,
  rules,
}: {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  rules?: RegisterOptions;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      rules={required ? { required: `* ${label} is required` } : {}}
      render={({ field, fieldState }) => {
        const hasError = fieldState.invalid;
        return (
          <FormItem className="min-h-[30px] w-full">
            <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#667279]">{label} {required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
              <div className="relative">
                {Icon && (
                  <Icon className="absolute top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4 right-3" />
                )}
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  value={field.value || ""} // Ensure controlled input
                  className={`placeholder:text-slate-400 bg-[#F5F5F5] h-12 w-full rounded-[10px] ${hasError
                    ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border border-transparent"
                    }`}
                  readOnly={readOnly}
                  disabled={disabled}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const ControlledSelect = ({
  name,
  label,
  options,
  placeholder,
  disabled = false,
  usedValues = [],
  currentValue = null,
}: {
  name: string;
  label?: string;
  options: { value: string; label: string; icon?: LucideIcon | any }[];
  placeholder?: string;
  disabled?: boolean;
  usedValues?: string[];
  currentValue?: string | null;
}) => {
  const { control, watch } = useFormContext();
  const selectedValue = watch(name);
  
  // Filter options but always include the current value to prevent loss of selection
  const filteredOptions = options.filter(option =>
    option.value === selectedValue || option.value === currentValue || !usedValues.includes(option.value)
  );

  const selectedOption = filteredOptions.find((opt) => opt.value === selectedValue);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-sm text-[#667279]">{label}</FormLabel>
          <Select {...field}             
           onValueChange={field.onChange} value={field.value || ""} disabled={disabled}>
            <FormControl>
              
              <SelectTrigger className="h-12 w-16 px-2 text-base bg-[#F5F5F5]">
                <SelectValue
                  placeholder={placeholder}
                  className="flex items-center gap-2"
                >
                  {selectedOption?.icon ? (
                    <selectedOption.icon className="h-5 w-5 text-gray-700" />
                  ) : (
                    <span className="text-gray-400">{placeholder}</span>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="h-4 w-4" />}
                    <span>{option.label}</span>
                  </div>
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

export function BasicInfoForm({
  readOnly = false,
  isCreateForm = false,
}: {
  readOnly?: boolean;
  isCreateForm?: boolean;
}) {
  const { control, watch, setValue, getValues, trigger } = useFormContext();
  const [countries, setCountries] = useState<any[]>([]);
  
    useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd")
      .then(res => res.json())
      .then((data: any[]) => {
        const list = data
          .map((country) => ({
            value: country.name?.common || '',
            label: country.name?.common || '',
            flagUrl: country.flags?.svg || '',
            dialCode: country.idd?.root && country.idd?.suffixes?.[0] 
              ? `${country.idd.root}${country.idd.suffixes[0]}` 
              : '',
          }))
          .filter(item => item.label) // Filter out any items without labels
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setCountries(list);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const selectedCountry = watch("country");
  const phoneValue = watch("phone");
  const currentCountry = countries.find((c) => c.label === selectedCountry);
  const userNumber = phoneValue?.split(" ")[1] || "";

  const {
    fields: websiteFields,
    append: appendWebsite,
    remove: removeWebsite,
    update,
  } = useFieldArray({
    name: "websites",
    control,
  });

  const websiteValues = watch("websites") || [];
 

  useEffect(() => {
    const currentWebsites = getValues("websites") || [];
    let needsUpdate = false;
    
    const updatedWebsites = currentWebsites.map((website: any, index: number) => {
      if (!website || typeof website !== 'object') {
        needsUpdate = true;
        return { type: "", url: "" };
      }
      if (!website.hasOwnProperty('type') || !website.hasOwnProperty('url')) {
        needsUpdate = true;
        return { 
          type: website.type || "", 
          url: website.url || "" 
        };
      }
      return website;
    });

    if (needsUpdate) {
      setValue("websites", updatedWebsites);
      trigger("websites");
    }
  }, [websiteFields, setValue, getValues, trigger]);

  const handleRemoveWebsite = (index: number) => {
    removeWebsite(index);
    setTimeout(() => {
      trigger("websites");
    }, 0);
  };

  const handleAddWebsite = () => {
    const usedPlatforms = websiteValues.map((w: any) => w?.type).filter(Boolean);
    const unusedPlatform = websiteTypes.find(
      type => !usedPlatforms.includes(type.value)
    );

    if (unusedPlatform) {
      appendWebsite({
        type: unusedPlatform.value,
        url: "",
      });
      setTimeout(() => {
        trigger("websites");
      }, 0);
    }
  };

  return (
    <div className="space-y-6 mt-14 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ControlledInput
          name="firstName"
          label="First Name"
          placeholder="John"
          disabled={readOnly}
          required={true}
        />
        <ControlledInput
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          disabled={readOnly}
          required={true}
        />
      </div>

      <ControlledInput
        name="email"
        label="Email"
        placeholder="john.doe@example.com"
        type="email"
        disabled={readOnly}
        readOnly={!isCreateForm}
        icon={MdOutlineEmail}
        required={true}
      />

      <ControlledInput
        name="address"
        label="Address"
        placeholder="123 Main St"
        disabled={readOnly}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ControlledInput
          name="city"
          label="City"
          placeholder="Enter City"
          disabled={readOnly}
          icon={MdOutlineLocationOn}
          required={true}
        />
        <ControlledInput
          name="state"
          label="State"
          placeholder="Enter State"
          disabled={readOnly}
          required={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="country"
          rules={{ 
            required: "* Country is required",
            validate: (value) => {
              if (!value || value.trim() === "") {
                return "* Country is required";
              }
              return true;
            }
          }}
          render={({ field, fieldState }) => {
            const hasError = fieldState.invalid;
            return (
              <FormItem>
                <FormLabel className={`block ${readOnly ? "text-gray-500 cursor-not-allowed" : "text-gray-800"
                  }`}>Country <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val); // Use field.onChange instead of setValue
                      setValue("phone", `${currentCountry?.dialCode || ""} ${userNumber}`);
                    }}
                    disabled={readOnly}
                  >
                    <SelectTrigger className={`w-full flex justify-between items-center bg-[#F5F5F5] h-12 px-3 ${hasError
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-transparent"
                      }`}>
                      <div className="flex-1 flex items-center gap-2">
                        {currentCountry ? (
                          <>
                            <img src={currentCountry.flagUrl} className="w-5 h-4 rounded-sm" />
                            <span>{currentCountry.label}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Select country</span>
                        )}
                      </div>
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-auto">
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.label}>
                          <div className="flex items-center gap-2">
                            <img src={c.flagUrl} className="w-5 h-4 rounded-sm" />
                            <span>{c.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <ControlledInput
          name="zipcode"
          label="Zip Code"
          placeholder="Enter Zip Code"
          disabled={readOnly}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
          <PhoneInputSection readOnly={readOnly} required={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ControlledInput
          name="currentTitle"
          label="Title / Position"
          placeholder="Ex. Project Manager"
          disabled={readOnly}
          required={true}
        />
        <ControlledInput
          name="industry"
          label="Industry"
          placeholder="Ex. Technology"
          disabled={readOnly}
        />
      </div>

      <div className="space-y-4 border-t pt-6">
        {websiteFields.map((field, index) => {
          const currentWebsiteData = websiteValues[index] || {};
          const usedPlatforms = websiteValues
            .filter((_, i) => i !== index)
            .map((w: any) => w?.type)
            .filter(Boolean);

          return (
            <div key={field.id} className="relative mb-6 pb-3">
              <div className="flex items-center mb-3">
                <h4 className="text-md font-medium text-[#2D6DA4]">
                  {index === 0 ? "Website" : `Website ${index + 1}`}
                </h4>
                <div className="flex-1 border-t border-gray-300 mx-4"></div>

                {websiteFields.length > 0 && (
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={() => handleRemoveWebsite(index)}
                    disabled={readOnly}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <ControlledSelect
                  name={`websites.${index}.type`}
                  options={websiteTypes}
                  disabled={readOnly}
                  usedValues={usedPlatforms}
                  currentValue={currentWebsiteData.type}
                />
                <div className="flex-1">
                  <ControlledInput
                    name={`websites.${index}.url`}
                    placeholder="Enter URL"
                    type="string"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {websiteFields.length < websiteTypes.length && (
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={readOnly}
            onClick={handleAddWebsite}
            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
          >
            Add Website
            <Plus size={14} className="ml-auto" />
          </Button>
        )}
      </div>
    </div>
  );
}