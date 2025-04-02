import Footer from '@/components/footer';
import Hero from '@/components/hero';
import Navbar from '@/components/navbar';
import type React from 'react';



// Navigation links
const navLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '/about' },
];

// Footer links
const footerLinks = [
    { name: 'Privacy Policy', href: 'https://www.instagram.com/jnpblokg_/' },
    { name: 'Terms of Service', href: 'https://www.instagram.com/jnpblokg_/' },
    { name: 'Contact', href: 'https://www.instagram.com/jnpblokg_/' },
];

// Also update the logo to use a placeholder
const App: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar logo="https://via.placeholder.com/200x80?text=Digital+Museum" navLinks={navLinks} />

            <main className="flex-grow">
                <Hero
                    headline="My Digital Museum: A Journey Through Time"
                    subtext="A visual journey through my cherished memories, shared for you to experience."
                />
            </main>

            <Footer links={footerLinks} copyrightText="© 2025 Digital Personal Museum. All rights reserved." />
        </div>
    );
};

export default App;
