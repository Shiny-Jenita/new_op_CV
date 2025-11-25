"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CertificationForm } from "../CertificationsForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Certification {
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl: string;
  description: string;
}

interface CertificationFormWithProviderProps {
  existingCertifications: Certification[];
  onSave: (certifications: Certification[]) => void;
  onCancel?: () => void;
}

const CertificationFormWithProvider = ({
  existingCertifications,
  onSave,
  onCancel,
}: CertificationFormWithProviderProps) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      certifications:
        existingCertifications.length > 0
          ? existingCertifications
          : [
            {
              certificateName: "",
              issuingOrganization: "",
              issueDate: "",
              expirationDate: "",
              credentialUrl: "",
              description: "",
            },
          ],
    },
  });

  const handleSubmit = (data: { certifications: Certification[] }) => {
    onSave(data.certifications);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <CertificationForm readOnly={false} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                methods.reset({
                  certifications:
                    existingCertifications.length > 0
                      ? existingCertifications
                      : [
                        {
                          certificateName: "",
                          issuingOrganization: "",
                          issueDate: "",
                          expirationDate: "",
                          credentialUrl: "",
                          description: "",
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

export default CertificationFormWithProvider;