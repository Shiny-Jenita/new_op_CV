import { CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, subYears } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { Button } from "./button";

export default function DatePickerWithYearSelection({
  value,
  onChange,
  maxDate,
  minDate,
  disabled = false,
  className,
  monthYearOnly = false,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  maxDate: Date;
  minDate?: Date;
  disabled?: boolean;
  className?: string;
  monthYearOnly?: boolean;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [yearSelectOpen, setYearSelectOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewDate, setViewDate] = useState<Date>(subYears(new Date(), 16));
  const calendarRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: maxDate.getFullYear() - 1950 + 1 }, (_, i) => maxDate.getFullYear() - i);
  const defaultMonth = subYears(new Date(), 0);

  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setViewDate(value);
    } else if (!selectedYear) {
      setSelectedYear(defaultMonth.getFullYear());
      setViewDate(defaultMonth);
    }
  }, [value, selectedYear, defaultMonth]);

  const handleYearSelect = (year: number) => {
    const newViewDate = new Date(viewDate);
    newViewDate.setFullYear(year);
    setViewDate(newViewDate);
    setSelectedYear(year);

    if (value) {
      const newDate = new Date(value);
      newDate.setFullYear(year);
      onChange(newDate);
    }

    setYearSelectOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                ? format(value, monthYearOnly ? "MMMM yyyy" : "PPP")
                : <span>{monthYearOnly ? "Pick month & year" : "Pick a date"}</span>}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-sky-600 text-white" align="start">
            <div className="p-3 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Select date</h3>
                <Popover open={yearSelectOpen} onOpenChange={setYearSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 bg-sky-600  hover:bg-sky-600 hover:text-white"
                    >
                      {selectedYear || "Year"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0 max-h-[300px] text-white overflow-y-auto bg-sky-600">
                    <div className="grid grid-cols-3 gap-1 p-2">
                      {years.map((year) => {
                        const isDisabled =
                          (minDate && year < minDate.getFullYear()) || year > maxDate.getFullYear();

                        return (
                          <Button
                            key={year}
                            variant={year === selectedYear ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "h-8",
                              year === selectedYear && "bg-white text-sky-700 font-semibold"
                            )}
                            onClick={() => {
                              if (!isDisabled) handleYearSelect(year);
                            }}
                            disabled={isDisabled}
                          >
                            {year}
                          </Button>
                        );
                      })}

                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!monthYearOnly ? (
              <div ref={calendarRef}>
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date) => {
                    onChange(date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date > maxDate || (minDate ? date < minDate : false)}
                  month={viewDate}
                  onMonthChange={setViewDate}
                  initialFocus
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 p-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const date = new Date(selectedYear || new Date().getFullYear(), i, 1);
                  const label = format(date, "MMM");
                  const isDisabled =
                    (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) ||
                    date > maxDate;

                  return (
                    <Button
                      key={i}
                      size="sm"
                      variant={
                        value?.getMonth() === i &&
                          value?.getFullYear() === (selectedYear || new Date().getFullYear())
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "h-8",
                        value?.getMonth() === i &&
                          value?.getFullYear() === (selectedYear || new Date().getFullYear()) &&
                          "bg-white text-sky-700 font-semibold"
                      )}
                      onClick={() => {
                        if (isDisabled) return;
                        const newDate = new Date(selectedYear || new Date().getFullYear(), i, 1);
                        onChange(newDate);
                        setCalendarOpen(false);
                      }}
                      disabled={isDisabled}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
