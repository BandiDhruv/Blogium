import { useState, useEffect } from 'react';

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
    const [quotes, setQuotes] = useState<Quote>();


    useEffect(() => {
        fetch("https://api.quotable.io/random")
            .then(response => response.json())
            .then((data: Quote) => setQuotes(data))
            .catch(error => console.error('Error fetching quotes:', error));
    }, []);

    return (
        <div className="bg-slate-200 h-screen flex flex-col justify-center items-center px-16 ">
            <div className="flex justify-center align-middle flex-col gap-2 ">
                <div className="text-center text-2xl font-bold ">
                    {quotes?.content}
                </div>
                <div className="text-l font-medium text-center">
                    :~ {quotes?.author}
                </div>
            </div>
        </div>
    );
}
