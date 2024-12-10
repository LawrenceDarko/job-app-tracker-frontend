'use client'

import { IconType } from "react-icons";

interface ButtonProps {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    medium?: boolean;
    icon?: IconType;

}

const Button: React.FC<ButtonProps> = ({onClick, label, disabled, outline, small, medium, icon: Icon}) => {
    return (
        <button onClick={onClick} disabled={disabled} className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded hover:opacity-80 px-5 transition ${outline? 'bg-white' : 'bg-[#4F9B91]'} ${outline? 'border-gray-500 border-[1px]' : 'border-[#4F9B91]'} ${outline? 'text-gray-500' : 'text-white'} ${small? 'py-1' : medium? 'py-2' : 'py-3'} ${small? 'text-sm' : 'text-md'} ${small? 'font-light' : 'font-semibold'} ${small? 'border-[1px]' : 'border-2'}`}>
            {Icon && (
                <Icon className="absolute left-4 top-3" />
            )}
            {label}
        </button>
    )
}

export default Button