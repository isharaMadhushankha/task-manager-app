import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckSquare, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mongo-surface flex flex-col">
      {/* Mini Hero Band */}
      <div className="bg-mongo-brand-teal-deep text-mongo-on-dark pt-16 pb-32 px-4 flex flex-col items-center text-center">
        <div className="mb-6 p-4 bg-mongo-brand-teal-mid rounded-mongo-lg shadow-level-1">
          <CheckSquare className="w-10 h-10 text-mongo-brand-green" strokeWidth={2} />
        </div>
        <h1 className="mongo-display-lg mb-2">
          Task Manager
        </h1>
        <p className="mongo-subtitle text-mongo-on-dark-muted">
          Sign in to access your dashboard.
        </p>
      </div>

      {/* Form Card Overlapping Hero Band */}
      <div className="flex-grow flex justify-center px-4 -mt-20 pb-16">
        <div className="w-full max-w-[440px] bg-mongo-canvas border border-mongo-hairline shadow-level-4 rounded-mongo-lg p-8 sm:p-10 self-start">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mongo-caption-bold text-mongo-ink mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-mongo-steel pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md py-[10px] pl-11 pr-4 mongo-body-md text-mongo-ink placeholder:text-mongo-slate focus:outline-none focus:border-mongo-brand-green-dark transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mongo-caption-bold text-mongo-ink mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-mongo-steel pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md py-[10px] pl-11 pr-4 mongo-body-md text-mongo-ink placeholder:text-mongo-slate focus:outline-none focus:border-mongo-brand-green-dark transition-colors"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-mongo-brand-green text-mongo-brand-teal-deep mongo-button-md rounded-mongo-pill py-[12px] px-6 mongo-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
