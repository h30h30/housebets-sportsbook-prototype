import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  User,
  X,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { email: string; username: string; method: string }) => void;
  isPhoneFrame?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
  isPhoneFrame = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [username, setUsername] = useState('RosySlingshot178');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [confirmAge, setConfirmAge] = useState(true);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    emailOrUser?: string;
    username?: string;
    email?: string;
    password?: string;
    terms?: string;
    resetEmail?: string;
  }>({});

  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setIsSubmitting(false);
    setResetSent(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const triggerAuthenticated = (payload: {
    email: string;
    username: string;
    method: string;
  }) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(payload);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: typeof errors = {};

    if (mode === 'login') {
      if (!emailOrUser.trim()) {
        nextErrors.emailOrUser = 'Please enter your email or username.';
      } else if (emailOrUser.includes('@') && !isValidEmail(emailOrUser)) {
        nextErrors.emailOrUser = 'Please enter a valid email address.';
      }
      if (!password.trim()) {
        nextErrors.password = 'Please enter your password.';
      } else if (password.trim().length < 4) {
        nextErrors.password = 'Password must be at least 4 characters.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      const cleanName = emailOrUser.trim();
      triggerAuthenticated({
        email: cleanName.includes('@') ? cleanName : `${cleanName}@housebets.io`,
        username: cleanName.includes('@') ? cleanName.split('@')[0] : cleanName,
        method: 'Email',
      });
    } else if (mode === 'register') {
      if (!username.trim() || username.trim().length < 3) {
        nextErrors.username = 'Username must be at least 3 characters.';
      }
      if (!email.trim()) {
        nextErrors.email = 'Please enter your email address.';
      } else if (!isValidEmail(email)) {
        nextErrors.email = 'Please enter a valid email address (e.g. alex@domain.com).';
      }
      if (!password.trim() || password.trim().length < 6) {
        nextErrors.password = 'Password must be at least 6 characters.';
      }
      if (!agreeTerms || !confirmAge) {
        nextErrors.terms = 'You must accept the terms and confirm you are 18+.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      const cleanUser = username.trim();
      triggerAuthenticated({
        email: email.trim(),
        username: cleanUser,
        method: 'Email',
      });
    } else if (mode === 'forgot') {
      if (!resetEmail.trim()) {
        nextErrors.resetEmail = 'Please enter your account email address.';
      } else if (!isValidEmail(resetEmail)) {
        nextErrors.resetEmail = 'Please enter a valid email address.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setResetSent(true);
      }, 450);
    }
  };

  return (
    <div
      className={`${
        isPhoneFrame ? 'absolute' : 'fixed'
      } inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${
          isPhoneFrame
            ? 'max-w-[354px] max-h-[88%] overflow-y-auto grid-cols-1'
            : 'max-w-[780px] grid-cols-1 md:grid-cols-12'
        } rounded-2xl bg-[#0B161C] border border-[#172D38] shadow-2xl overflow-hidden text-white grid relative`}
      >
        {/* Close Button (Top Right) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Form */}
        <div
          className={`${
            isPhoneFrame ? 'p-4' : 'md:col-span-7 p-6 sm:p-7'
          } flex flex-col justify-between bg-[#0B161C]`}
        >
          <div>
            {mode === 'forgot' ? (
              /* FORGOT PASSWORD VIEW */
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                    setResetSent(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log in</span>
                </button>

                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Reset your password
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Enter the email associated with your Housebets account and we’ll send a reset link.
                  </p>
                </div>

                {resetSent ? (
                  <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Reset link sent!</span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      We’ve sent password recovery instructions to{' '}
                      <strong className="text-white">{resetEmail}</strong>. Check your inbox or spam folder.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setEmailOrUser(resetEmail);
                        setResetSent(false);
                      }}
                      className="w-full h-10 rounded-xl bg-[#2CE5FF] hover:bg-[#5EEAD4] text-[#061116] text-xs font-extrabold transition-colors"
                    >
                      Return to Log in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Account email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => {
                            setResetEmail(e.target.value);
                            if (errors.resetEmail) {
                              setErrors((prev) => ({ ...prev, resetEmail: undefined }));
                            }
                          }}
                          placeholder="Enter your email address"
                          className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#10212B] border ${
                            errors.resetEmail
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                      </div>
                      {errors.resetEmail && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.resetEmail}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-[#2CE5FF] hover:bg-[#67E8F9] disabled:opacity-60 text-[#061116] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending reset link...</span>
                        </>
                      ) : (
                        <span>Send reset link</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Top Underline Tabs: Log in | Register */}
                <div className="flex items-center gap-6 border-b border-[#182C36] mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrors({});
                    }}
                    className={`pb-3 text-base font-extrabold transition-colors relative ${
                      mode === 'login'
                        ? 'text-white'
                        : 'text-[#64748B] hover:text-[#94A3B8]'
                    }`}
                  >
                    Log in
                    {mode === 'login' && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#2CE5FF]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrors({});
                    }}
                    className={`pb-3 text-base font-extrabold transition-colors relative ${
                      mode === 'register'
                        ? 'text-white'
                        : 'text-[#64748B] hover:text-[#94A3B8]'
                    }`}
                  >
                    Register
                    {mode === 'register' && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#2CE5FF]" />
                    )}
                  </button>
                </div>

                {mode === 'login' ? (
                  /* LOG IN FORM */
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Email or username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={emailOrUser}
                          onChange={(e) => {
                            setEmailOrUser(e.target.value);
                            if (errors.emailOrUser) {
                              setErrors((prev) => ({
                                ...prev,
                                emailOrUser: undefined,
                              }));
                            }
                          }}
                          placeholder="Enter email or username"
                          className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#10212B] border ${
                            errors.emailOrUser
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                      </div>
                      {errors.emailOrUser && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.emailOrUser}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                              setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                              }));
                            }
                          }}
                          placeholder="Enter a password"
                          className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#10212B] border ${
                            errors.password
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setErrors({});
                          }}
                          className="text-[11px] font-bold text-white hover:text-[#2CE5FF] transition-colors"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        triggerAuthenticated({
                          email: 'surejumper016@housebets.io',
                          username: 'SureJumper016',
                          method: 'Passkey',
                        })
                      }
                      className="w-full h-11 rounded-xl bg-[#11222C] hover:bg-[#172E3B] disabled:opacity-60 border border-[#1B3544] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-[#94A3B8]" />
                      <span>Log in with passkey</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-[#152833] hover:bg-[#2CE5FF] disabled:opacity-60 text-white hover:text-[#061116] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username) {
                              setErrors((prev) => ({
                                ...prev,
                                username: undefined,
                              }));
                            }
                          }}
                          placeholder="Enter a username"
                          className={`w-full h-11 pl-10 pr-9 rounded-xl bg-[#10212B] border ${
                            errors.username
                              ? 'border-rose-500 focus:border-rose-400'
                              : username.trim().length >= 3
                              ? 'border-emerald-500/60 focus:border-[#2CE5FF]'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                        {username.trim().length >= 3 && !errors.username && (
                          <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {errors.username ? (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.username}</span>
                        </p>
                      ) : (
                        username.trim().length >= 3 && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#CBD5E1]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2CE5FF] shrink-0" />
                            <span>Username available.</span>
                          </div>
                        )
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                              }));
                            }
                          }}
                          placeholder="Enter an email"
                          className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#10212B] border ${
                            errors.email
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                              setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                              }));
                            }
                          }}
                          placeholder="Enter a password (min 6 chars)"
                          className={`w-full h-11 pl-10 pr-10 rounded-xl bg-[#10212B] border ${
                            errors.password
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#1C3745] focus:border-[#2CE5FF]'
                          } focus:outline-none text-xs text-white placeholder-[#64748B]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-0.5">
                      <label className="flex items-center gap-2.5 text-[11px] text-[#94A3B8] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => {
                            setAgreeTerms(e.target.checked);
                            if (errors.terms) {
                              setErrors((prev) => ({ ...prev, terms: undefined }));
                            }
                          }}
                          className="w-4 h-4 rounded bg-[#10212B] border-[#1C3745] accent-[#2CE5FF]"
                        />
                        <span>
                          I agree to the{' '}
                          <span className="text-[#2CE5FF] underline">
                            Terms and Conditions
                          </span>{' '}
                          and{' '}
                          <span className="text-[#2CE5FF] underline">
                            Privacy Policy
                          </span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 text-[11px] text-[#94A3B8] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={confirmAge}
                          onChange={(e) => {
                            setConfirmAge(e.target.checked);
                            if (errors.terms) {
                              setErrors((prev) => ({ ...prev, terms: undefined }));
                            }
                          }}
                          className="w-4 h-4 rounded bg-[#10212B] border-[#1C3745] accent-[#2CE5FF]"
                        />
                        <span>I confirm I am 18 years of age or older</span>
                      </label>
                      {errors.terms && (
                        <p className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.terms}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-[#152833] hover:bg-[#2CE5FF] disabled:opacity-60 text-white hover:text-[#061116] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Bottom Social / Web3 4-Column Row: Google, X, Telegram, MetaMask */}
          <div className="pt-4 mt-4">
            <div className="flex items-center gap-3 text-[11px] text-[#64748B] mb-3">
              <div className="h-px flex-1 bg-[#182C36]" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-[#182C36]" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Google */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  triggerAuthenticated({
                    email: 'alex.google@gmail.com',
                    username: 'SureJumper016',
                    method: 'Google',
                  })
                }
                className="h-11 rounded-xl bg-[#10212B] hover:bg-[#17303E] disabled:opacity-60 border border-[#1C3745] flex items-center justify-center transition-colors"
                title="Continue with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  triggerAuthenticated({
                    email: 'x_player@housebets.io',
                    username: 'SureJumper016',
                    method: 'X',
                  })
                }
                className="h-11 rounded-xl bg-[#10212B] hover:bg-[#17303E] disabled:opacity-60 border border-[#1C3745] flex items-center justify-center text-white transition-colors"
                title="Continue with X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* Telegram */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  triggerAuthenticated({
                    email: 'tg_player@housebets.io',
                    username: 'SureJumper016',
                    method: 'Telegram',
                  })
                }
                className="h-11 rounded-xl bg-[#10212B] hover:bg-[#17303E] disabled:opacity-60 border border-[#1C3745] flex items-center justify-center transition-colors"
                title="Continue with Telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#2AABEE" />
                  <path
                    d="M16.8 7.6L15.1 16.2C14.95 16.8 14.6 16.95 14.1 16.65L11.35 14.6L10.02 15.88C9.87 16.03 9.75 16.15 9.46 16.15L9.66 13.35L14.76 8.74C14.98 8.54 14.71 8.43 14.42 8.62L8.12 12.59L5.4 11.74C4.81 11.55 4.8 11.15 5.52 10.87L16.15 6.77C16.64 6.59 17.07 6.88 16.8 7.6Z"
                    fill="white"
                  />
                </svg>
              </button>

              {/* MetaMask / Web3 Wallet */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  triggerAuthenticated({
                    email: '0x71C...89A4',
                    username: 'SureJumper016',
                    method: 'MetaMask',
                  })
                }
                className="h-11 rounded-xl bg-[#10212B] hover:bg-[#17303E] disabled:opacity-60 border border-[#1C3745] flex items-center justify-center transition-colors"
                title="Continue with MetaMask / Web3 Wallet"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                  <path
                    d="M17.2 6.5L13.1 9.6L13.8 7.8L17.2 6.5ZM6.8 6.5L10.8 9.7L10.2 7.8L6.8 6.5ZM15.7 14.8L14.6 16.6L17 17.3L17.7 14.9L15.7 14.8ZM6.3 14.9L7 17.3L9.4 16.6L8.3 14.8L6.3 14.9ZM9.2 11.5L8.5 12.6L10.9 12.7L10.8 10.1L9.2 11.5ZM14.8 11.5L13.1 10L13.1 12.7L15.5 12.6L14.8 11.5ZM9.4 16.6L10.8 15.9L9.6 14.9L9.4 16.6ZM13.2 15.9L14.6 16.6L14.4 14.9L13.2 15.9Z"
                    fill="#E2761B"
                    stroke="#E2761B"
                    strokeWidth="0.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.6 16.6L13.2 15.9L13.4 17L13.3 17.6L14.6 16.6ZM9.4 16.6L10.7 17.6L10.6 17L10.8 15.9L9.4 16.6Z"
                    fill="#D7C1B3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Official Housebets Porcelain Whale & H-Chips Artwork */}
        {!isPhoneFrame && (
          <div className="hidden md:block md:col-span-5 relative bg-[#12313B] overflow-hidden select-none">
            <img
              src="/assets/aistudio/1d0027ce-1264-4c9d-85cb-032d05edcd7b_ed1837df.jpg"
              alt="Housebets"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};
