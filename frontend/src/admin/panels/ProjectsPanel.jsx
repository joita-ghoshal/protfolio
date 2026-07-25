import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiStar, FiImage, FiExternalLink, FiGithub } from 'react-icons/fi';
import { projectsAPI } from '../../services/api';

const defaultForm = { title: '', description: '', github_link: '', live_demo: '', technologies: '', featured: false, status: 'draft' };

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.get();
      setProjects(data?.projects || data?.data || data || []);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => { setForm(defaultForm); setEditing(null); setShowForm(false); setMsg(null); };

  const openEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      github_link: project.github_link || '',
      live_demo: project.live_demo || '',
      technologies: (project.technologies || []).join(', '),
      featured: project.featured || false,
      status: project.status || 'draft',
    });
    setEditing(project._id);
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    const payload = { ...form, technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean) };
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await projectsAPI.update(editing, payload);
        setMsg({ type: 'success', text: 'Project updated!' });
      } else {
        await projectsAPI.create(payload);
        setMsg({ type: 'success', text: 'Project created!' });
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save project' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setMsg({ type: 'success', text: 'Project deleted!' });
      fetchProjects();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete project' });
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      await projectsAPI.update(project._id, { featured: !project.featured });
      fetchProjects();
    } catch { /* empty */ }
  };

  const handleUploadThumbnail = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      await projectsAPI.uploadThumbnail(id, file);
      setMsg({ type: 'success', text: 'Thumbnail uploaded!' });
      fetchProjects();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload thumbnail' });
    }
  };

  const handleUploadImage = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      await projectsAPI.uploadImage(id, file);
      setMsg({ type: 'success', text: 'Image uploaded!' });
      fetchProjects();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload image' });
    }
  };

  const handleDeleteImage = async (projectId, imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await projectsAPI.deleteImage(projectId, imageId);
      fetchProjects();
    } catch { /* empty */ }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card p-8 md:p-10">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-white/[0.03] rounded" /><div className="h-20 w-full bg-white/[0.03] rounded" /><div className="h-20 w-full bg-white/[0.03] rounded" /></div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center"><FiFolder className="w-7 h-7 text-[#00E5FF]" /></div>
            <div><h2 className="text-2xl font-bold text-white">Projects</h2><p className="text-[#94A3B8] text-sm">Manage your portfolio projects</p></div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="premium-btn flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Project'}
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
                <label className="block text-sm font-medium text-white mb-1.5">Technologies (comma separated)</label>
                <input type="text" name="technologies" value={form.technologies} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">GitHub Link</label>
                <input type="url" name="github_link" value={form.github_link} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Live Demo</label>
                <input type="url" name="live_demo" value={form.live_demo} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-border text-[#00E5FF] focus:ring-[#00E5FF]" />
                  <span className="text-sm text-white">Featured</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="input-field">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={handleSave} disabled={saving} className="premium-btn flex items-center gap-2">
                <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
              </button>
              <button onClick={resetForm} className="premium-btn-outline flex items-center gap-2"><FiX className="w-4 h-4" /> Cancel</button>
            </div>
          </motion.div>
        )}

        {projects.length === 0 && !showForm ? (
          <div className="border-t border-border pt-8 text-center py-12">
            <FiFolder className="w-16 h-16 mx-auto text-border mb-4" />
            <p className="text-[#94A3B8] text-lg font-medium">No projects yet</p>
            <p className="text-[#94A3B8] text-sm mt-1">Click "Add Project" to create your first project</p>
          </div>
        ) : (
          <div className="border-t border-border pt-6">
            <motion.div variants={container} initial="hidden" animate="show" className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#94A3B8] text-sm border-b border-border">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Featured</th>
                    <th className="pb-3 font-medium">Images</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <motion.tr key={project._id} variants={item} className="border-b border-border/50 hover:bg-[#0D0D1A]/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          {project.thumbnail && <img src={project.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <span className="text-white font-medium">{project.title}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'published' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <button onClick={() => handleToggleFeatured(project)} className={`p-1.5 rounded-lg transition-colors ${project.featured ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 'text-[#94A3B8] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10'}`}>
                          <FiStar className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <label className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 cursor-pointer transition-colors">
                            <FiImage className="w-4 h-4" />
                            <input type="file" accept="image/*" onChange={(e) => handleUploadThumbnail(e, project._id)} className="hidden" />
                          </label>
                          <label className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 cursor-pointer transition-colors">
                            <FiPlus className="w-4 h-4" />
                            <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, project._id)} className="hidden" />
                          </label>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors"><FiGithub className="w-4 h-4" /></a>}
                          {project.live_demo && <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors"><FiExternalLink className="w-4 h-4" /></a>}
                          <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
