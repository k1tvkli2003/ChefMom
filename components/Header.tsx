import React from 'react';
import { SparkleIcon } from './icons';

interface HeaderProps {
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ subtitle }) => {
    return (
        <header className="w-full max-w-7xl text-center mb-6">
            <div className="flex items-center justify-center gap-3">
                <SparkleIcon className="w-10 h-10 text-purple-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-fuchsia-400 text-transparent bg-clip-text">
                    ChefMom
                </h1>
            </div>
            <p className="text-gray-400 mt-2 text-lg" dir="rtl">
                {subtitle || 'دستیار هوشمند آشپزخانه برای مامان‌جون؛ از رسپی تا برنامه‌ریزی غذا'}
            </p>
        </header>
    );
};

export default Header;
