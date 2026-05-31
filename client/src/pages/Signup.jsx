import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Signup() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('email'); // 'email', 'phone', 'otp'
  
  // Registration Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification States
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // Individual Validation Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

  const clearErrors = () => {
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    let isValid = true;
    clearErrors();

    // 1. Name Validation (No Numbers)
    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else if (/\d/.test(name)) {
      setNameError('Name should not contain any numbers.');
      isValid = false;
    }

    // 2. Email Validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // 3. Phone Validation (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      setPhoneError('Phone number is required.');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      isValid = false;
    }

    // 4. Password Validation (Complex rules)
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase alphabet.');
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase alphabet.');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number.');
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character.');
      isValid = false;
    }

    // 5. Confirm Password Validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Password and Confirm Password must match.');
      isValid = false;
    }

    return isValid;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name using the provided name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      setSuccessMessage('Account created successfully! Welcome on board.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setGeneralError('An account already exists with this email address.');
      } else {
        setGeneralError(err.message || 'Signup failed. Please try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    clearErrors();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccessMessage('Successfully signed up with Google!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setGeneralError(err.message || 'Google signup failed.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!otpPhone) {
      setGeneralError('Please enter a valid phone number (e.g. +1234567890)');
      return;
    }
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmResult = await signInWithPhoneNumber(auth, otpPhone, appVerifier);
      setConfirmationResult(confirmResult);
      setAuthMode('otp');
      setSuccessMessage('OTP sent to your phone!');
    } catch (err) {
      setGeneralError('Failed to send OTP. Ensure phone number starts with country code (+).');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    try {
      await confirmationResult.confirm(otp);
      setSuccessMessage('Phone verified! Account registered successfully.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setGeneralError('Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <div className="flex w-full min-h-screen font-sans bg-gray-50/50">
      
      {/* Left side: branding/illustration (hidden on small screens) */}
      <div className="hidden lg:flex flex-col w-5/12 justify-center items-center bg-gradient-to-br from-gray-50 via-gray-100 to-yellow-200 border-r border-yellow-600/20 overflow-hidden relative p-12 text-gray-900 fixed h-screen">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="z-10 max-w-md text-center">
          <div className="mb-6 w-56 h-56 lg:w-64 lg:h-64 mx-auto flex items-center justify-center p-6 bg-zinc-900 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] border-4 border-white transition-transform hover:scale-105 duration-500">
            <img src="/logo.png" alt="EA Encore Ascend Logo" className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
            
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight shadow-black/10 drop-shadow-lg">
            Start Your Journey Today
          </h1>
          <p className="text-lg font-medium text-gray-600 opacity-90 drop-shadow-md">
            Join thousands of learners shaping their future. Creating an account takes less than a minute.
          </p>
        </div>
      </div>

      {/* Right side: Signup form */}
      <div className="flex flex-col w-full lg:w-7/12 items-center justify-center p-6 sm:p-12 relative bg-white ml-auto min-h-screen">
        {/* Invisible ReCaptcha Container container */}
        <div id="recaptcha-container" className="hidden"></div>
        
        <div className="w-full max-w-lg space-y-8 my-8">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
              Create Your Account
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Please fill in your details to get started</p>
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
              <form onSubmit={handleEmailSignup} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${nameError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g., John Doe"
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${nameError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                      value={name}
                      onChange={(e) => {setName(e.target.value); setNameError('');}}
                    />
                  </div>
                  {nameError && <p className="mt-1.5 text-xs text-red-600 font-bold">{nameError}</p>}
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${emailError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                      </div>
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        className={`block w-full pl-11 pr-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${emailError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); setEmailError('');}}
                      />
                    </div>
                    {emailError && <p className="mt-1.5 text-xs text-red-600 font-bold">{emailError}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${phoneError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <input 
                        type="tel" 
                        placeholder="10 digit number"
                        className={`block w-full pl-11 pr-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${phoneError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                        value={phone}
                        onChange={(e) => {
                          // Allow typing numbers, limit visual if possible but relying on submit validation too
                          const val = e.target.value.replace(/\D/g, '');
                          if(val.length <= 10) setPhone(val);
                          setPhoneError('');
                        }}
                      />
                    </div>
                    {phoneError && <p className="mt-1.5 text-xs text-red-600 font-bold">{phoneError}</p>}
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${passwordError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className={`block w-full pl-11 pr-12 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${passwordError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setPasswordError('');}}
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
                    {passwordError && <p className="mt-1.5 text-xs text-red-600 font-bold">{passwordError}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${confirmPasswordError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className={`block w-full pl-11 pr-12 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${confirmPasswordError ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30'}`}
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value); setConfirmPasswordError('');}}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                    {confirmPasswordError && <p className="mt-1.5 text-xs text-red-600 font-bold">{confirmPasswordError}</p>}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 bg-white hover:bg-white border border-yellow-500 text-yellow-500 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Register Account
                  </button>
                </div>
              </form>
            )}

            {/* Custom Phone Auth Sections */}
            {authMode === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in zoom-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-yellow-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 8900"
                      className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all font-medium tracking-wide"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
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
                  ← Back to standard signup
                </button>
              </form>
            )}

            {authMode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in zoom-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Verify OTP</label>
                  <p className="text-xs text-gray-500 mb-3">Code sent to: <span className="font-semibold text-gray-800">{otpPhone}</span></p>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-yellow-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
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
                  className="w-full py-3 px-4 bg-white hover:bg-white border border-yellow-500 text-yellow-500 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Verify & Create Account
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

          {/* Social or Extra Sign Up Methods */}
          {authMode === 'email' && (
            <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Or sign up with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleGoogleSignup}
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

          <div className="text-center mt-8 pb-8">
            <p className="text-sm font-medium text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-600 font-bold hover:text-gold-700 transition-colors hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
