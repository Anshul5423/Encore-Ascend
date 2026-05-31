import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  deleteUser
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('email'); // 'email', 'phone', 'otp'
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Verification states
  const [verificationId, setVerificationId] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // Error & messaging states
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Setup recaptcha once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, []);

  const validateEmail = (val) => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(val)) {
      setEmailWarning('Warning: This email does not appear to be correct.');
      return false;
    }
    setEmailWarning('');
    return true;
  };

  const handleEmailBlur = () => {
    if (email) validateEmail(email);
  };

  const clearErrors = () => {
    setEmailWarning('');
    setPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!validateEmail(email)) return;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage('Successfully logged in!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const dbg = err.code;
      if (dbg === 'auth/wrong-password') {
        setPasswordError('Password is incorrect');
      } else if (dbg === 'auth/user-not-found' || dbg === 'auth/invalid-credential') {
        setGeneralError('Validation error: Email or password is not correct');
      } else {
        setGeneralError(err.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    clearErrors();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const details = getAdditionalUserInfo(result);
      
      // Prevent implicit signup during login flow
      if (details?.isNewUser) {
        await deleteUser(result.user);
        await auth.signOut();
        setGeneralError('Account not found. Please sign up first using the link below!');
        return;
      }

      setSuccessMessage('Successfully logged in with Google!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setGeneralError(err.message || 'Google login failed.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!phone) {
      setGeneralError('Please enter a valid phone number (e.g. +1234567890)');
      return;
    }
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmResult);
      setAuthMode('otp');
      setSuccessMessage('OTP sent to your phone!');
    } catch (err) {
      setGeneralError('Failed to send OTP. Ensure phone number starts with country code (+).');
      console.error(err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    try {
      const result = await confirmationResult.confirm(otp);
      const details = getAdditionalUserInfo(result);
      
      // Prevent implicit signup during login flow
      if (details?.isNewUser) {
        await deleteUser(result.user);
        await auth.signOut();
        setGeneralError('Account not found. Please sign up first using the link below!');
        return;
      }

      setSuccessMessage('Phone verified and logged in successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setGeneralError('Invalid or expired OTP. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    clearErrors();
    if (!email) {
      setGeneralError('Please enter your email above to receive a reset link.');
      return;
    }
    if (!validateEmail(email)) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('A password reset link has been sent to your email.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setGeneralError('No user found with this email address.');
      } else {
        setGeneralError('Failed to send reset email. Please try again.');
      }
    }
  };

  return (
    <div className="flex w-full h-screen font-sans bg-gray-50/50">
      
      {/* Left side: branding/illustration (hidden on small screens) */}
      <div className="hidden lg:flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-gray-50 via-gray-100 to-yellow-200 border-r border-yellow-600/20 overflow-hidden relative p-12 text-gray-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="z-10 max-w-md text-center">
          <div className="mb-6 w-56 h-56 lg:w-64 lg:h-64 mx-auto flex items-center justify-center p-6 bg-zinc-900 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] border-4 border-white transition-transform hover:scale-105 duration-500">
            <img src="/logo.png" alt="EA Encore Ascend Logo" className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
            
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight shadow-black/10 drop-shadow-lg">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Encore Ascend</span>
          </h1>
          <p className="text-lg font-medium text-gray-600 opacity-90 drop-shadow-md">
            Unlock your potential with world-class courses and an amazing community. Log in to continue your journey.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative bg-white">
        {/* Invisible ReCaptcha Container container */}
        <div id="recaptcha-container" className="hidden"></div>
        
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
              Sign In to Your Account
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Please enter your details to proceed</p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-xl bg-green-50 text-green-700 flex items-center gap-3 border border-green-200 shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          )}
          
          {generalError && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 flex items-start gap-3 border border-red-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-sm font-semibold">{generalError}</p>
            </div>
          )}

          {/* Form container */}
          <div className="bg-white">
            
            {authMode === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${emailWarning ? 'text-orange-400' : 'text-gray-500 group-focus-within:text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    </div>
                    <input 
                      type="email" 
                      placeholder="e.g., student@example.com"
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                        ${emailWarning ? 'border-orange-300 focus:ring-orange-200 bg-orange-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                      required
                    />
                  </div>
                  {emailWarning && <p className="mt-1.5 text-xs text-orange-600 font-medium flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{emailWarning}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 hover:underline focus:outline-none transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${passwordError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      className={`block w-full pl-11 pr-12 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                        ${passwordError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {passwordError && <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{passwordError}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-white hover:bg-white border border-yellow-500 text-yellow-500 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Sign In
                </button>
              </form>
            )}

            {authMode === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in zoom-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 8900"
                      className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all font-medium tracking-wide"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">Include country code (e.g. +1 or +91)</p>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Send OTP Code
                </button>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('email'); clearErrors(); }}
                  className="w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors text-center"
                >
                  ← Back to Email Sign In
                </button>
              </form>
            )}

            {authMode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in zoom-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Verify OTP</label>
                  <p className="text-xs text-gray-500 mb-3">Code sent to: <span className="font-semibold text-gray-800">{phone}</span></p>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit code"
                      className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all font-bold tracking-widest text-center"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-gray-900 font-bold rounded-xl shadow-lg shadow-green-200 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Verify & Sign In
                </button>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('phone'); setOtp(''); clearErrors(); }}
                  className="w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors text-center"
                >
                  ← Try a different number
                </button>
              </form>
            )}

          </div>

          {/* Social or Extra Login Methods */}
          {authMode === 'email' && (
            <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 w-full py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-base tracking-wide">Continue with Google</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-sm font-medium text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-yellow-600 font-bold hover:text-yellow-500 transition-colors hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
