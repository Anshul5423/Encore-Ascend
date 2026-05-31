import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';

const posts = [
  {
    title: 'How to build a weekly study sprint that actually sticks',
    excerpt: 'Turn chaotic to-do lists into a 7-day sprint with clear inputs, outputs, and recovery time.',
    category: 'Study Systems',
    date: 'May 22, 2026',
    readTime: '6 min read',
    highlights: [
      'Start with a single outcome you can ship in seven days.',
      'Define daily inputs: 2 deep work blocks, 1 review block.',
      'Protect recovery time so you avoid burnout by day five.',
    ],
  },
  {
    title: 'The note framework that scales from class to career',
    excerpt: 'A simple structure that keeps notes skimmable while still preserving deep context.',
    category: 'Notes',
    date: 'May 10, 2026',
    readTime: '4 min read',
    highlights: [
      'Use headings for outcomes, not topics.',
      'Store sources at the bottom to keep summaries clean.',
      'Add a “next action” line after every section.',
    ],
  },
  {
    title: 'Learning with momentum: managing energy, not hours',
    excerpt: 'Why short, high-quality sessions beat long study marathons when you want consistency.',
    category: 'Productivity',
    date: 'April 30, 2026',
    readTime: '5 min read',
    highlights: [
      'Match hard tasks to your highest-energy hours.',
      'Stack micro-sessions for review and recall.',
      'End sessions with a 2-minute reset plan.',
    ],
  },
];

const BlogPost = ({ user }) => {
  const navigate = useNavigate();
  const isAdmin = user && ["admin@gmail.com", "sudhanshray10@gmail.com", "vs5825982@gmail.com"].includes(user.email);
  const [activePost, setActivePost] = useState(null);

  const handleLogout = () => {
    auth.signOut().then(() => navigate('/login'));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      <Navbar user={user} isAdmin={isAdmin} onLogout={handleLogout} />

      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="absolute top-16 right-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" aria-hidden="true"></div>

        <div className="relative z-10 text-left">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 text-yellow-600 font-bold bg-yellow-50">
            Encore Ascend Blog
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-6">
            Fresh ideas for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"> modern learners</span>.
          </h1>
          <p className="max-w-2xl mt-6 text-lg text-gray-500 font-medium">
            Deep dives, quick hits, and practical systems to keep your learning projects moving forward.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white border border-yellow-500/15 rounded-3xl p-6 shadow-[0_16px_30px_rgba(234,179,8,0.08)] hover:-translate-y-1 transition-transform cursor-pointer"
              onClick={() => setActivePost(post)}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
                {post.category}
              </div>
              <h3 className="text-xl font-extrabold mt-4 text-gray-900">{post.title}</h3>
              <p className="text-gray-500 mt-3 font-medium leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-6 text-xs font-bold text-gray-400">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 shadow-[0_30px_50px_rgba(15,23,42,0.25)]">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black">Join the learning newsletter.</h2>
            <p className="text-gray-300 mt-4 font-medium max-w-xl">
              Get weekly strategies, curated links, and new course drops straight to your inbox.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-72 px-4 py-3 rounded-2xl text-gray-900 font-medium focus:outline-none"
            />
            <button className="px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold">
              Subscribe
            </button>
          </div>
          <Link to="/library" className="text-sm font-bold text-yellow-200 hover:text-yellow-100">
            Explore the library
          </Link>
        </div>
      </section>

      {activePost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-yellow-500/10 relative overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">{activePost.category}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-2">{activePost.title}</h3>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-gray-600 text-base font-medium leading-relaxed">
                {activePost.excerpt}
              </p>
              <div className="mt-6 grid gap-3">
                {activePost.highlights.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 mt-2 rounded-full bg-yellow-500"></span>
                    <p className="text-gray-700 font-medium">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400">
                <span>{activePost.date}</span>
                <span>{activePost.readTime}</span>
              </div>
            </div>
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setActivePost(null)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:border-yellow-400 hover:text-yellow-600 transition-all"
              >
                Close
              </button>
              <Link
                to="/library"
                className="px-5 py-2.5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-center"
              >
                Explore E-books
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
