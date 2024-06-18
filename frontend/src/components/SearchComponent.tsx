import { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import { Blog } from '../hooks';
import parse from 'html-react-parser';
import { Spinner } from './Spinner';
import { setWithExpiry } from '../hooks/cache';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Blog[]>([] as Blog[]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataToLocalStorage, setDataToLocalStorage] = useState<Blog[]>([] as Blog[]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === '') {
        setShowModal(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token')?.slice(1, -1) || '';

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/search/${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataToLocalStorage(response.data.blogs);
        const data = response.data.blogs;
        const parsedData = data.map((blog: Blog) => ({
          ...blog,
          title: parse(blog.title),
          content: parse(blog.content),
        }));
        setResults(parsedData);
        setShowModal(true);
      } catch (err) {
        console.error('Error during search:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <div ref={searchContainerRef} className="w-[50%] flex flex-row relative">
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
      <div className="absolute top-12 w-full max-h-[15rem] overflow-y-auto bg-white shadow-lg rounded-lg mt-2">
        {loading && (
          <div className="p-4">
            <Spinner />
          </div>
        )}
        {showModal && results?.length > 0 && (
          <ul className="w-full">
            {results.map((result: Blog, idx: number) => (
              <li
                key={result.id}
                className="w-full p-4 hover:bg-gray-100 flex flex-col items-start justify-center gap-2 cursor-pointer border-b border-gray-200 overflow-hidden"
                onClick={() => {
                  setWithExpiry('lastVisitedBlog', dataToLocalStorage[idx], 2 * 60 * 60 * 1000);
                  setShowModal(false)
                  navigate(`/blog/${result.id}`);
                }}
              >
                <div className="font-bold text-lg align">{result.title}</div>
                <div className="text-gray-700 h-14">{result.content}</div>
              </li>
            ))}
          </ul>
        )}
        {showModal && results?.length === 0 && !loading && (
          <div className="p-4">
            <p>No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
