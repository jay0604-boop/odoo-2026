import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

/**
 * Handles communication with the backend authentication endpoints.
 * All API calls are isolated here for clean integration.
 */
const authApi = {
  /**
   * Log in user with credentials.
   * // TODO: Member 1 - Connect your login endpoint here: POST /api/v1/auth/login
   */
  login: async (email, password) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock verification (Replace with actual backend token retrieval)
    if (email && password.length >= 6) {
      return {
        success: true,
        user: {
          id: 'emp-101',
          name: 'Jane Doe',
          email: email,
          role: 'employee', // Hardcoded role for security demonstration
          department: 'Engineering'
        },
        token: 'mock-jwt-token-xyz'
      };
    }
    throw new Error('Invalid email or password (must be at least 6 characters).');
  },

  /**
   * Sign up user and register new employee account.
   * CRITICAL: Role must be strictly hardcoded or restricted to 'employee'.
   * // TODO: Member 1 - Connect your signup endpoint here: POST /api/v1/auth/signup
   */
  signup: async (name, email, password, department) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Formulate registration payload with privilege limitation
    const payload = {
      name,
      email,
      password,
      department,
      role: 'employee' // STRICT SECURITY POLICY: Hardcode to employee
    };

    console.log('Sending payload to signup API:', payload);

    if (name && email && password.length >= 6 && department) {
      return {
        success: true,
        user: {
          id: 'emp-' + Math.floor(Math.random() * 1000),
          name: name,
          email: email,
          role: payload.role, // Forced to 'employee'
          department: department
        },
        token: 'mock-jwt-token-new'
      };
    }
    throw new Error('Registration failed. Please complete all fields.');
  }
};

/* ==========================================================================
   LOGIN / SIGNUP SCREEN COMPONENT
   ========================================================================== */

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');

  const handleToggleTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setPassword('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Basic Input Validations
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        const response = await authApi.login(email, password);
        if (response.success) {
          onLoginSuccess(response.user);
          navigate('/dashboard');
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const response = await authApi.signup(name, email, password, department);
        if (response.success) {
          onLoginSuccess(response.user);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        
        {/* Portal Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">Odoo AMS</h2>
          <p className="mt-2 text-sm text-slate-400">Employee Portal Access</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => handleToggleTab('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'login'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleToggleTab('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'signup'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Forms */}
        <form className="mt-6 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            
            {/* Signup Only Fields */}
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product Management</option>
                    <option value="Design">Product Design</option>
                    <option value="HR & Operations">Operations & HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@company.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Privilege limitation warning info for signup */}
            {activeTab === 'signup' && (
              <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Security Note</strong>: Creating an account automatically registers you under standard <strong>Employee privileges</strong>. Admin roles can only be provisioned by governance.
                </span>
              </div>
            )}

          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 transition-all text-sm flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{activeTab === 'login' ? 'Access Portal' : 'Register Account'}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
