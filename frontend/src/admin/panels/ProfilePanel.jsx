import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSave, FiUpload, FiFileText, FiCheckCircle, FiAlertCircle, FiImage } from 'react-icons/fi';
import { aboutAPI } from '../../services/api';

export default function ProfilePanel() {
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState({ name: '', headline: '', bio: '', career_objective: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data } = await aboutAPI.get();
      const item = data?.about || data?.data || data?.[0] || data;
      if (item && item._id) {
        setAbout(item);
        setForm({ name: item.name || '', headline: item.headline || '', bio: item.bio || '', career_objective: item.career_objective || '', location: item.location || '' });
      }
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!about?._id) return;
    setSaving(true); setMsg(null);
    try {
      await aboutAPI.update(about._id, form);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      fetchAbout();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally { setSaving(false); }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]; if (!file || !about?._id) return;
    setSaving(true); setMsg(null);
    try {
      await aboutAPI.uploadImage(about._id, file);
      setMsg({ type: 'success', text: 'Image uploaded successfully!' });
      fetchAbout();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload image' });
    } finally { setSaving(false); }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0]; if (!file || !about?._id) return;
    setSaving(true); setMsg(null);
    try {
      await aboutAPI.uploadResume(about._id, file);
      setMsg({ type: 'success', text: 'Resume uploaded successfully!' });
      fetchAbout();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload resume' });
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
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiUser className="w-7 h-7 text-primary" /></div>
          <div><h2 className="text-2xl font-bold text-primary-text">Profile</h2><p className="text-secondary-text text-sm">Manage your personal information</p></div>
        </div>

        {msg && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg.type === 'success' ? <FiCheckCircle className="w-5 h-5 shrink-0" /> : <FiAlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
        )}

        <div className="border-t border-border pt-8">
          {about?.profile_image && (
            <div className="mb-6">
              <img src={about.profile_image} alt="Profile" className="w-28 h-28 rounded-2xl object-cover border-2 border-border" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Headline</label>
              <input type="text" name="headline" value={form.headline} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary-text mb-1.5">Bio</label>
              <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary-text mb-1.5">Career Objective</label>
              <textarea name="career_objective" rows={3} value={form.career_objective} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1.5">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-border">
            <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
              <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <label className="premium-btn-outline flex items-center gap-2 cursor-pointer">
              <FiImage className="w-4 h-4" /> Upload Image
              <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
            </label>

            <label className="premium-btn-outline flex items-center gap-2 cursor-pointer">
              <FiFileText className="w-4 h-4" /> Upload Resume
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUploadResume} className="hidden" />
            </label>

            {about?.resume_url && (
              <a href={about.resume_url} target="_blank" rel="noopener noreferrer" className="premium-btn-outline flex items-center gap-2">
                <FiFileText className="w-4 h-4" /> View Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
