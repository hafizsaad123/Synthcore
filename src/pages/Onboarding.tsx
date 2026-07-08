import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { INITIAL_AI_TOOLS } from '../data/mockData';
import { Check, ArrowRight, ArrowLeft, Layers, ShieldCheck, HelpCircle, Lock, X, User, ShieldAlert } from 'lucide-react';
import ToolLogo from '../components/ToolLogo';

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = (location.state as any)?.mode === 'signin' ? 'signin' : 'signup';
  
  // Step State
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Step 1: Account Creation & Login selection
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'forgot' | 'reset'>(initialMode);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  // Forgot and Reset Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  // Sign in specifics
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Google SSO Simulation States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleAuthMode, setGoogleAuthMode] = useState<'signup' | 'signin'>('signup');
  const [googleStep, setGoogleStep] = useState<'choose' | 'loading' | 'custom'>('choose');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [googleError, setGoogleError] = useState('');

  const handleGoogleLogin = (mode: 'signup' | 'signin') => {
    setGoogleAuthMode(mode);
    setGoogleStep('choose');
    setValidationError('');
    setGoogleError('');
    setCustomGoogleEmail('');
    setCustomGoogleName('');
    setIsGoogleModalOpen(true);
  };

  const handleSelectGoogleAccount = (emailAddress: string, name: string) => {
    setGoogleStep('loading');
    
    // Simulate real secure connection handshake delay
    setTimeout(() => {
      setIsGoogleModalOpen(false);

      const isAllowedAdmin = emailAddress.toLowerCase() === 'admin@arxodyne.com';

      const parts = name.trim().split(' ');
      const fName = parts[0] || 'User';
      const lName = parts.slice(1).join(' ') || 'Google';

      if (googleAuthMode === 'signin') {
        // Log in directly
        localStorage.setItem('synthcore_username', name);
        localStorage.setItem('synthcore_email', emailAddress.toLowerCase());
        localStorage.setItem('synthcore_company', isAllowedAdmin ? 'Arxodyne Technologies' : 'Independent Builder');
        localStorage.setItem('synthcore_onboarded', 'true');
        
        if (isAllowedAdmin) {
          localStorage.setItem('synthcore_is_super', 'true');
        } else {
          localStorage.removeItem('synthcore_is_super');
        }
        
        navigate('/dashboard');
      } else {
        // Sign up mode: pre-fill details and jump to Step 2 (Company Profile)
        setFirstName(fName);
        setLastName(lName);
        setEmail(emailAddress);
        setPassword('google_authenticated_oauth_token');
        setCompany(isAllowedAdmin ? 'Arxodyne Technologies' : 'Personal Team');
        
        // Store in registered users list
        const storedUsers = JSON.parse(localStorage.getItem('synthcore_registered_users') || '[]');
        const userExists = storedUsers.some((u: any) => u.email.toLowerCase() === emailAddress.toLowerCase());
        if (!userExists) {
          storedUsers.push({
            firstName: fName,
            lastName: lName,
            email: emailAddress,
            password: 'google_authenticated_oauth_token',
            company: isAllowedAdmin ? 'Arxodyne Technologies' : 'Personal Team'
          });
          localStorage.setItem('synthcore_registered_users', JSON.stringify(storedUsers));
        }

        localStorage.setItem('synthcore_username', name);
        localStorage.setItem('synthcore_email', emailAddress.toLowerCase());
        localStorage.setItem('synthcore_company', isAllowedAdmin ? 'Arxodyne Technologies' : 'Personal Team');
        if (isAllowedAdmin) {
          localStorage.setItem('synthcore_is_super', 'true');
        } else {
          localStorage.removeItem('synthcore_is_super');
        }

        // Advance to step 2 directly
        setStep(2);
      }
    }, 1800);
  };

  // Step 2: Company Profile
  const [industry, setIndustry] = useState('ecommerce');
  const [companySize, setCompanySize] = useState('small');
  const [aiToolCount, setAiToolCount] = useState('few');

  // Step 3: Selected Tools
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Step 4: First Goal
  const [goal, setGoal] = useState('');

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const nextStep = () => {
    setValidationError('');
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !company.trim()) {
        setValidationError('Please fill in all information.');
        return;
      }
      if (!isValidEmail(email)) {
        setValidationError('Please enter a valid work email address.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password should be at least 6 characters long.');
        return;
      }

      const checkEmail = email.trim().toLowerCase();
      if (checkEmail === 'admin@arxodyne.com') {
        setValidationError("The admin email address 'admin@arxodyne.com' is reserved. Please use a different email address.");
        return;
      }

      // Store in registered users
      const storedUsers = JSON.parse(localStorage.getItem('synthcore_registered_users') || '[]');
      const userExists = storedUsers.some((u: any) => u.email.toLowerCase() === checkEmail);
      if (userExists) {
        setValidationError('An account with this email already exists. Please log in instead.');
        return;
      }

      storedUsers.push({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        company: company.trim()
      });
      localStorage.setItem('synthcore_registered_users', JSON.stringify(storedUsers));

      localStorage.setItem('synthcore_username', `${firstName.trim()} ${lastName.trim()}`);
      localStorage.setItem('synthcore_company', company.trim());
      localStorage.setItem('synthcore_email', email.trim().toLowerCase());
      localStorage.removeItem('synthcore_is_super');
    }
    if (step === 3) {
      localStorage.setItem('synthcore_selected_tools', JSON.stringify(selectedTools));
    }
    if (step === 4) {
      localStorage.setItem('synthcore_goal', goal);
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!signinEmail.trim() || !signinPassword) {
      setValidationError('Please provide both email and password.');
      return;
    }
    if (!isValidEmail(signinEmail)) {
      setValidationError('Please enter a valid work email address.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('synthcore_registered_users') || '[]');
    const foundUser = storedUsers.find(
      (u: any) => u.email.toLowerCase() === signinEmail.trim().toLowerCase() && u.password === signinPassword
    );

    const adminOverridePassword = localStorage.getItem('synthcore_admin_password_override') || 'password123';

    if (foundUser) {
      localStorage.setItem('synthcore_username', `${foundUser.firstName} ${foundUser.lastName}`);
      localStorage.setItem('synthcore_company', foundUser.company);
      localStorage.setItem('synthcore_email', foundUser.email.trim().toLowerCase());
      localStorage.setItem('synthcore_onboarded', 'true');
      
      const isAllowedAdmin = foundUser.email.trim().toLowerCase() === 'admin@arxodyne.com';
      if (isAllowedAdmin) {
        localStorage.setItem('synthcore_is_super', 'true');
      } else {
        localStorage.removeItem('synthcore_is_super');
      }
      navigate('/dashboard');
    } else if (signinEmail.trim().toLowerCase() === 'admin@arxodyne.com' && signinPassword === adminOverridePassword) {
      localStorage.setItem('synthcore_username', 'Saad');
      localStorage.setItem('synthcore_company', 'Arxodyne Technologies');
      localStorage.setItem('synthcore_email', 'admin@arxodyne.com');
      localStorage.setItem('synthcore_onboarded', 'true');
      localStorage.setItem('synthcore_is_super', 'true');
      navigate('/dashboard');
    } else {
      setValidationError('Invalid email address or incorrect password.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setForgotSuccessMessage('');

    if (!forgotEmail.trim()) {
      setValidationError('Please enter your work email address.');
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      setValidationError('Please enter a valid work email address.');
      return;
    }

    const checkForgotEmail = forgotEmail.trim().toLowerCase();
    if (checkForgotEmail === 'admin@arxodyne.com') {
      setValidationError('For security, the administrator password cannot be reset automatically. Please contact our support.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('synthcore_registered_users') || '[]');
    const isRegistered = storedUsers.some((u: any) => u.email.toLowerCase() === checkForgotEmail);

    if (!isRegistered) {
      setValidationError('This email address is not registered in our system.');
      return;
    }

    setForgotSuccessMessage('Verification code sent. For testing, use code: 888888');
    setAuthMode('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!resetCode.trim()) {
      setValidationError('Please enter the security verification code.');
      return;
    }
    if (resetCode.trim() !== '888888') {
      setValidationError('Incorrect verification code. Please check and try again.');
      return;
    }
    if (!newPassword) {
      setValidationError('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setValidationError('Password should be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setValidationError('The passwords do not match. Please verify.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('synthcore_registered_users') || '[]');
    let userFound = false;

    if (forgotEmail.trim().toLowerCase() === 'admin@arxodyne.com') {
      const existingIdx = storedUsers.findIndex((u: any) => u.email.toLowerCase() === 'admin@arxodyne.com');
      if (existingIdx !== -1) {
        storedUsers[existingIdx].password = newPassword;
      } else {
        storedUsers.push({
          firstName: 'Saad',
          lastName: 'Arxodyne',
          email: 'admin@arxodyne.com',
          password: newPassword,
          company: 'Arxodyne Technologies'
        });
      }
      localStorage.setItem('synthcore_registered_users', JSON.stringify(storedUsers));
      localStorage.setItem('synthcore_admin_password_override', newPassword);
      userFound = true;
    } else {
      const userIdx = storedUsers.findIndex((u: any) => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
      if (userIdx !== -1) {
        storedUsers[userIdx].password = newPassword;
        localStorage.setItem('synthcore_registered_users', JSON.stringify(storedUsers));
        userFound = true;
      }
    }

    if (userFound) {
      setForgotSuccessMessage('Password successfully updated. You may now log in.');
      setAuthMode('signin');
      setSigninEmail(forgotEmail);
      setSigninPassword('');
      // Reset state variables
      setForgotEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setValidationError('An unexpected error occurred during password reset.');
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleLaunchDashboard = () => {
    localStorage.setItem('synthcore_onboarded', 'true');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm animate-in fade-in duration-200">
            <div className="flex flex-col gap-6">
              
              {/* TABS FOR AUTH MODE */}
              {(authMode === 'signup' || authMode === 'signin') && (
                <div className="flex border-b border-brand-sand">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setValidationError('');
                      setForgotSuccessMessage('');
                    }}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'border-brand-orange text-brand-orange font-extrabold'
                        : 'border-transparent text-brand-stone hover:text-brand-chocolate font-semibold'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setValidationError('');
                      setForgotSuccessMessage('');
                    }}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'border-brand-orange text-brand-orange font-extrabold'
                        : 'border-transparent text-brand-stone hover:text-brand-chocolate font-semibold'
                    }`}
                  >
                    Log in
                  </button>
                </div>
              )}

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold leading-normal animate-in fade-in duration-150">
                  ⚠️ {validationError}
                </div>
              )}

              {forgotSuccessMessage && authMode !== 'reset' && (
                <div className="p-3 bg-brand-sand border border-brand-sand text-brand-stone rounded-lg text-xs font-semibold leading-normal animate-in fade-in duration-150">
                  ℹ️ {forgotSuccessMessage}
                </div>
              )}

              {authMode === 'signup' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Welcome to Arxodyne</h2>
                    <p className="text-sm text-brand-stone">
                      Create your friendly AI team dashboard in seconds.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane.doe@enterprise.com"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                      />
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Create Account <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center my-1.5">
                    <div className="flex-1 h-px bg-brand-sand"></div>
                    <span className="px-3 text-[10px] font-sans uppercase tracking-wider text-brand-stone font-bold">OR</span>
                    <div className="flex-1 h-px bg-brand-sand"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('signup')}
                    className="w-full py-3 bg-white hover:bg-brand-beige text-brand-chocolate border border-brand-sand hover:border-brand-stone text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

              {authMode === 'signin' && (
                <form onSubmit={handleSignIn} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Log in</h2>
                    <p className="text-sm text-brand-stone">
                      Welcome back! Log into your Arxodyne space.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        value={signinEmail}
                        onChange={(e) => setSigninEmail(e.target.value)}
                        placeholder="admin@arxodyne.com"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot');
                            setValidationError('');
                            setForgotSuccessMessage('');
                          }}
                          className="text-xs text-brand-stone hover:text-brand-orange hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        type="password"
                        value={signinPassword}
                        onChange={(e) => setSigninPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Log In <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center my-1.5">
                    <div className="flex-1 h-px bg-brand-sand"></div>
                    <span className="px-3 text-[10px] font-sans uppercase tracking-wider text-brand-stone font-bold">OR</span>
                    <div className="flex-1 h-px bg-brand-sand"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('signin')}
                    className="w-full py-3 bg-white hover:bg-brand-beige text-brand-chocolate border border-brand-sand hover:border-brand-stone text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>
                </form>
              )}

              {authMode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Recover Access</h2>
                    <p className="text-sm text-brand-stone">
                      Enter your email to receive a password recovery link.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="jane.doe@enterprise.com"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Send Verification Link <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setValidationError('');
                      setForgotSuccessMessage('');
                    }}
                    className="w-full py-2.5 text-brand-stone hover:text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full text-center cursor-pointer"
                  >
                    ← Back to Log In
                  </button>
                </form>
              )}

              {authMode === 'reset' && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Reset Your Password</h2>
                    <p className="text-sm text-brand-stone">
                      We sent a login code to your email <span className="font-semibold text-brand-chocolate">{forgotEmail}</span>.
                    </p>
                  </div>

                  {forgotSuccessMessage && (
                    <div className="p-3 bg-brand-sand border border-brand-sand text-brand-stone rounded-lg text-xs font-semibold leading-normal">
                      ℹ️ {forgotSuccessMessage}
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Verification Code</label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="e.g. 888888"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-mono"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Update Password & Log In <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setValidationError('');
                      setForgotSuccessMessage('');
                    }}
                    className="w-full py-2.5 text-brand-stone hover:text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full text-center cursor-pointer"
                  >
                    ← Cancel and Back to Log In
                  </button>
                </form>
              )}

              <p className="text-[10px] text-center text-brand-stone font-semibold leading-normal">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Company Profile</h2>
                <p className="text-sm text-brand-stone">
                  This helps Arxodyne recommend the right automated setup for your industry.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans bg-white"
                  >
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="fintech">Financial Services</option>
                    <option value="healthcare">Healthcare & Biotech</option>
                    <option value="saas">SaaS & Software</option>
                    <option value="logistics">Logistics & Supply Chain</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans bg-white"
                  >
                    <option value="micro">1–10 employees</option>
                    <option value="small">11–50 employees</option>
                    <option value="medium">51–200 employees</option>
                    <option value="large">201–1000 employees</option>
                    <option value="enterprise">1000+ employees</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">AI Tools currently in use</label>
                  <select
                    value={aiToolCount}
                    onChange={(e) => setAiToolCount(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans bg-white"
                  >
                    <option value="0">None yet</option>
                    <option value="few">1–3 tools</option>
                    <option value="several">4–10 tools</option>
                    <option value="many">10+ tools</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-3 bg-white hover:bg-brand-beige text-brand-chocolate border border-brand-sand text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 ml-auto shadow-sm"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Connect AI Tools</h2>
                <p className="text-sm text-brand-stone">
                  Select the AI helpers you currently use. Arxodyne will organize and link them as secure assets.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {INITIAL_AI_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected 
                          ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange' 
                          : 'border-brand-sand bg-white hover:border-brand-stone'
                      }`}
                    >
                      <div className="w-9 h-9 flex items-center justify-center text-brand-chocolate">
                        <ToolLogo id={tool.id} className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-brand-chocolate text-center line-clamp-1">
                        {tool.name}
                      </span>
                      <span className={`text-[9px] font-sans uppercase px-2.5 py-0.5 rounded-full font-bold ${
                        isSelected 
                          ? 'bg-brand-orange text-white' 
                          : 'bg-brand-sand text-brand-stone'
                      }`}>
                        {isSelected ? 'CONNECTED' : 'CONNECT'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-3 bg-white hover:bg-brand-beige text-brand-chocolate border border-brand-sand text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={selectedTools.length === 0}
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-sand disabled:text-brand-stone disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 ml-auto shadow-sm"
                >
                  Connect {selectedTools.length} Tool{selectedTools.length !== 1 ? 's' : ''} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Set First Goal</h2>
                <p className="text-sm text-brand-stone">
                  What would you like your AI team to focus on first? Write it in plain, easy English.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">What is your target objective?</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  placeholder='e.g. "Draft answers for common customer emails" or "Organize our weekly database files"'
                  className="w-full px-4 py-3 text-sm border border-brand-sand rounded-xl focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans resize-none"
                />
                <span className="text-[11px] text-brand-stone font-semibold">Just describe the outcome. Arxodyne handles the automation behind it.</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-brand-stone uppercase tracking-wider font-sans">Or pick a popular starter template:</span>
                <div className="flex flex-col gap-2">
                  {[
                    'Reduce email support reply times by half',
                    'Automate weekly data export reporting',
                    'Send qualified inbound leads directly to Slack',
                    'Sync customer support notes with team database',
                  ].map((template) => (
                    <button
                      key={template}
                      onClick={() => setGoal(template)}
                      type="button"
                      className="px-3.5 py-2.5 bg-brand-beige hover:bg-brand-sand text-brand-chocolate text-[11px] font-bold rounded-xl transition-colors text-left border border-brand-sand"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {goal.length >= 10 && (
                <div className="p-4 bg-brand-beige border border-brand-sand rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-chocolate">
                    <Layers className="w-4 h-4 text-brand-orange" />
                    ARXODYNE COORDINATION WORKFLOW
                  </div>
                  <ul className="text-xs text-brand-stone list-disc list-inside space-y-1.5 font-semibold">
                    <li>Link and prepare requested AI helpers securely.</li>
                    <li>Route task items intelligently to achieve the objective.</li>
                    <li>Keep complete and readable log histories of actions.</li>
                    <li>Keep backup connections active for continuous operation.</li>
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-3 bg-white hover:bg-brand-beige text-brand-chocolate border border-brand-sand text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={goal.length < 10}
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-sand disabled:text-brand-stone disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 ml-auto shadow-sm"
                >
                  Activate Arxodyne <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col gap-6 text-center items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">ALL SYSTEMS INITIALIZED</span>
                <h2 className="text-2xl font-display font-extrabold text-brand-chocolate tracking-tight">Arxodyne is Ready</h2>
                <p className="text-sm text-brand-stone max-w-sm">
                  Your AI helpers are configured and connected. Your friendly real-time dashboard is ready to use.
                </p>
              </div>

              <div className="w-full bg-brand-beige border border-brand-sand rounded-xl p-4 text-left text-xs flex flex-col gap-2.5 font-semibold text-brand-chocolate">
                {[
                  { label: `Account for ${firstName || 'User'} created`, done: true },
                  { label: `${selectedTools.length} AI tools integrated`, done: true },
                  { label: `Objective: "${goal}" set up`, done: true },
                  { label: 'Smart automation safety enabled', done: true },
                  { label: 'Dashboard control center ready', done: true },
                ].map(({ label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-brand-chocolate">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLaunchDashboard}
                className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
              >
                Open My Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans flex flex-col justify-center py-12 px-6">
      <div className="max-w-[500px] w-full mx-auto flex flex-col gap-6">
        
        {/* Onboarding Logo */}
        <div className="flex items-center justify-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate">
            arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
          </span>
          <span className="text-xs bg-brand-sand px-2.5 py-1 rounded-full font-bold text-brand-stone">ONBOARDING</span>
        </div>

        {/* Progress header bar */}
        <div className="bg-white border border-brand-sand rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 text-xs text-brand-stone font-semibold">
          <div className="flex justify-between items-center">
            <span>STEP {step} OF {totalSteps}</span>
            <span className="text-brand-orange">{Math.round(progress)}% COMPLETED</span>
          </div>
          <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-orange transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content card */}
        {renderStep()}
      </div>

      {/* GOOGLE INTEGRATED SSO SECURITY GATEWAY */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-chocolate/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden relative p-8 animate-in zoom-in-95 duration-150">
            
            {/* Close button */}
            <button 
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-brand-stone hover:text-brand-chocolate hover:bg-brand-beige rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Identity Logo & Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>

              {googleStep === 'choose' && (
                <>
                  <h3 className="text-xl font-bold text-brand-chocolate tracking-tight">Choose an account</h3>
                  <p className="text-xs text-brand-stone mt-1">to continue to <span className="font-semibold text-brand-orange">Arxodyne</span></p>
                </>
              )}

              {googleStep === 'loading' && (
                <>
                  <h3 className="text-lg font-bold text-brand-chocolate tracking-tight">Connecting account...</h3>
                  <p className="text-xs text-brand-stone mt-1">Establishing a secure connection</p>
                </>
              )}

              {googleStep === 'custom' && (
                <>
                  <h3 className="text-xl font-bold text-brand-chocolate tracking-tight">Sign in with Google</h3>
                  <p className="text-xs text-brand-stone mt-1">Use a custom Google Account</p>
                </>
              )}
            </div>

            {/* CHOOSE STEP */}
            {googleStep === 'choose' && (
              <div className="flex flex-col gap-2.5">
                {/* User email option */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('admin@arxodyne.com', 'Saad')}
                  className="w-full text-left p-3.5 hover:bg-brand-beige border border-brand-sand rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                    AR
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-chocolate line-clamp-1">Saad</p>
                    <p className="text-[10px] text-brand-stone line-clamp-1">admin@arxodyne.com</p>
                  </div>
                  <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full shrink-0">
                    ADMIN
                  </span>
                </button>

                {/* Simulated default email */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('hafizmuhammadsaad4@gmail.com', 'Hafiz Saad')}
                  className="w-full text-left p-3.5 hover:bg-brand-beige border border-brand-sand rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-sand text-brand-chocolate flex items-center justify-center font-bold text-xs">
                    HS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-chocolate line-clamp-1">Hafiz Saad</p>
                    <p className="text-[10px] text-brand-stone line-clamp-1">hafizmuhammadsaad4@gmail.com</p>
                  </div>
                </button>

                {/* Use another account option */}
                <button
                  type="button"
                  onClick={() => setGoogleStep('custom')}
                  className="w-full text-left p-3.5 hover:bg-brand-beige border border-dashed border-brand-sand rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-beige text-brand-stone flex items-center justify-center font-bold text-xs border border-brand-sand">
                    +
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-brand-chocolate font-sans">Use another account</p>
                    <p className="text-[10px] text-brand-stone">Link a different Google email</p>
                  </div>
                </button>

                <div className="text-[10px] text-brand-stone leading-normal mt-3 font-semibold">
                  Google will securely share your login details with Arxodyne to set up your space. You can review our Privacy Policy anytime.
                </div>
              </div>
            )}

            {/* LOADING / HANDSHAKE STEP */}
            {googleStep === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-sand"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-brand-orange border-l-brand-orange animate-spin"></div>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[10px] text-brand-orange uppercase tracking-widest font-bold animate-pulse">Syncing Connection</span>
                  <span className="text-[9px] text-brand-stone">Arxodyne Secure Layer Active</span>
                </div>
              </div>
            )}

            {/* CUSTOM ACCOUNT STEP */}
            {googleStep === 'custom' && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setGoogleError('');
                  const checkEmail = customGoogleEmail.trim().toLowerCase();
                  if (!checkEmail) return;
                  if (checkEmail === 'admin@arxodyne.com') {
                    setGoogleError("The email 'admin@arxodyne.com' is reserved. Custom single sign-on is disabled for this address.");
                    return;
                  }
                  const mockName = customGoogleName.trim() || checkEmail.split('@')[0];
                  handleSelectGoogleAccount(checkEmail, mockName);
                }}
                className="flex flex-col gap-4"
              >
                {googleError && (
                  <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold leading-normal animate-in fade-in duration-100">
                    ⚠️ {googleError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Google Email Address</label>
                  <input
                    type="email"
                    required
                    value={customGoogleEmail}
                    onChange={(e) => {
                      setCustomGoogleEmail(e.target.value);
                      setGoogleError('');
                    }}
                    placeholder="you@gmail.com"
                    className="w-full bg-white border border-brand-sand rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Full Name (Optional)</label>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="e.g. Saad"
                    className="w-full bg-white border border-brand-sand rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-black font-sans"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleStep('choose');
                      setGoogleError('');
                    }}
                    className="px-5 py-2.5 bg-brand-beige hover:bg-brand-sand text-brand-chocolate text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer border border-brand-sand"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
