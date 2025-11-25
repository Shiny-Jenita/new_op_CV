"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Country {
  value: string;
  label: string;
  flagUrl: string;
  dialCode: string;
}

export function PhoneInputSection({
  readOnly,
  required = false,
}: {
  readOnly?: boolean;
  required?: boolean;
}) {
  const { control, watch, setValue } = useFormContext();
  const [countries, setCountries] = useState<Country[]>([]);

  const selectedCountry = watch("country");
  const phoneValue = watch("phone");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd")
      .then((res) => res.json())
      .then((data: any[]) => {
        const list = data
          .map((country) => ({
            value: country.cca2 || '',
            label: country.name?.common || '',
            flagUrl: country.flags?.svg || '',
            dialCode: country.idd?.root && country.idd?.suffixes?.[0]
              ? `${country.idd.root}${country.idd.suffixes[0]}`
              : "",
          }))
          .filter(item => item.label && typeof item.label === 'string') // Ensure label exists and is a string
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(list);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const localNumber = phoneValue?.split(" ")[1] || "";

  return (
    <div className="grid grid-cols-1 gap-3">
      <FormField
        control={control}
        name="phone"
        rules={{
          validate: (value) => {
            if (!value || value.trim() === "" || value.trim().length < 5) {
              return "* Phone number is required";
            }
            return true;
          }
        }}
        render={({ field, fieldState }) => (
          <div className="flex flex-col">
            <FormLabel className="font-medium text-sm text-[#667279]">Phone <span className="text-red-500">*</span></FormLabel>
            <div className="flex gap-2 items-center">
              <div className="w-28">
                <Select
                  disabled={readOnly}
                  value={selectedCountry || ""}
                  onValueChange={(val) => {
                    setValue("country", val);
                    const newly = countries.find((c) => c.label === val);
                    setValue("phone", `${newly?.dialCode || ""} ${localNumber}`);
                  }}
                >
                  <SelectTrigger className="w-full bg-[#F5F5F5] p-3 h-12">
                    <SelectValue placeholder="Country">
                      {(() => {
                        const current = countries.find((c) => c.label === selectedCountry);
                        return current ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={current.flagUrl}
                              alt={current.label}
                              className="h-4 w-6 rounded-sm object-cover"
                            />
                            <span className="text-sm">{current.dialCode}</span>
                          </div>
                        ) : null;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.label}>
                        <div className="flex items-center gap-2">
                          <img
                            src={c.flagUrl}
                            alt={c.label}
                            className="h-4 w-6 rounded-sm object-cover"
                          />
                          <span className="flex-1">{c.label}</span>
                          <span className="text-xs text-gray-500">{c.dialCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <input
                {...field}
                type="text"
                value={localNumber}
                maxLength={10}

                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  if (onlyDigits.length <= 10) {
                    field.onChange(
                      `${countries.find((c) => c.label === selectedCountry)?.dialCode || ""} ${onlyDigits}`
                    );
                  }
                }}

                disabled={readOnly}
                placeholder="Enter Phone Number"
                className={`
    h-12 w-full rounded-[10px]
    ${readOnly
                    ? " text-gray-400 cursor-not-allowed border border-transparent p-2"
                    : "bg-[#F5F5F5] placeholder:text-slate-400 p-2"}
    ${fieldState.invalid && !readOnly
                    ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""}
      `}
              />
            </div>
            <FormMessage />
          </div>
        )}
      />
    </div>
  );
}
