import React, { useState } from 'react';
import './App.css';
import { Facebook, X, Instagram, WhatsApp, Telegram, Share } from '@mui/icons-material';
import { Close, Link } from '@mui/icons-material';
import { Button } from './ui/button';

const ShareModal = ({ shareLink }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const toggleModal = () => setIsVisible(!isVisible);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        });
    };

    const platforms = [
        { icon: <Facebook style={{ color: 'white' }} />, link: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`, color: '#1877f2' },
        { icon: <X style={{ color: 'white' }} />, link: `https://twitter.com/intent/tweet?url=${shareLink}`, color: '#000000' },
        { icon: <Instagram style={{ color: 'white' }} />, link: `https://www.instagram.com/?url=${shareLink}`, color: '#e1306c' },
        { icon: <WhatsApp style={{ color: 'white' }} />, link: `https://wa.me/?text=${shareLink}`, color: '#25d366' },
        { icon: <Telegram style={{ color: 'white' }} />, link: `https://t.me/share/url?url=${shareLink}`, color: '#0088cc' }
    ];

    return (
        <div dir="rtl">


            <Button variant="outline" className="rounded-full h-10 w-10 text-[#008CBA] hover:bg-[#008CBA] hover:text-white" onClick={toggleModal}>
                <Share />
            </Button>




            {isVisible && (
                <div className={`popup ${isVisible ? 'show' : ''}`} >
                    <header>
                        <span>نافذة المشاركة</span>
                        <div className="close" onClick={toggleModal}><Close style={{ color: 'black' }} /></div>
                    </header>
                    <div className="content">
                        <p>شارك الرابط عبر</p>
                        <ul className="icons">
                            {platforms.map((platform, index) => (
                                <li key={index} style={{ backgroundColor: platform.color, padding: '10px', borderRadius: '50%' }}>
                                    <a href={platform.link} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                        {platform.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p style={{textAlign:"center"}}>أو نسخ الرابط</p>
                        <div className={`field ${isCopied ? 'active' : ''}`}>
                            <Link className="url-icon" />
                            <input type="text" readOnly value={shareLink} />
                            <button 
                                onClick={copyToClipboard} 
                                style={{ backgroundColor: isCopied ? '#4CAF50' : '#008CBA', color: 'white' }}
                            >
                                {isCopied ? 'تم النسخ' : 'نسخ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareModal;
