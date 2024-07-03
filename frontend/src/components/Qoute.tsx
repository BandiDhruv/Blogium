import { useState, useEffect } from 'react';
import axios from 'axios';

interface Quote {
    _id: string;
    content: string;
    author: string;
    tags: string[];
    authorSlug: string;
    length: number;
    dateAdded: string;
    dateModified: string;
}


export const Qoute = () => {
    const [quotes, setQuotes] = useState<Quote[]>();


    useEffect(() => {
        const fetchQuote = async () => {
          try {
            const response = await axios.get<Quote[]>('https://api.quotable.io/quotes/random');
            if (response.status === 200) {
              setQuotes(response.data);
            } else {
              throw new Error('Failed to fetch quote');
            }
          } catch (error) {
            console.error('Error fetching quote:', error);
          }
        };
    
        fetchQuote();
      }, []);
    

    return (
        <div className="bg-slate-200 h-screen flex flex-col justify-center items-center px-16 ">
            <div className="flex justify-center align-middle flex-col gap-2 ">
                <div className="text-center text-2xl font-bold ">
                    {quotes?quotes[0]?.content:''}
                </div>
                <div className="text-l font-medium text-center">
                    :~ {quotes? quotes[0]?.author : ''} ~:

                </div>
            </div>
        </div>
    );
}
