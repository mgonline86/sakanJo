import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <main className="container mt-20 px-5 md:mt-28">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Contact Us</h2>
        <p className="mb-4 text-gray-700">
          Have any questions or need assistance? We are here to help! Feel free
          to reach out to us through the form below or use the provided contact
          details.
        </p>
        <form className="space-y-4">
          <div className='flex flex-wrap gap-4'>
            <div className="flex-grow md:flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
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
                Email
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
              Message
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
            Send Message
          </Button>
        </form>
      </div>
    </main>
  );
}
