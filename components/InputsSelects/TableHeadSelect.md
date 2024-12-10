import React from 'react'
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}

const options = [
    "name",
    "amount",
    "date",
    "type",
    "beneficiary",
]

const TableHeadSelect = ({columnIndex, selectedColumns, onTableHeadSelectChange}: Props) => {
    const currentSelection = selectedColumns[`column_${columnIndex}`] || '';

    return (
        <Select
            value={currentSelection}
            onValueChange={(value) => onTableHeadSelectChange(columnIndex, value)}
        >
            <SelectTrigger
                className={cn(
                    'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize', 
                    currentSelection ? 'text-black' : 'text-gray-500'
                )}
            >
                <SelectValue placeholder="Skip">
                    {currentSelection || 'Select Column'}
                </SelectValue>
                <SelectContent>
                    <SelectItem value='skip' className='capitalize'>Skip</SelectItem>
                    {options.map((option, index) => {
                        const disabled = Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option;
                        return (
                            <SelectItem key={index} value={option} disabled={disabled} className='capitalize'>
                                {option}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </SelectTrigger>
        </Select>
    )
}

export default TableHeadSelect