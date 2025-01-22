import React from 'react';
import { useTranslation } from 'react-i18next';
import "./footer.css";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const isArabic = i18n.language == "ar"

  return (
    <div className="flex w-full justify-center bg-gray-100 pb-8">
      <div className="flex w-full max-w-screen-xl flex-col items-center px-6">
        {/* grid for links */}
        <div className="grid w-full grid-cols-1 gap-4 py-8 text-sm md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <strong className="font-medium">{t('about_us')}</strong>
            <p>
              <span className="font-medium text-gray-700 decoration-1 underline-offset-1">
                {t('app_description')}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <strong className="font-medium">{t('enjoy_features')}</strong>
            <a href="#" className="playstore-button">
              <span className="icon">
                <svg
                  fill="currentcolor"
                  viewBox="-52.01 0 560.035 560.035"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <svg
                        fill="currentcolor"
                        viewBox="-52.01 0 560.035 560.035"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"
                          ></path>
                        </g>
                      </svg>
                </svg>
              </span>
              <span className="texts">
                <span className="text-1">{t('download_from')}</span>
                <span className="text-2">App Store</span>
              </span>
            </a>

            <a className="playstore-button" href="https://play.google.com/store/apps/details?id=com.sakaniJo.sakaniJo&pcampaignid=web_share">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="icon" viewBox="0 0 512 512">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="icon" viewBox="0 0 512 512">
                    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                  </svg>
              </svg>
              <span className="texts">
                <span className="text-1">{t('download_from')}</span>
                <span className="text-2">Google Play</span>
              </span>
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <strong className="font-medium">SakaniJo</strong>
            <p>
              <span className="cursor-pointer font-medium text-gray-700 decoration-1 underline-offset-1 hover:underline">
                {t('about_us_link')}
              </span>
            </p>
            <p>
              <span className="cursor-pointer font-medium text-gray-700 decoration-1 underline-offset-1 hover:underline">
                {t('contact_us')}
              </span>
            </p>
          </div>
        </div>

        <div className="my-4 w-full border-[1px] border-gray-200"></div>

        <div className="flex w-full flex-col items-center justify-between gap-4 md:gap-0 lg:flex-row">
          <div className="mt-4 flex w-full justify-between gap-10 md:order-last md:w-auto">
            <div className="flex text-sm font-semibold">
              <button style={{ margin: 5, backgroundColor: "transparent" }} onClick={() => changeLanguage('en')}> <p style={isArabic?{color:"black"} : {color:"#467d9e"}}>English</p> </button>
              <button style={{ margin: 5, backgroundColor: "transparent" }} onClick={() => changeLanguage('ar')}><p style={!isArabic?{color:"black"} : {color:"#467d9e"}}>Arabic</p></button>
              <span className="mx-4">JOD</span>
            </div>
            <div className="flex gap-3">
              {/* Add social media icons here */}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 px-1 font-normal text-gray-700 md:w-auto md:flex-row md:items-center md:gap-8">
            <p className="text-sm">&copy; 2024 Sakani, Inc.</p>
            <div>
              <ul className="flex gap-6 text-sm text-gray-700">
                <a href='/policy'>
                  <li className="cursor-pointer text-gray-700 decoration-1 underline-offset-1 hover:underline md:list-disc">
                    {t('policy')}
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;