import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, isAdmin, onLogout, searchBar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-50 border-b border-yellow-500/20 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl border border-yellow-500/40 flex items-center justify-center p-1 shadow-[0_0_16px_rgba(234,179,8,0.25)] hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-xl w-full h-full flex items-center justify-center ring-1 ring-yellow-500/15">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display='none'; }}/>
                </div>
              </div>
              
            </Link>
            
            <div className="hidden lg:flex items-center gap-4 xl:gap-8 border-l border-gray-200 pl-4 lg:pl-6 xl:pl-10">
              <Link to="/blog" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">Blog Post</Link>
              <Link to="/dashboard" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">Resources & Notes</Link>
              <Link to="/library" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">E-books</Link>
              <Link to="/video" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">Courses</Link>
              <Link to="/about" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">About Us</Link>
              <Link to="/contact" className="text-[15px] font-bold text-gray-500 hover:text-yellow-500 transition-colors whitespace-nowrap">Contact</Link>
              
              <div className="ml-2 xl:ml-4">
                {searchBar}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
            {!user ? (
               <div className="flex items-center gap-4">
                 <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                 <Link to="/signup" className="text-sm font-bold text-black bg-yellow-500 hover:bg-yellow-400 px-5 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                   Sign Up
                 </Link>
               </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-sm border border-yellow-500/30">
                     {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                   </div>
                   <span className="text-gray-600 text-sm font-medium">{user.email}</span>
                </div>
                {isAdmin && (
                  <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30 mr-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    Admin
                  </span>
                )}
                <button onClick={onLogout} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 hover:border-gray-400 bg-gray-100/50 hover:bg-gray-200/50 rounded-lg px-5 py-2">
                  Sign Out
                </button>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   {mobileMenuOpen ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   )}
                </svg>
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
             <Link to="/blog" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">Blog Post</Link>
             <Link to="/dashboard" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">Resources & Notes</Link>
             <Link to="/library" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">E-books</Link>
           <Link to="/video" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">Courses</Link>
           <Link to="/about" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">About Us</Link>
           <Link to="/contact" className="block text-gray-600 font-bold hover:text-yellow-500 py-2">Contact</Link>
           {searchBar && <div className="py-2">{searchBar}</div>}
           <hr className="border-gray-200 my-2" />
           {!user ? (
             <div className="flex flex-col gap-2">
               <Link to="/login" className="text-center text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors py-2 border border-gray-300 rounded-lg">Sign In</Link>
               <Link to="/signup" className="text-center text-sm font-bold text-black bg-yellow-500 hover:bg-yellow-400 py-2 rounded-lg transition-colors">Sign Up</Link>
             </div>
           ) : (
             <button onClick={onLogout} className="w-full text-center text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 bg-gray-100/50 rounded-lg py-2">
                Sign Out
             </button>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
