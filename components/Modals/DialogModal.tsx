import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconType } from 'react-icons';


interface DialogModalProps {
    body?: string | React.ReactElement;
    isReject?: boolean;
    label: string;
    title: string;
    icon: IconType;
    callback?: () => void;
    lableIconColor?: string;
    customTextStyles?: string;
    customeBgStyle?: string;
}

const DialogModal: React.FC<DialogModalProps> = ({body, label, icon: Icon, callback, title, lableIconColor, customTextStyles, customeBgStyle}) => {
    
    
    const handleClick = async () => {
        try {
            if(callback){
                callback()
            }
        } catch (error) {
            // console.log('ERROR REJECTING', error)
        }
    }

    
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                        {Icon && <div className={` ${customeBgStyle} flex items-center w-full justify-start ${ label === 'Logout'? 'gap-4' : label === 'Remove' ? 'p-0 gap-1' : 'gap-2 p-2 hover:bg-gray-200'} rounded cursor-pointer `}>
                            <Icon className={`${lableIconColor ? lableIconColor : 'text-green-500'}  cursor-pointer`} />
                            <p className={`${label === 'Logout' ? 'whitespace-nowrap' : ''} ${customTextStyles}`}>{label}</p>
                        </div>}
                </AlertDialogTrigger>
                <AlertDialogContent className=''>
                    <AlertDialogHeader>
                    <AlertDialogTitle className='w-full'>{title}</AlertDialogTitle>
                        <AlertDialogDescription className="flex items-center justify-start w-full">
                            {body && <div className='w-full'>{body}</div>}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClick} className={` ${label === 'Logout' ? 'bg-red-500' : 'bg-orange-500'}`}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default DialogModal