import { NavbarProps } from '@/pages/type';
import { Link, usePage } from '@inertiajs/react';
import { Library, LogOut } from 'lucide-react';
import type React from 'react';

type AuthProps = {
    auth: {
        user: {
            role: string;
        };
    };
};

const Navbar: React.FC<NavbarProps> = ({ logo, navLinks = [] }) => {
    const { auth } = usePage<AuthProps>().props; // Ambil data auth dari backend
    const userRole = auth?.user?.role || 'user'; // Ambil role dari auth


    return (
        <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-md dark:bg-black">
            <div className="container mx-auto flex items-center justify-between px-20 py-3">
                <div className="flex items-center">
                    <a href="/landing" className="text-primary text-xl font-bold">
                        <Library name={logo} size={24} />
                    </a>
                </div>

                {navLinks.length > 0 && (
                    <div className="hidden items-center space-x-6 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="hover:text-primary text-gray-700 transition-colors duration-300 dark:text-white"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                )}

                <div>
                    {userRole === 'admin' ? (
                        <a
                            href="/dashboard"
                            className="bg-primary hover:bg-primary-dark rounded-md px-4 py-1 text-white transition-colors duration-300 dark:text-neutral-900"
                        >
                            Admin
                        </a>
                    ) : (
                        <Link className="block w-full cursor-pointer" method="post" href={route('logout')} as="button">
                            <LogOut className="mr-2" />
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
