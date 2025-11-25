"use client";

import { BasicInfoForm } from "./BasicInfoForm";
import { LanguagesForm } from "./Languagesform";

type StepOneFormProps = {
  readOnly?: boolean;
  isCreateForm?: boolean;
};

export function StepOneForm({ readOnly = false, isCreateForm }: StepOneFormProps) {
  return (
    <div className="space-y-4 mt-16">
      <BasicInfoForm readOnly={readOnly} isCreateForm={isCreateForm} />
      <LanguagesForm readOnly={readOnly} />
    </div>
  );
}
