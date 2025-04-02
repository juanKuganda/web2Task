import type React from 'react';
import MasonryGallery from './masonryGallery';
import { HeroProps } from '@/pages/type';





const Hero: React.FC<HeroProps> = ({ headline, subtext, showCta = false, ctaText = 'Start Your Collection', ctaLink = '/dashboard' }) => {
    return (
        <div className="min-h-screen bg-gray-50 pt-16 dark:bg-neutral-900">
            <div className="container mx-auto px-20 py-12">
                <div className="mb-16">
                    <h1 className="mb-6 bg-linear-to-bl animate-pulse from-neutral-200 to-gray-500 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl lg:text-7xl">
                        {headline}
                    </h1>
                    <p className="mb-10 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">{subtext}</p>
                    {showCta && (
                        <a
                            href={ctaLink}
                            className="bg-primary hover:bg-primary-dark inline-block transform rounded-lg px-8 py-4 text-lg font-black text-white shadow-lg transition-colors duration-300 hover:-translate-y-1 hover:shadow-xl dark:text-neutral-900"
                        >
                            {ctaText}
                        </a>
                    )}
                </div>

                <div className="mb-12 px-2" id="gallery">
                    <MasonryGallery />
                </div>
            </div>
        </div>
    );
};

export default Hero;
