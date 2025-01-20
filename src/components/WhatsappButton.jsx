import { WhatsApp } from '@mui/icons-material';
import { Button } from './ui/button';

export default function WhatsappButton({ phoneNumber = '555199999999' }) {
  return (
    <Button
      variant="outline"
      asChild
      className="fixed bottom-5 right-5 h-16 w-16 rounded-full bg-[#25D366] text-white hover:bg-[#25D366]/90 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsApp fontSize="large" />
      </a>
    </Button>
  );
}
