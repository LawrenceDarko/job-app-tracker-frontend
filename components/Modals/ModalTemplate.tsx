'use client'

import { IoMdClose } from 'react-icons/io'
import { useState, useCallback, useEffect } from 'react';
import Button from '../Button';

interface ModalTemplateProps {
    isOpen?: boolean;
    onClose: ()=> void;
    onSubmit?: ()=> void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionlabel?: string;
    // disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
    paddingTop?: string;
    customSizeStyles?: string;
    longModal?: boolean;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({ isOpen, body, title, onClose, onSubmit, secondaryAction, secondaryActionLabel, actionlabel, footer, customSizeStyles, longModal}) => {

    const [showModal, setShowModal] = useState(isOpen)


    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])

    const handleClose = useCallback(() => {
        setShowModal(false)
        setTimeout(() => {
            onClose();
        }, 300);
    },[isOpen],)

    const handleSubmit = useCallback(()=> {
        if(onSubmit){
            onSubmit();
            handleClose();
        }
        // handleClose();
    },[onSubmit])

    const handleSecondaryAction = useCallback(()=> {
        if(!secondaryAction){
            return;
        }
        secondaryAction();
    }, [secondaryAction])

    if(!isOpen){
        return null;
    }

    return (
        <div className={`fixed inset-0 z-50 flex justify-center ${longModal? '' : 'items-center'} overflow-x-hidden overflow-y-auto bg-opacity-100 outline-none no-scrollbar items-centerr focus:outline-none backdrop-blur-smm bg-neutral-800/70`}>
            <div className={`relative w-full h-full mx-auto my-6 transition ${customSizeStyles ? customSizeStyles :'md:w-4/6 lg:w-2/4 xl:w-[600px]'} lg:h-auto md:h-auto`}>
                <div className={`h-ful duration-300 ${showModal ? 'translate-y-0' : 'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0'} translate`}>
                    <div className={`${longModal ? 'md:pt-20 md:pb-20' : ''}`}> {/* This adds padding below the modal*/}
                        <div className={`relative flex flex-col rounded-md w-full h-full bg-white border-0 shadow-lg outline-none translate lg:h-auto md:h-auto focus:outline-none`}>
                            <div className='flex items-center justify-center p-6 rounded-t relative border-b-[1px]'>
                                <button onClick={handleClose} className='absolute p-1 transition border-0 hover:opacity-70 right-9'>
                                    <IoMdClose size={18}/>
                                </button>
                                <div className='text-lg font-semibold'>
                                    {title}
                                </div>
                            </div>
                            <div className='relative flex-auto p-6'>
                                {body}
                            </div>
                            <div className={`${!actionlabel ? 'hidden' : ''} flex flex-col gap-2 p-6`}>
                                <div className={`flex flex-row items-center justify-end w-full gap-4`}>
                                    {secondaryAction && secondaryActionLabel && (<Button medium label={secondaryActionLabel} onClick={handleSecondaryAction} outline/>)}
                                    {actionlabel && (<Button label={actionlabel} medium onClick={handleSubmit}/>)}
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalTemplate