import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiEye, FiCalendar, FiTrendingUp, FiGlobe, FiClock } from 'react-icons/fi';
import { analyticsAPI } from '../../services/api';

export default function AnalyticsPanel() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSummary(); }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await analyticsAPI.summary();
      setSummary(data?.summary || data?.data || data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const statCards = [
    { label: 'Total Visitors', value: summary?.totalVisitors ?? summary?.total_visitors ?? '—', icon: FiUsers, color: 'text-blue-600 bg-blue-100' },
    { label: 'Total Views', value: summary?.totalViews ?? summary?.total_views ?? '—', icon: FiEye, color: 'text-green-600 bg-green-100' },
    { label: "Today's Visitors", value: summary?.todayVisitors ?? summary?.today_visitors ?? '—', icon: FiCalendar, color: 'text-amber-600 bg-amber-100' },
    { label: 'Weekly Visitors', value: summary?.weeklyVisitors ?? summary?.weekly_visitors ?? '—', icon: FiTrendingUp, color: 'text-purple-600 bg-purple-100' },
    { label: 'Monthly Visitors', value: summary?.monthlyVisitors ?? summary?.monthly_visitors ?? '—', icon: FiGlobe, color: 'text-cyan-600 bg-cyan-100' },
    { label: 'Most Viewed Page', value: summary?.mostViewedPage ?? summary?.most_viewed_page ?? '—', icon: FiBarChart2, color: 'text-rose-600 bg-rose-100' },
  ];

  const visitors = summary?.recentVisitors ?? summary?.recent_visitors ?? [];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card p-8 md:p-10">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="grid grid-cols-3 gap-4"><div className="h-24 bg-gray-200 rounded" /><div className="h-24 bg-gray-200 rounded" /><div className="h-24 bg-gray-200 rounded" /></div></div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiBarChart2 className="w-7 h-7 text-primary" /></div>
          <div><h2 className="text-2xl font-bold text-primary-text">Analytics</h2><p className="text-secondary-text text-sm">Track your portfolio performance</p></div>
        </div>

        {!summary ? (
          <div className="border-t border-border pt-8 text-center py-12">
            <FiBarChart2 className="w-16 h-16 mx-auto text-border mb-4" />
            <p className="text-secondary-text text-lg font-medium">No analytics data yet</p>
            <p className="text-secondary-text text-sm mt-1">Data will appear once visitors start coming to your portfolio</p>
          </div>
        ) : (
          <>
            <div className="border-t border-border pt-8">
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                  <motion.div key={stat.label} variants={item} className="flex items-center gap-4 p-5 rounded-xl bg-secondary-bg">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-text">{stat.value}</p>
                      <p className="text-secondary-text text-sm">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {visitors.length > 0 && (
              <div className="border-t border-border pt-8 mt-8">
                <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-primary" /> Recent Visitors
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-secondary-text text-sm border-b border-border">
                        <th className="pb-3 font-medium">IP Address</th>
                        <th className="pb-3 font-medium">Page</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((v, i) => (
                        <motion.tr key={v._id || i} variants={item} initial="hidden" animate="show" className="border-b border-border/50 hover:bg-secondary-bg/50 transition-colors">
                          <td className="py-3 pr-4 text-sm text-primary-text font-mono">{v.ip || v.ip_address || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-primary-text">{v.page || v.url || '—'}</td>
                          <td className="py-3 text-sm text-secondary-text">{v.date || v.createdAt ? new Date(v.date || v.createdAt).toLocaleString() : '—'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
