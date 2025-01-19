import React, { useState } from 'react';

import axios from 'axios';
import { usePlaces } from '../../../hooks';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
  const { t, i18n } = useTranslation();

  const { setPlaces, setLoading } = usePlaces();

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = async (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    if (searchText.trimStart() !== '') {
      setLoading(true);
      setSearchTimeout(
        setTimeout(async () => {
          setLoading(true);
          try {
            const response = await axios.get(
              `https://backend.sakanijo.com/api/search/places?title=${searchText}`,
            );
            const { data } = response;

            // Check if data is empty
            if (data.length > 0) {
              setPlaces(data.reverse()); // Set places state with search results
            } else {
              setPlaces([]); // Clear places state if no results found
            }
          } catch (error) {
            console.error('Error searching places:', error);
          } finally {
            setLoading(false);
          }
        }, 500),
      );
    }
  };

  return (
    <>
      <div className="flex w-4/6 overflow-hidden rounded-full border border-gray-400 bg-gray-300 shadow-sm hover:shadow-lg md:w-1/2">
        <div className="grow">
          <input
            type="search"
            placeholder={t('searchInput')}
            className="h-full w-full border-none px-4 py-2 text-sm  focus:outline-none md:text-lg"
            onChange={(e) => handleSearch(e)}
            value={searchText}
          />
        </div>
        <div className="bg-blue flex cursor-pointer  items-center bg-primary text-white">
          <button
            className="flex rounded-r-full bg-primary px-4 py-2 md:p-2"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="mt-1 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="ml-1 hidden md:block">{t('search')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
