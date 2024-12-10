import Image from 'next/image'
import React from 'react'

const Loader = ({ loadText }: { loadText?: string}) => {
    return (
        <div className='flex items-center flex-col gap-3 justify-center w-full h-32'>
            <Image
                src='/images/stagger-loader.svg'
                alt='loader'
                width={100}
                height={100}
            />
            <p className='text-gray-500 text-sm'>{loadText}</p>
        </div>
    )
}

export default Loader