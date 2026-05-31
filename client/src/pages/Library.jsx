import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';

const collections = [
  {
    title: 'Core Skills Pathways',
    description: 'Curated sequences for fundamentals, from note systems to study plans.',
    tag: 'Guided',
  },
  {
    title: 'Exam Sprints',
    description: 'High-intensity revision sets built for short time frames.',
    tag: 'Focus',
  },
  {
    title: 'Creator Toolkits',
    description: 'Templates and frameworks to publish better notes and resources.',
    tag: 'Build',
  },
  {
    title: 'Career Boosters',
    description: 'Practical skill packs built around real projects.',
    tag: 'Pro',
  },
];

const quickLinks = [
  { label: 'Notes Vault', path: '/dashboard' },
  { label: 'Video Library', path: '/video' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Library = ({ user }) => {
  const navigate = useNavigate();
  const isAdmin = user && ["admin@gmail.com", "sudhanshray10@gmail.com", "vs5825982@gmail.com"].includes(user.email);

  const handleLogout = () => {
    auth.signOut().then(() => navigate('/login'));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      <Navbar user={user} isAdmin={isAdmin} onLogout={handleLogout} />

      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="absolute top-10 -left-24 w-80 h-80 bg-yellow-500/10 rounded-full blur-[90px]" aria-hidden="true"></div>
        <div className="absolute bottom-0 right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" aria-hidden="true"></div>

        <div className="relative z-10 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 text-yellow-600 font-bold bg-yellow-50">
            E-books Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-6">
            Your learning e-books,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"> organized</span>.
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-500 font-medium">
            Discover structured collections, ready-to-use templates, and premium resources designed
            to keep your momentum steady and focused.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold shadow-[0_12px_24px_rgba(234,179,8,0.25)] transition-all"
            >
              {user ? 'Open My E-books' : 'Create Free Account'}
            </Link>
            <Link
              to="/video"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:border-yellow-400 hover:text-yellow-600 transition-all"
            >
              Explore Videos
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-yellow-500/15 rounded-3xl p-6 shadow-[0_16px_30px_rgba(234,179,8,0.08)] hover:-translate-y-1 transition-transform"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
                {item.tag}
              </div>
              <h3 className="text-xl font-extrabold mt-4 text-gray-900">{item.title}</h3>
              <p className="text-gray-500 mt-3 font-medium leading-relaxed">
                {item.description}
              </p>
              <button className="mt-6 text-sm font-bold text-yellow-600 hover:text-yellow-500">
                View collection
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Build your custom learning stack.
            </h2>
            <p className="text-gray-500 mt-4 font-medium max-w-xl">
              Combine curated collections, saved notes, and live sessions into a single, searchable workspace.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-6 py-3 rounded-2xl border border-yellow-500/20 text-gray-700 font-bold hover:border-yellow-500 hover:text-yellow-600 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Library;
