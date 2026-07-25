import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { skillsAPI } from '../../services/api';

const defaultForm = { name: '', percentage: '', category: 'Frontend', icon: '' };
const categories = ['Frontend', 'Backend', 'Programming Languages', 'Database', 'Tools', 'Other'];

export default function SkillsPanel() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await skillsAPI.get();
      setSkills(data?.skills || data?.data || data || []);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => { setForm(defaultForm); setEditing(null); setShowForm(false); setMsg(null); };

  const openEdit = (skill) => {
    setForm({ name: skill.name || '', percentage: skill.percentage || '', category: skill.category || 'Frontend', icon: skill.icon || '' });
    setEditing(skill._id);
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    const payload = { ...form, percentage: Number(form.percentage) };
    if (payload.percentage < 0 || payload.percentage > 100) { setMsg({ type: 'error', text: 'Percentage must be between 0 and 100' }); return; }
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await skillsAPI.update(editing, payload);
        setMsg({ type: 'success', text: 'Skill updated!' });
      } else {
        await skillsAPI.create(payload);
        setMsg({ type: 'success', text: 'Skill added!' });
      }
      resetForm();
      fetchSkills();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save skill' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      fetchSkills();
    } catch { /* empty */ }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

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
            <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center"><FiCode className="w-7 h-7 text-[#00E5FF]" /></div>
            <div><h2 className="text-2xl font-bold text-white">Skills</h2><p className="text-[#94A3B8] text-sm">Manage your technical skills</p></div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="premium-btn flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Skill'}
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
                <label className="block text-sm font-medium text-white mb-1.5">Skill Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. React" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Percentage (0-100)</label>
                <input type="number" name="percentage" value={form.percentage} onChange={handleChange} min="0" max="100" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Icon (optional)</label>
                <input type="text" name="icon" value={form.icon} onChange={handleChange} className="input-field" placeholder="devicon-react-original" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
                <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : editing ? 'Update Skill' : 'Add Skill'}
              </button>
              <button onClick={resetForm} className="premium-btn-outline flex items-center gap-2"><FiX className="w-4 h-4" /> Cancel</button>
            </div>
          </motion.div>
        )}

        <div className="border-t border-border pt-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12">
              <FiCode className="w-16 h-16 mx-auto text-border mb-4" />
              <p className="text-[#94A3B8] text-lg font-medium">No skills added yet</p>
              <p className="text-[#94A3B8] text-sm mt-1">Click "Add Skill" to get started</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
              {Object.entries(grouped).map(([category, catskills]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catskills.map((skill) => (
                      <motion.div key={skill._id} variants={item} className="flex items-center justify-between p-4 rounded-xl bg-[#0D0D1A] group">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{skill.name}</span>
                            <span className="text-xs font-semibold text-[#00E5FF]">{skill.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-[#00E5FF] rounded-full transition-all duration-700" style={{ width: `${Math.min(skill.percentage, 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
