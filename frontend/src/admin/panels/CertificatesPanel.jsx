import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiImage, FiFileText, FiExternalLink } from 'react-icons/fi';
import { certificatesAPI } from '../../services/api';

const defaultForm = { title: '', issuer: '', issue_date: '', credential_url: '' };

export default function CertificatesPanel() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await certificatesAPI.get();
      setCertificates(data?.certificates || data?.data || data || []);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => { setForm(defaultForm); setEditing(null); setShowForm(false); setMsg(null); };

  const openEdit = (cert) => {
    setForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issue_date: cert.issue_date ? cert.issue_date.slice(0, 10) : '',
      credential_url: cert.credential_url || '',
    });
    setEditing(cert._id);
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await certificatesAPI.update(editing, form);
        setMsg({ type: 'success', text: 'Certificate updated!' });
      } else {
        await certificatesAPI.create(form);
        setMsg({ type: 'success', text: 'Certificate added!' });
      }
      resetForm();
      fetchCertificates();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save certificate' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await certificatesAPI.delete(id);
      fetchCertificates();
    } catch { /* empty */ }
  };

  const handleUploadImage = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      await certificatesAPI.uploadImage(id, file);
      setMsg({ type: 'success', text: 'Image uploaded!' });
      fetchCertificates();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload image' });
    }
  };

  const handleUploadPdf = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      await certificatesAPI.uploadPdf(id, file);
      setMsg({ type: 'success', text: 'PDF uploaded!' });
      fetchCertificates();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload PDF' });
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card p-8 md:p-10">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-white/[0.03] rounded" /><div className="h-20 w-full bg-white/[0.03] rounded" /></div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center"><FiAward className="w-7 h-7 text-[#00E5FF]" /></div>
            <div><h2 className="text-2xl font-bold text-white">Certificates</h2><p className="text-[#94A3B8] text-sm">Manage your certificates and credentials</p></div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="premium-btn flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Certificate'}
          </button>
        </div>

        {msg && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
            {msg.type === 'success' ? <FiSave className="w-5 h-5 shrink-0" /> : <FiX className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-white/[0.06] rounded-2xl p-6 mb-6 bg-white/[0.03]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Issuer</label>
                <input type="text" name="issuer" value={form.issuer} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Issue Date</label>
                <input type="date" name="issue_date" value={form.issue_date} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Credential URL</label>
                <input type="url" name="credential_url" value={form.credential_url} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
                <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : editing ? 'Update Certificate' : 'Add Certificate'}
              </button>
              <button onClick={resetForm} className="premium-btn-outline flex items-center gap-2"><FiX className="w-4 h-4" /> Cancel</button>
            </div>
          </motion.div>
        )}

        <div className="border-t border-border pt-6">
          {certificates.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <FiAward className="w-16 h-16 mx-auto text-border mb-4" />
              <p className="text-[#94A3B8] text-lg font-medium">No certificates yet</p>
              <p className="text-[#94A3B8] text-sm mt-1">Click "Add Certificate" to showcase your credentials</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <motion.div key={cert._id} variants={item} className="p-5 rounded-xl bg-[#0D0D1A] flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                    {cert.image ? <img src={cert.image} alt="" className="w-full h-full rounded-xl object-cover" /> : <FiAward className="w-5 h-5 text-[#00E5FF]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{cert.title}</h4>
                    <p className="text-sm text-[#94A3B8] mt-0.5">{cert.issuer}</p>
                    {cert.issue_date && <p className="text-xs text-[#94A3B8] mt-1">{new Date(cert.issue_date).toLocaleDateString()}</p>}
                    <div className="flex items-center gap-2 mt-3">
                      {cert.credential_url && <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors"><FiExternalLink className="w-3.5 h-3.5" /></a>}
                      {cert.pdf_url && <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors"><FiFileText className="w-3.5 h-3.5" /></a>}
                      <label className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 cursor-pointer transition-colors">
                        <FiImage className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, cert._id)} className="hidden" />
                      </label>
                      <label className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 cursor-pointer transition-colors">
                        <FiFileText className="w-3.5 h-3.5" />
                        <input type="file" accept=".pdf" onChange={(e) => handleUploadPdf(e, cert._id)} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(cert)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(cert._id)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
