import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(params.get('redirect') || '/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-foreground text-center mb-6">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
        <p className="text-right text-sm mt-2">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
