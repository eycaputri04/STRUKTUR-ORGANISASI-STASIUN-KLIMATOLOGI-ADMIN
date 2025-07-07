"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaUsers, FaSitemap, FaSignOutAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Image from "next/image";

type SidebarProps = {
    active?: string;
};

const Sidebar = ({ active }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const menu = [
        { name: "Beranda", href: "/beranda", icon: <FaHome /> },
        { name: "Jabatan", href: "/jabatan", icon: <MdWork /> },
        { name: "Pegawai", href: "/pegawai", icon: <FaUsers /> },
        { name: "Struktur Organisasi", href: "/struktur", icon: <FaSitemap /> },
    ];

    const handleLogout = async () => {
        router.push("/");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("user_email");
    };

    return (
        <aside className="w-64 h-screen bg-blue-800 text-white flex flex-col rounded-tr-2xl rounded-br-2xl">
            {/* Logo */}
            <div className="flex flex-col items-center py-6">
                <Image src="/Logo.png" alt="BMKG" width={60} height={60} />
            </div>

            {/* Menu Navigasi */}
            <nav className="flex flex-col gap-1 px-3 flex-1 overflow-hidden">
                {menu.map((item) => {
                    const isActive =
                        active?.toLowerCase() === item.name.toLowerCase() ||
                        pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                                isActive
                                    ? "bg-white text-black"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}

                {/* Spacer untuk dorong logout ke bawah */}
                <div className="mt-auto" />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 mt-2 mb-4"
                >
                    <span className="text-lg">
                        <FaSignOutAlt />
                    </span>
                    Keluar
                </button>
            </nav>

            {/* Footer */}
            <footer className="text-xs text-center text-white p-4 opacity-70">
                Copyrights © 2025 - BhinnekaDev.
            </footer>
        </aside>
    );
};

export default Sidebar;
