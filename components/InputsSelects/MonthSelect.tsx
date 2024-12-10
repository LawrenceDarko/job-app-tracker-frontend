'use client'

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface MonthPickerProps {
    onSelectMonth?: (firstDay: Date, lastDay: Date) => void;
    setDate: (value: any)=>void;
    date: any;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ onSelectMonth, setDate, date }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dateMonthAndYear = `${months[date?.from?.getMonth()]} ${date?.from?.getFullYear()}`

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectMonth = (monthIndex: number) => {
        const firstDay = new Date(selectedYear, monthIndex, 1);
        const lastDay = new Date(selectedYear, monthIndex + 1, 0);
        setSelectedMonth(`${months[monthIndex]} ${selectedYear}`);
        setIsOpen(false);
        // onSelectMonth(firstDay, lastDay);

        const monthRange ={
            from: firstDay,
            to: lastDay
        }
        setDate(monthRange)
    };

    return (
        <div className="relative">
            <Button
                size="form"
                variant="outline"
                id="date"
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                onClick={toggleDropdown}
            >
                {dateMonthAndYear || 'Select Month'}
            </Button>
            {isOpen && (
                <div className="fixed bg-white min-w-60 inset-x-4 md:inset-x-auto shadow-lg rounded mt-2 z-50">
                    <div className="flex justify-between p-2">
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => setSelectedYear(selectedYear - 1)}
                        >
                            &lt;
                        </button>
                        <span>{selectedYear}</span>
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => setSelectedYear(selectedYear + 1)}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {months.map((month, index) => (
                            <button
                                key={index}
                                className="px-4 py-2 rounded hover:bg-gray-200"
                                onClick={() => handleSelectMonth(index)}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthPicker;
