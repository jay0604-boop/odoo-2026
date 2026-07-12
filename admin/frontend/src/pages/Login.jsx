import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      // Handle Sign Up
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // If Supabase has "Confirm Email" enabled, user is null in session until confirmed
        if (data.user && data.user.identities && data.user.identities.length === 0) {
           setErrorMsg('This email is already registered. Please sign in instead.');
        } else if (data.session === null) {
           setSuccessMsg('Success! Please check your email for a confirmation link.');
        } else {
           // Successfully signed up and logged in (email confirmations disabled)
           navigate('/');
        }
      }
    } else {
      // Handle Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-beige font-sans">
      {/* Left Column - Branding (Hidden on very small screens) */}
      <div className="hidden lg:flex w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-sage/10 rounded-full blur-3xl mix-blend-overlay"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-sage/20 p-2.5 rounded-xl border border-sage/30">
            <ShieldCheck size={28} className="text-sage" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-mono">AssetFlow</h1>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Enterprise Control at Your Fingertips.
          </h2>
          <p className="text-beige/70 text-lg leading-relaxed">
            Manage your entire fleet of assets, track real-time allocations, and oversee maintenance operations from a single, unified command center.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-beige/40 text-sm">
            &copy; 2026 AssetFlow Enterprise. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="bg-navy p-2 rounded-xl">
              <ShieldCheck size={24} className="text-beige" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-navy font-mono">AssetFlow</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-navy mb-3">
              {isSignUp ? 'Create Account' : 'Admin Login'}
            </h2>
            <p className="text-charcoal/60">
              {isSignUp ? 'Register a new admin credential.' : 'Enter your credentials to access the console.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-rust/10 border border-rust/20 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-rust mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rust font-medium">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-sage/10 border border-sage/20 rounded-lg flex items-start gap-3">
              <ShieldCheck size={18} className="text-sage mt-0.5 flex-shrink-0" />
              <p className="text-sm text-sage font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal/80 mb-2">
                Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-navy/10 rounded-lg text-charcoal focus:bg-white focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-all"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-charcoal/80">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-navy/70 hover:text-navy transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-navy/10 rounded-lg text-charcoal focus:bg-white focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-navy hover:bg-navy/90 text-beige font-semibold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-beige/30 border-t-beige rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  {isSignUp ? 'Register Credential' : 'Sign In to Console'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign up / Sign in */}
          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need a test account? Create one'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
