import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { BACKEND_URL } from '../config';
import { Blog } from '../hooks';
import parse from 'html-react-parser'
import { Spinner } from './Spinner';
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Blog[]>([] as Blog[]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === '') {
        // setResults([] as Blog[]);
        setShowModal(false);
        return;
      }

      setLoading(true);
    //   setError('');
      const token = localStorage.getItem('token')?.slice(1, -1) || '';

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/search/${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.blogs;
        // console.log(data);
        const parsedData = data.map((blog: Blog) => ({
          ...blog,
          title: parse(blog.title),
          content: parse(blog.content),
        }));
        setResults(parsedData);
        setShowModal(true);
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // console.log(query);
  }, [query]);
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
//   console.log(results)

  return (
    <div className="w-[50%] flex flex-row relative">
      <div className="flex items-center justify-center w-[100%] gap-2 box-shadow bg-slate-100 rounded-l-xl rounded-r-xl px-2">
        <CiSearch size={20} color="gray" />
        <input
          className="w-full border-none focus:outline-none bg-slate-100 rounded-l-xl rounded-r-xl p-2"
          type="search"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className={`absolute flex flex-col bg-white shadow-lg  items-center justify-center top-8 max-h-[10rem] w-full overflow-y-auto ${showModal?'py-4 my-10':''} `}>
        {loading && <div><Spinner/></div>}
        {showModal && results?.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg">
            <ul>
              {results.map((result: Blog) => (
                <li key={result.id} className="p-2 border-b cursor-pointer">
                  <p className="font-bold">{result.title}</p>
                  {/* <p>{result.content}</p> */}
                  {/* <div className="text-sm text-gray-600"> */}
                    {/* By: {result.author.name} | {new Date(result.created_at).toLocaleDateString()} */}
                  {/* </div> */}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showModal && results?.length === 0 && !loading && (
          <div className="">
            <p>No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
