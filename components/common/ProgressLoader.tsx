'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export const NProgressBar = () => {
    return (
        <ProgressBar
            // height="4px"
            color="#4F9A91"
            options={{ showSpinner: true }}
            shallowRouting
            />
    )
}