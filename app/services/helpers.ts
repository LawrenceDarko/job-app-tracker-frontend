// import localStorageService from "./localStorageService";


const Helpers = {
        formatDateTimeFromString: (dateTimeString: any, dateOnly?: boolean, inWords?: string)=> {
        // Parse the date string into a Date object
        const date = new Date(dateTimeString);

        // Check if the parsed date is valid
        if (isNaN(date?.getTime())) {
            throw new Error('Invalid date string');
        }

        // Format the date using the desired options
        const options: any = {
            // weekday: 'long', // Full name of the day of the week (e.g., "Monday")
            year: 'numeric',
            month: '2-digit', // Full name of the month (e.g., "January")
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit',
            timeZone: 'UTC' // Assuming the input date string is in UTC
        };

        // only show the date without the time if i pass a prop to the function
        if(dateOnly){
            options.hour = undefined;
            options.minute = undefined;
        }

        if (inWords === 'words') {
            options.weekday = 'long'; // Full name of the day of the week (e.g., "Monday")
            options.month = 'long'; // Full name of the month (e.g., "January")
        }

        // Format the date and time string
        const formattedDateTime = date.toLocaleString('en-US', options);
        return formattedDateTime;
    },

    // formatCurrency: (amount: number) => {
    //     // localStorageService.getItem('userSettings') ? currency = localStorageService.getItem('userSettings').currency : currency = 'GHS';
    //     let currency = 'GHS';
    //      // Check if we are running on the client
    //     if (typeof window !== 'undefined') {
    //         const userSettings = localStorageService.getItem('userSettings');
    //         if (userSettings) {
    //             currency = userSettings.currency;
    //         } else {
    //             currency = 'GHS';
    //         }
    //     }

    //     return new Intl.NumberFormat(`en-${currency?.slice(0, -1)}`, {
    //         style: 'currency',
    //         currency: currency
    //     }).format(amount);
    // },

    formatAndCapitalize: (inputString: string) => {
        // Split the string by underscores
        const words = inputString?.split('_');
    
        // Capitalize each word
        const capitalizedWords = words?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1));
    
        // Join the words back into a single string
        const formattedString = capitalizedWords?.join(' ');
    
        return formattedString;
    },

    convertMoneyToUnits: (money: any) => {
        // If the input is a number, return it directly
        if (typeof money === 'number') {
            return money;
        }
        
        // If the input is a string, process it
        if (typeof money === 'string') {
            // Remove commas
            const noCommaMoney = money.replace(/,/g, '');
            // Convert to number
            const moneyInUnits = parseFloat(noCommaMoney);
            
            if (isNaN(moneyInUnits)) {
                throw new Error('Invalid money format');
            }
            
            return Math.abs(moneyInUnits);
        }
        
        // If the input is neither a string nor a number, throw an error
        throw new Error('Input must be a string or number');
    }
    
};

export default Helpers;
