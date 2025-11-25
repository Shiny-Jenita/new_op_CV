"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerWithYearSelection from "@/components/ui/DatePickerWithYearSelection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { ControlledDatePicker } from "./WorkExperienceForm";
import { useEffect } from "react";

const ControlledInput = ({
    name,
    label,
    placeholder,
    type = "text",
    disabled = false,
    required=false
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


export function CertificationForm({ readOnly = false }: { readOnly?: boolean }) {
    const { control,watch,setValue } = useFormContext();
    const {
        fields: certificationFields,
        append: appendCertification,
        remove: removeCertification,
    } = useFieldArray({
        name: "certifications",
        control,
        
    });
    const certifications = watch("certifications");
    useEffect(() => {
  certifications?.forEach((cert, idx) => {
    const noExpiry = cert?.noExpiry;
    const startDate = cert?.startDate;
    const endDate = cert?.endDate;

    if (noExpiry && endDate) {
      setValue(`certifications.${idx}.endDate`, "");
    }

    if (startDate && endDate && !noExpiry) {
      if (new Date(startDate) > new Date(endDate)) {
        setValue(`certifications.${idx}.endDate`, startDate);
      }
    }
  });
}, [certifications, setValue]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {certificationFields.map((field, index) => {
                   const startDate = watch( `certifications.${index}.startDate` );
                   const endDate = watch(`certifications.${index}.endDate`);
                   return(
                    <div key={field.id} className="relative mb-6 pb-3">
                        <div className="flex items-center mb-3">
                            <h4 className="text-md font-medium text-[#2D6DA4]">
                                {index === 0 ? "Certification" : `Certification ${index + 1}`}
                            </h4>
                            <div className="flex-1 border-t border-gray-300 mx-4"></div>
                            {!readOnly && (
                                <Button
                                    variant="ghost"
                                    type="button"
                                    size="icon"
                                    onClick={() => removeCertification(index)}
                                    disabled={readOnly}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>

                            )}
                        </div>
                        <ControlledInput
                            name={`certifications.${index}.name`}
                            label="Certificate Name"
                            placeholder="Ex. PMP"
                            disabled={readOnly}
                            required={true}
                        />
                        <ControlledInput
                            name={`certifications.${index}.issuer`}
                            label="Issuer"
                            placeholder="Ex. Project Management Institute"
                            disabled={readOnly}
                            required={true}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <ControlledInput
                                name={`certifications.${index}.completionId`}
                                label="Certificate ID"
                                placeholder=""
                                disabled={readOnly}
                            />
                            <ControlledInput
                                name={`certifications.${index}.url`}
                                label="Certificate URL"
                                placeholder=""
                                disabled={readOnly}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <ControlledDatePicker
                                name={`certifications.${index}.startDate`}
                                label="Issue Date"
                                disabled={readOnly}
                                maxDate={endDate ? new Date(endDate) : new Date()}
                            />
                            <ControlledDatePicker
                                name={`certifications.${index}.endDate`}
                                label="Expiration Date"
                                disabled={readOnly || !startDate}
                                minDate={startDate ? new Date(startDate) : undefined} 
                            />
                        </div>
                    </div>
                )})}
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() =>
                        appendCertification({
                            name: "",
                            completionId: "",
                            url: "",
                            startDate: "",
                            issuer:"",
                            endDate: ""
                        })
                    }
                    disabled={readOnly}
                    className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start"
                >
                    Add Certification
                    <Plus size={14} className="ml-auto"/>
                </Button>
            </div>
        </div>
    );
}
