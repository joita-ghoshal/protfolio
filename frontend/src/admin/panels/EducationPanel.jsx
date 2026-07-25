import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { educationAPI } from '../../services/api';

const defaultForm = { institution: '', degree: '', field: '', start_date: '', end_date: '', description: '', current: false, order: 0 };

export default function EducationPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const { data } = await educationAPI.get();
      setItems(data?.education || data?.data || data || []);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => { setForm(defaultForm); setEditing(null); setShowForm(false); setMsg(null); };

  const openEdit = (item) => {
    setForm({
      institution: item.institution || '',
      degree: item.degree || '',
      field: item.field || '',
      start_date: item.start_date ? item.start_date.slice(0, 10) : '',
      end_date: item.end_date ? item.end_date.slice(0, 10) : '',
      description: item.description || '',
      current: item.current || false,
      order: item.order || 0,
    });
    setEditing(item._id);
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    const payload = { ...form, order: Number(form.order) };
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await educationAPI.update(editing, payload);
        setMsg({ type: 'success', text: 'Education updated!' });
      } else {
        await educationAPI.create(payload);
        setMsg({ type: 'success', text: 'Education added!' });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await educationAPI.delete(id);
      fetchItems();
    } catch { /* empty */ }
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
            <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center"><FiBook className="w-7 h-7 text-[#00E5FF]" /></div>
            <div><h2 className="text-2xl font-bold text-white">Education</h2><p className="text-[#94A3B8] text-sm">Manage your education history</p></div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="premium-btn flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Education'}
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
                <label className="block text-sm font-medium text-white mb-1.5">Institution</label>
                <input type="text" name="institution" value={form.institution} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Degree</label>
                <input type="text" name="degree" value={form.degree} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Field of Study</label>
                <input type="text" name="field" value={form.field} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Order</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">End Date</label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange} disabled={form.current} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="current" checked={form.current} onChange={handleChange} className="w-4 h-4 rounded border-border text-[#00E5FF] focus:ring-[#00E5FF]" />
                  <span className="text-sm text-white">Currently studying here</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
                <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </button>
              <button onClick={resetForm} className="premium-btn-outline flex items-center gap-2"><FiX className="w-4 h-4" /> Cancel</button>
            </div>
          </motion.div>
        )}

        <div className="border-t border-border pt-6">
          {items.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <FiBook className="w-16 h-16 mx-auto text-border mb-4" />
              <p className="text-[#94A3B8] text-lg font-medium">No education records yet</p>
              <p className="text-[#94A3B8] text-sm mt-1">Click "Add Education" to get started</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {items.map((entry) => (
                <motion.div key={entry._id} variants={item} className="p-5 rounded-xl bg-[#0D0D1A] flex items-start justify-between gap-4 group">
                  <div>
                    <h4 className="font-semibold text-white">{entry.institution}</h4>
                    <p className="text-sm text-[#94A3B8] mt-0.5">{entry.degree}{entry.field ? ` in ${entry.field}` : ''}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {entry.start_date && new Date(entry.start_date).toLocaleDateString()} - {entry.current ? 'Present' : entry.end_date ? new Date(entry.end_date).toLocaleDateString() : ''}
                    </p>
                    {entry.description && <p className="text-sm text-[#94A3B8] mt-2">{entry.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(entry)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(entry._id)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
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
