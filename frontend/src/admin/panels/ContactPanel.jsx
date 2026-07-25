import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { contactAPI } from '../../services/api';

const defaultForm = { email: '', phone: '', address: '', linkedin: '', github: '', website: '', twitter: '' };

export default function ContactPanel() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchContact(); }, []);

  const fetchContact = async () => {
    try {
      const { data } = await contactAPI.get();
      const item = data?.contact || data?.data || data?.[0] || data;
      if (item && item._id) {
        setContact(item);
        setForm({
          email: item.email || '',
          phone: item.phone || '',
          address: item.address || '',
          linkedin: item.linkedin || '',
          github: item.github || '',
          website: item.website || '',
          twitter: item.twitter || '',
        });
      }
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!contact?._id) return;
    setSaving(true); setMsg(null);
    try {
      await contactAPI.update(contact._id, form);
      setMsg({ type: 'success', text: 'Contact info updated!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update contact info' });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card p-8 md:p-10">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-10 w-full bg-gray-200 rounded" /><div className="h-10 w-full bg-gray-200 rounded" /></div>
    </motion.div>
  );

  if (!contact) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-card p-8 md:p-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiMail className="w-7 h-7 text-primary" /></div>
        <div><h2 className="text-2xl font-bold text-primary-text">Contact</h2><p className="text-secondary-text text-sm">No contact record found. Please add one via the database.</p></div>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiMail className="w-7 h-7 text-primary" /></div>
          <div><h2 className="text-2xl font-bold text-primary-text">Contact</h2><p className="text-secondary-text text-sm">Manage your contact information</p></div>
        </div>

        {msg && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg.type === 'success' ? <FiCheckCircle className="w-5 h-5 shrink-0" /> : <FiAlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
        )}

        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary-text mb-1.5">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">LinkedIn</label>
              <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">GitHub</label>
              <input type="url" name="github" value={form.github} onChange={handleChange} className="input-field" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Website</label>
              <input type="url" name="website" value={form.website} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Twitter</label>
              <input type="url" name="twitter" value={form.twitter} onChange={handleChange} className="input-field" placeholder="https://twitter.com/..." />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
              <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
