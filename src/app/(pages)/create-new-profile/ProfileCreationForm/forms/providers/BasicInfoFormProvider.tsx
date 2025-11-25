
"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { BasicInfoForm } from "../BasicInfoForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface WebsiteLink {
  type: string;
  url: string;
}

export interface BasicInfoFormData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
  currentTitle: string;
  industry: string;
  websites: WebsiteLink[];
}

interface BasicInfoFormWithProviderProps {
  existingData?: BasicInfoFormData;
  onSave: (data: BasicInfoFormData) => void;
  onCancel?: () => void;
}
const validateWebsiteUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return true; 
  const cleanUrl = url.replace(/^https?:\/\//, '');
  if (!cleanUrl.startsWith('www.')) {
    return false;
  }
  const urlPattern = /^www\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\w\.-]*)*\/?$/;
  return urlPattern.test(cleanUrl);
};
const cleanWebsiteUrl = (url: string): string => {
  if (!url || url.trim() === "") return "";
  
  const cleanUrl = url.replace(/^https?:\/\//, '').trim();
  
  return cleanUrl;
};

const BasicInfoFormWithProvider = ({
  existingData,
  onSave,
  onCancel,
}: BasicInfoFormWithProviderProps) => {
  const loggedInEmail = localStorage.getItem("userEmail") || "";
  const cleanExistingData = existingData ? {
    ...existingData,
    websites: existingData.websites
      .filter(website => 
        website && website.url && website.url.trim() !== ""
      )
      .map(website => ({
        ...website,
        url: cleanWebsiteUrl(website.url)
      }))
  } : null;
 
  const defaultValues: BasicInfoFormData = cleanExistingData ?? {
    firstName: "",
    lastName: "",
    dob: "",
    email: loggedInEmail,
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
    currentTitle: "",
    industry: "",
    websites: [
      { type: "linkedin", url: "" },
    ],
  };

  const methods = useForm<BasicInfoFormData>({
    mode: "onSubmit",
    defaultValues,
  });

  const handleSubmit = (data: BasicInfoFormData) => {
    // Validate and clean website URLs
    const websiteValidationErrors: string[] = [];
    
    const cleanedWebsites = data.websites
      .filter(website => 
        website &&
        website.url &&
        website.url.trim() !== "" &&
        website.type &&
        website.type.trim() !== ""
      )
      .map((website, index) => {
        const cleanedUrl = cleanWebsiteUrl(website.url);
        
        // Validate the cleaned URL
        if (!validateWebsiteUrl(cleanedUrl)) {
          websiteValidationErrors.push(
            `Website ${index + 1}: URL must start with www. (e.g., www.example.com)`
          );
        }
        
        return {
          ...website,
          url: cleanedUrl
        };
      });

    // If there are validation errors, show them and prevent submission
    if (websiteValidationErrors.length > 0) {
      // Set form errors for website fields
      websiteValidationErrors.forEach((error, index) => {
        const websiteIndex = data.websites.findIndex((website, i) => 
          website && website.url && website.url.trim() !== "" && 
          !validateWebsiteUrl(cleanWebsiteUrl(website.url))
        );
        
        if (websiteIndex !== -1) {
          methods.setError(`websites.${websiteIndex}.url`, {
            type: "manual",
            message: "Invalid URL (e.g., www.example.com)"
          });
        }
      });
      
      // Show general error message
      console.error("Website URL validation errors:", websiteValidationErrors);
      return;
    }

    // Filter out websites with empty URLs before saving
    const cleanedData = {
      ...data,
      websites: cleanedWebsites
    };
         
    console.log("Original data:", data);
    console.log("Cleaned data:", cleanedData);
         
    onSave(cleanedData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
                
        <BasicInfoForm readOnly={false} />
                
        <div className="flex justify-end gap-4 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              methods.reset(defaultValues);
              onCancel?.();
            }}
          >
            Cancel
          </Button>
                     
          <Button
            type="submit"
            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
        
        {methods.formState.isSubmitted && !methods.formState.isValid && (
          <div className="px-6">
            <p className="text-red-600 text-sm text-right">
              Please fill all required fields before saving.
            </p>
            {/* Show website-specific errors */}
            {Object.keys(methods.formState.errors).some(key => key.startsWith('websites')) && (
              <div className="mt-2 text-red-600 text-sm">
                <p className="font-medium">Website URL Issues:</p>
                <ul className="list-disc list-inside mt-1">
                  {Object.entries(methods.formState.errors)
                    .filter(([key]) => key.startsWith('websites'))
                    .map(([key, error]) => (
                      <li key={key}>
                        {error?.message || "Invalid website URL format"}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default BasicInfoFormWithProvider;