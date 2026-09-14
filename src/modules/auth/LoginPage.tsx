import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { Input } from '../../shared/components/ui/Input';
import { Button } from '../../shared/components/ui/Button';
import { MortarboardSvg } from '../../shared/components/graphics/MortarboardSvg';
import { useAuth } from './hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('admin@vtuapp.in');
  const [password, setPassword] = useState('AdminGovernance2026!');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Animated Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-blue-900/40 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-2xl space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20">
            <MortarboardSvg className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">VTU SUPER APP</h1>
            <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mt-0.5">
              Governance & Admin Console
            </p>
          </div>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4 text-slate-400" />}
            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-sm font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
            isLoading={isLoading}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Authenticate & Access Portal
          </Button>
        </form>

        {/* Admin Credential Helper Note */}
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/30 text-[11px] text-blue-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" /> Default Admin Provisioned
          </span>
          <span className="font-mono text-slate-400">admin@vtuapp.in</span>
        </div>

        {/* Footer Seal */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-1">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            Visvesvaraya Technological University Belagavi
          </p>
          <p className="text-[10px] text-slate-500">Autonomous Student & Academic Administration System</p>
        </div>
      </div>
    </div>
  );
};
