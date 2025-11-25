"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { PublicationForm } from "../PublicationsForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Publication {
  title: string;
  author: string;
  description: string;
  publishedDate: string;
  publisherUrl: string;
}

interface PublicationFormWithProviderProps {
  existingPublications: Publication[];
  onSave: (publications: Publication[]) => void;
  onCancel?: () => void;
}

const PublicationFormWithProvider = ({
  existingPublications,
  onSave,
  onCancel,
}: PublicationFormWithProviderProps) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      publications:
        existingPublications.length > 0
          ? existingPublications
          : [
              {
                title: "",
                author: "",
                description: "",
                publishedDate: "",
                publisherUrl: "",
              },
            ],
    },
  });
const handleSubmit = (data: { publications: Publication[] }) => {
  const cleanedPublications = data.publications.map(pub => ({
    ...pub,
    description: Array.isArray(pub.description)
      ? pub.description.filter(desc => desc && desc.trim() !== "")
      : [],
  }));

  onSave(cleanedPublications);
};

  // const handleSubmit = (data: { publications: Publication[] }) => {
  //   onSave(data.publications);
  // };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <PublicationForm readOnly={false} />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({
                  publications:
                    existingPublications.length > 0
                      ? existingPublications
                      : [
                          {
                            title: "",
                            author: "",
                            description: "",
                            publishedDate: "",
                            publisherUrl: "",
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

export default PublicationFormWithProvider;
