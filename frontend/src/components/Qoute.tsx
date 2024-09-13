import { useState, useEffect } from 'react';
import axios from 'axios';

interface Quote {
    id: string;
    quote: string;
    author: string;
}

interface ApiResponse {
    quotes: Quote[];
    total: number;
    skip: number;
    limit: number;
}

export const Qoute = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axios.get<ApiResponse>("https://dummyjson.com/quotes");
                if (response.status === 200) {
                    const fetchedQuotes = response.data.quotes;
                    setQuotes(fetchedQuotes);
                } else {
                    throw new Error('Failed to fetch quotes');
                }
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        fetchQuote();
    }, []);

    useEffect(() => {
        if (quotes.length > 0) {
            getRandomQuote();
        }
    }, [quotes]); 

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    };
    console.log(randomQuote)
    return (
        <div className="bg-slate-200 h-screen flex flex-col justify-center items-center px-16 ">
            <div className="flex justify-center align-middle flex-col gap-2 ">
                <div className="text-center text-2xl font-bold ">
                    {randomQuote ? randomQuote.quote : ''}
                </div>
                <div className="text-l font-medium text-center">
                    :~ {randomQuote ? randomQuote.author : ''}
                </div>
            </div>
        </div>
    );
}
