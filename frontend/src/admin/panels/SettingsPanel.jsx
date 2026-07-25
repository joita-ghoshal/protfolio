import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { settingsAPI } from '../../services/api';

const defaultForm = { site_title: '', footer_text: '', meta_description: '', meta_keywords: '', theme_color: '#1E3A8A' };

export default function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.get();
      const item = data?.settings || data?.data || data?.[0] || data;
      if (item && item._id) {
        setSettings(item);
        setForm({
          site_title: item.site_title || item.siteTitle || '',
          footer_text: item.footer_text || item.footerText || '',
          meta_description: item.meta_description || item.metaDescription || '',
          meta_keywords: (item.meta_keywords || item.metaKeywords || '').toString(),
          theme_color: item.theme_color || item.themeColor || '#1E3A8A',
        });
      }
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!settings?._id) return;
    setSaving(true); setMsg(null);
    try {
      await settingsAPI.update(settings._id, form);
      setMsg({ type: 'success', text: 'Settings saved!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card p-8 md:p-10">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-10 w-full bg-gray-200 rounded" /><div className="h-10 w-full bg-gray-200 rounded" /></div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiSettings className="w-7 h-7 text-primary" /></div>
          <div><h2 className="text-2xl font-bold text-primary-text">Settings</h2><p className="text-secondary-text text-sm">Configure your site settings</p></div>
        </div>

        {msg && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg.type === 'success' ? <FiCheckCircle className="w-5 h-5 shrink-0" /> : <FiAlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
        )}

        {!settings ? (
          <div className="border-t border-border pt-8 text-center py-12">
            <FiSettings className="w-16 h-16 mx-auto text-border mb-4" />
            <p className="text-secondary-text text-lg font-medium">No settings found</p>
            <p className="text-secondary-text text-sm mt-1">Please add a settings record via the database</p>
          </div>
        ) : (
          <div className="border-t border-border pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Site Title</label>
                <input type="text" name="site_title" value={form.site_title} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Footer Text</label>
                <input type="text" name="footer_text" value={form.footer_text} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-text mb-1.5">Meta Description</label>
                <textarea name="meta_description" rows={2} value={form.meta_description} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-text mb-1.5">Meta Keywords</label>
                <input type="text" name="meta_keywords" value={form.meta_keywords} onChange={handleChange} className="input-field" placeholder="keyword1, keyword2, keyword3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="theme_color" value={form.theme_color} onChange={handleChange} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <span className="text-sm text-secondary-text">{form.theme_color}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
                <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
