import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  return (
    <main className="container mt-20 px-5 md:mt-28">
      <Helmet>
        <title>{`${t('contact_us')} | ${t('app_name')}`}</title>
      </Helmet>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          {t('contact_us')}
        </h2>
        <p className="mb-4 text-gray-700">{t('contact_p1')}</p>
        <form className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-grow md:flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Your Name"
              />
            </div>
            <div className="flex-grow md:flex-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Your Email"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              {t('message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Your Message"
            />
          </div>
          <Button type="submit" className="rounded-full">
            {t('send')}
          </Button>
        </form>
      </div>
    </main>
  );
}
