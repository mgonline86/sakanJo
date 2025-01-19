import React from 'react';

const PerksWidget = ({ perks , place }) => {
  return (
    <div className="mt-4">
      <hr className="mb-5 border" />
      <p className="text-2xl font-semibold">What this place offers</p>



    {
      place?.type === "farm" && (
        <div className="mt-4 grid flex-col gap-4 lg:grid-cols-2 lg:justify-items-stretch lg:gap-4">
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 10.1008C12.1591 9.05286 12.2609 6.69673 10.451 4.88681C8.64106 3.07689 6.28493 3.17869 5.23701 3.3378C4.89543 3.38967 4.63573 3.64937 4.58386 3.99095C4.42475 5.03887 4.32294 7.395 6.13286 9.20492C7.94279 11.0148 10.2989 10.913 11.3468 10.7539C11.6884 10.7021 11.9481 10.4424 12 10.1008ZM12 10.1008L12.0001 21M18.0291 16.3021C20.3028 14.9894 20.8207 12.6239 20.9381 11.5533C20.9758 11.2099 20.7926 10.8925 20.4763 10.7534C19.4905 10.3198 17.1829 9.58559 14.9092 10.8983C12.6354 12.2111 12.1176 14.5766 12.0001 15.6471C11.9624 15.9906 12.1457 16.308 12.4619 16.4471C13.4478 16.8806 15.7553 17.6149 18.0291 16.3021Z"
              stroke="#000000"
              fill="none"
              strokeLinejoin="round"
              strokeWidth="1.125"
              strokeLinecap="round"
            />
          </svg>
          <span className={`${perks?.includes('planted') ? '' : 'line-through'}`}>
              Planted
          </span>
        </div>
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 14C16 16.2091 14.2091 18 12 18M19 13.7353C19 10.8891 15.4774 6.17546 13.43 3.67615C12.6809 2.76176 11.3191 2.76176 10.57 3.67615C8.52261 6.17546 5 10.8891 5 13.7353C5 17.7475 8.13401 21 12 21C15.866 21 19 17.7475 19 13.7353Z"
                  stroke="#000000"
                  fill="none"
                  strokeLinejoin="round"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                />
              </svg>
          <span className={`${perks?.includes('water') ? '' : 'line-through'}`}>
          It contains water
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
          <span
            className={`${perks?.includes('electricity') ? '' : 'line-through'}`}
          >
            It has electricity
          </span>
        </div>

        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7ZM12 7V12M12 12H9.5M12 12H14.5M12 12L11.9999 21M18.4003 17.8003C16.9408 19.7432 14.6171 21 11.9999 21M11.9999 21C9.38279 21 7.05915 19.7433 5.59961 17.8003M6 17C6 17.5523 5.55228 18 5 18C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16C5.55228 16 6 16.4477 6 17ZM20 17C20 17.5523 19.5523 18 19 18C18.4477 18 18 17.5523 18 17C18 16.4477 18.4477 16 19 16C19.5523 16 20 16.4477 20 17Z"
              stroke="#000000"
              fill="none"
              strokeLinejoin="round"
              strokeWidth="1.125"
              strokeLinecap="round"
            />
          </svg>
          <span className={`${perks?.includes('swimming') ? '' : 'line-through'}`}>
          It has a swimming pool
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
          <span className={`${perks?.includes('fence') ? '' : 'line-through'}`}>
          It has a fence
          </span>
        </div>
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9998 9.99997L3.5752 20.4246M17.816 13.9587C21.3603 10.4144 20.8329 5.70678 20.5296 4.13145C20.4642 3.79218 20.2077 3.53563 19.8684 3.47029C18.2931 3.16692 13.5854 2.63957 10.0411 6.18388C6.49679 9.72819 7.02414 14.4358 7.32751 16.0112C7.39285 16.3504 7.6494 16.607 7.98867 16.6723C9.564 16.9757 14.2716 17.5031 17.816 13.9587Z"
            stroke="#000000"
            fill="none"
            strokeLinejoin="round"
            strokeWidth="1.125"
            strokeLinecap="round"
          />
        </svg>
          <span
            className={`${perks?.includes('cultivable') ? '' : 'line-through'}`}
          >
            Cultivable
          </span>
        </div>
      </div>


      )
    }

    {
      place?.type === "land" && (
        <div className="mt-4 grid flex-col gap-4 lg:grid-cols-2 lg:justify-items-stretch lg:gap-4">
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 10.1008C12.1591 9.05286 12.2609 6.69673 10.451 4.88681C8.64106 3.07689 6.28493 3.17869 5.23701 3.3378C4.89543 3.38967 4.63573 3.64937 4.58386 3.99095C4.42475 5.03887 4.32294 7.395 6.13286 9.20492C7.94279 11.0148 10.2989 10.913 11.3468 10.7539C11.6884 10.7021 11.9481 10.4424 12 10.1008ZM12 10.1008L12.0001 21M18.0291 16.3021C20.3028 14.9894 20.8207 12.6239 20.9381 11.5533C20.9758 11.2099 20.7926 10.8925 20.4763 10.7534C19.4905 10.3198 17.1829 9.58559 14.9092 10.8983C12.6354 12.2111 12.1176 14.5766 12.0001 15.6471C11.9624 15.9906 12.1457 16.308 12.4619 16.4471C13.4478 16.8806 15.7553 17.6149 18.0291 16.3021Z"
              stroke="#000000"
              fill="none"
              strokeLinejoin="round"
              strokeWidth="1.125"
              strokeLinecap="round"
            />
          </svg>
          <span className={`${perks?.includes('planted') ? '' : 'line-through'}`}>
              Planted
          </span>
        </div>
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 14C16 16.2091 14.2091 18 12 18M19 13.7353C19 10.8891 15.4774 6.17546 13.43 3.67615C12.6809 2.76176 11.3191 2.76176 10.57 3.67615C8.52261 6.17546 5 10.8891 5 13.7353C5 17.7475 8.13401 21 12 21C15.866 21 19 17.7475 19 13.7353Z"
                  stroke="#000000"
                  fill="none"
                  strokeLinejoin="round"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                />
              </svg>
          <span className={`${perks?.includes('water') ? '' : 'line-through'}`}>
          It contains water
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
          <span
            className={`${perks?.includes('electricity') ? '' : 'line-through'}`}
          >
            It has electricity
          </span>
        </div>

        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7ZM12 7V12M12 12H9.5M12 12H14.5M12 12L11.9999 21M18.4003 17.8003C16.9408 19.7432 14.6171 21 11.9999 21M11.9999 21C9.38279 21 7.05915 19.7433 5.59961 17.8003M6 17C6 17.5523 5.55228 18 5 18C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16C5.55228 16 6 16.4477 6 17ZM20 17C20 17.5523 19.5523 18 19 18C18.4477 18 18 17.5523 18 17C18 16.4477 18.4477 16 19 16C19.5523 16 20 16.4477 20 17Z"
              stroke="#000000"
              fill="none"
              strokeLinejoin="round"
              strokeWidth="1.125"
              strokeLinecap="round"
            />
          </svg>
          <span className={`${perks?.includes('swimming') ? '' : 'line-through'}`}>
          It has a swimming pool
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
          <span className={`${perks?.includes('fence') ? '' : 'line-through'}`}>
          It has a fence
          </span>
        </div>
        <div className="flex gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9998 9.99997L3.5752 20.4246M17.816 13.9587C21.3603 10.4144 20.8329 5.70678 20.5296 4.13145C20.4642 3.79218 20.2077 3.53563 19.8684 3.47029C18.2931 3.16692 13.5854 2.63957 10.0411 6.18388C6.49679 9.72819 7.02414 14.4358 7.32751 16.0112C7.39285 16.3504 7.6494 16.607 7.98867 16.6723C9.564 16.9757 14.2716 17.5031 17.816 13.9587Z"
            stroke="#000000"
            fill="none"
            strokeLinejoin="round"
            strokeWidth="1.125"
            strokeLinecap="round"
          />
        </svg>
          <span
            className={`${perks?.includes('cultivable') ? '' : 'line-through'}`}
          >
            Cultivable
          </span>
        </div>
      </div>


      )
    }
 


    {
      place?.type === "home" && (
        <div className="mt-4 grid flex-col gap-4 lg:grid-cols-2 lg:justify-items-stretch lg:gap-4">
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
          />
        </svg>
          <span className={`${perks?.includes('wifi') ? '' : 'line-through'}`}>
          Wifi
          </span>
        </div>
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
          <span className={`${perks?.includes('parking') ? '' : 'line-through'}`}>
          Free parking spot
          </span>
        </div>
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
          <span
            className={`${perks?.includes('tv') ? '' : 'line-through'}`}
          >
            TV
          </span>
        </div>

        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
          <span className={`${perks?.includes('equipped') ? '' : 'line-through'}`}>
          Equipped
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
          <span className={`${perks?.includes('balcony') ? '' : 'line-through'}`}>
          Balcony
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
          <span
            className={`${perks?.includes('floors') ? '' : 'line-through'}`}
          >
            It has floors
          </span>
        </div>
      </div>


      )
    }


    {
      place?.type === "apartment" && (
        <div className="mt-4 grid flex-col gap-4 lg:grid-cols-2 lg:justify-items-stretch lg:gap-4">
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
          />
        </svg>
          <span className={`${perks?.includes('wifi') ? '' : 'line-through'}`}>
          Wifi
          </span>
        </div>
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
          <span className={`${perks?.includes('parking') ? '' : 'line-through'}`}>
          Free parking spot
          </span>
        </div>
        <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
          <span
            className={`${perks?.includes('tv') ? '' : 'line-through'}`}
          >
            TV
          </span>
        </div>

        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
          <span className={`${perks?.includes('equipped') ? '' : 'line-through'}`}>
          Equipped
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
          <span className={`${perks?.includes('balcony') ? '' : 'line-through'}`}>
          Balcony
          </span>
        </div>
        <div className="flex gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
          <span
            className={`${perks?.includes('floors') ? '' : 'line-through'}`}
          >
            It has floors
          </span>
        </div>
      </div>


      )
    }

    </div>
  );
};

export default PerksWidget;
