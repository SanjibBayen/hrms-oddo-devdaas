import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Toast from '../../components/ui/Toast';

interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToForgotPassword,
}) => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleQuickLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@hrms.com', password: 'Admin@123', color: 'bg-red-50 border-red-200 text-red-800' },
    { role: 'Employee', email: 'john@hrms.com', password: 'Employee@123', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { role: 'Employee', email: 'jane@hrms.com', password: 'Employee@123', color: 'bg-green-50 border-green-200 text-green-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Toast
        isVisible={!!error}
        message={error}
        type="error"
        onClose={() => setError('')}
      />

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-gray-900 p-3 rounded-xl text-white">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">HRMS Enterprise</h1>
          <p className="text-xs text-gray-500">Human Resource Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hrms.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-gray-900 font-semibold hover:underline"
              >
                Create account
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6">
          <div className="flex items-center gap-2 justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase">Demo Quick Access</span>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleQuickLogin(acc.email, acc.password)}
                disabled={isLoading}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left hover:opacity-80 transition-opacity ${acc.color}`}
              >
                <div>
                  <p className="text-xs font-semibold">{acc.email}</p>
                  <p className="text-[10px] opacity-70">Password: {acc.password}</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-black/10 px-2 py-0.5 rounded-full">
                  {acc.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;