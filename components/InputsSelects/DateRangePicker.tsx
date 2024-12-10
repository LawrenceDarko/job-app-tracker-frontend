"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface DateRangePickerProps {
    date: any;
    setDate: (value: any)=>void;
    placeholder: string;
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({className, date, setDate}) => {


    return (
        <div className={cn("grid gap-2", className)}>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                size="default"
                id="date"
                variant={"outline"}
                className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date?.from ? (
                date.to ? (
                    <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                    </>
                ) : (
                    format(date.from, "LLL dd, y")
                )
                ) : (
                <span>Pick a date</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
            />
            </PopoverContent>
        </Popover>
        </div>
    )
}

export default DateRangePicker