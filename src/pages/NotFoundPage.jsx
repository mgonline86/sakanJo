import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="px-2 pt-40">
      <div className="text-center">
        <p className="text-base font-semibold text-black">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-5xl">
          {t('not_found.title')}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          {t('not_found.sub_title')}
        </p>
        <div className="mt-4 flex items-center justify-center gap-x-3">
          <Link to="/">
            <button
              type="button"
              className="rounded-[10px] bg-gray-900 p-2 px-4 md:px-20 hover:bg-gray-700"
            >
              <span className="font-semibold text-white">
                {t('not_found.btn_text')}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
