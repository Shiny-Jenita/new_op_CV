"use client";

import { CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

export default function MonthYearPicker({
  value,
  onChange,
  maxDate,
  disabled = false,
  className,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  maxDate: Date;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<number>(value?.getMonth() ?? 0);
  const [year, setYear] = useState<number>(value?.getFullYear() ?? maxDate.getFullYear());

  const years = Array
    .from({ length: maxDate.getFullYear() - 1950 + 1 }, (_, i) => 1950 + i)
    .reverse();

  const months = Array.from({ length: 12 }, (_, i) => i);

  useEffect(() => {
    if (value) {
      setMonth(value.getMonth());
      setYear(value.getFullYear());
    }
  }, [value]);
  useEffect(() => {
    const d = new Date(year, month, 1);
    if (d <= maxDate) onChange(d);
    else onChange(undefined);
  }, [month, year, maxDate, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value
            ? format(value, "MMM yyyy")
            : <span>Pick month & year</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-white rounded-md shadow-lg">
        <div className="flex space-x-2">
          {/* Month selector */}
          <select
            className="flex-1 p-2 border rounded"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {months.map(m => (
              <option key={m} value={m}>
                {format(new Date(0, m), "MMM")}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            className="flex-1 p-2 border rounded"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
