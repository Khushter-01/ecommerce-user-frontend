import { useState } from 'react';
import { useAuth, Address } from '@/context/AuthContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || [{ street: '', city: '', state: '', pincode: '', country: 'India' }]);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone, addresses });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setChangingPw(false);
    }
  };

  const updateAddress = (i: number, field: keyof Address, value: string) => {
    setAddresses(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

      <div className="flex gap-2 mb-6">
        {(['info', 'password'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'info' ? 'My Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'info' ? (
        <form onSubmit={handleSaveInfo} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Email</label>
            <input value={user?.email || ''} disabled className="w-full h-10 rounded-lg border border-input bg-muted px-3 text-sm mt-1 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>

          <h3 className="text-sm font-semibold text-foreground pt-2">Address</h3>
          {addresses.map((addr, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              {(['street', 'city', 'state', 'pincode', 'country'] as const).map(f => (
                <div key={f} className={f === 'street' ? 'col-span-2' : ''}>
                  <label className="text-xs text-muted-foreground capitalize">{f}</label>
                  <input value={addr[f]} onChange={e => updateAddress(i, f, e.target.value)} className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-0.5" />
                </div>
              ))}
            </div>
          ))}

          <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword} className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-md">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Current Password</label>
            <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">New Password</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1" />
          </div>
          <button type="submit" disabled={changingPw} className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
