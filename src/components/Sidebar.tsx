
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/projects', label: 'Manajemen Proyek' },
    { href: '/users', label: 'Manajemen Pengguna' },
    { href: '/stock', label: 'Manajemen Stok' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="text-2xl font-bold mb-10">KonveksiApp</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-4">
              <Link href={item.href}>
                <p className={`p-2 rounded hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-900' : ''}`}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
