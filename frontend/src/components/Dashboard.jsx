import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CheckSquare,
  LogOut,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  PieChart as PieChartIcon,
  BarChart3,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  // Analytics Toggle State
  const [showCharts, setShowCharts] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null for create, task object for edit

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: new Date().toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation State
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  /**
   * Fetch Dashboard Stats
   */
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  /**
   * Fetch Tasks with Search, Filter & Sort
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sortBy) params.sort = sortBy;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy]);

  // Initial load and auto refresh on filter change
  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks]);

  /**
   * Form Validation
   */
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.priority) {
      errors.priority = 'Priority is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.due_date);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.due_date = 'Due date cannot be earlier than today';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Open Modal for Create or Edit
   */
  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        due_date: new Date().toISOString().split('T')[0],
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  /**
   * Handle Create / Update Task Submit
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingTask) {
        // Update
        await api.put(`/tasks/${editingTask.id}`, formData);
        toast.success('Task updated successfully');
      } else {
        // Create
        await api.post('/tasks', formData);
        toast.success('Task created successfully');
      }

      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Save error:', err);
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors)) {
        toast.error(apiErrors.join(', '));
      } else {
        toast.error(err.response?.data?.error || 'Failed to save task');
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete Task
   */
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      setDeletingTaskId(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete task');
    }
  };

  /**
   * Helper: Check if task is overdue
   */
  const isOverdue = (dueDate, status) => {
    if (status === 'Completed') return false;
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Data for Charts
  const statusChartData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ];

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      if (task.priority === 'Low') acc.Low += 1;
      else if (task.priority === 'Medium') acc.Medium += 1;
      else if (task.priority === 'High') acc.High += 1;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0 }
  );

  const priorityChartData = [
    { priority: 'Low', count: priorityCounts.Low },
    { priority: 'Medium', count: priorityCounts.Medium },
    { priority: 'High', count: priorityCounts.High },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Blur Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 shadow-inner">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Task Manager
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h1>
              <p className="text-xs text-slate-400">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-slate-300 font-medium bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700/80 shadow-sm">
              {user?.email || 'admin@test.com'}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 bg-slate-800/90 hover:bg-rose-500/10 border border-slate-700/80 hover:border-rose-500/30 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Enhanced Statistics Cards with Subtle Left Gradient Glow */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              Overview Statistics
            </h2>
            {/* Analytics Toggle Button */}
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/80 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm hover:border-slate-600"
            >
              {showCharts ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hide Analytics</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Show Analytics</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Total Tasks Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.12)] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Tasks</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <ListTodo className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white tracking-tight">{stats.total}</span>
              </div>
            </div>

            {/* Pending Tasks Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.12)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500" />
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{stats.pending}</span>
              </div>
            </div>

            {/* In Progress Tasks Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.12)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-500" />
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Loader2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-blue-400 tracking-tight">{stats.inProgress}</span>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500" />
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.completed}</span>
              </div>
            </div>

            {/* Overdue Tasks Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.12)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] group col-span-2 md:col-span-1">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-red-600" />
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Overdue</span>
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.overdue}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Charts Section (Conditionally Rendered) */}
        {showCharts && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
            {/* Donut Chart: Task Status Breakdown */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <PieChartIcon className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-base text-white tracking-wide">Task Status Breakdown</h2>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#475569',
                        borderRadius: '12px',
                        color: '#ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                      }}
                      itemStyle={{ color: '#ffffff' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Priority Distribution */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-base text-white tracking-wide">Priority Distribution</h2>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="priority" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#475569',
                        borderRadius: '12px',
                        color: '#ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                      }}
                      itemStyle={{ color: '#ffffff' }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* ── Controls Bar: Search, Filter, Sort, Add Task (Enhanced Mobile-Only Layout) ── */}
        <section className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters & Sorting Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-2 md:gap-3 w-full md:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner w-full md:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900 text-slate-300">All Statuses</option>
                  <option value="Pending" className="bg-slate-900 text-slate-300">Pending</option>
                  <option value="In Progress" className="bg-slate-900 text-slate-300">In Progress</option>
                  <option value="Completed" className="bg-slate-900 text-slate-300">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner w-full md:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer w-full"
                >
                  <option value="" className="bg-slate-900 text-slate-300">All Priorities</option>
                  <option value="Low" className="bg-slate-900 text-slate-300">Low</option>
                  <option value="Medium" className="bg-slate-900 text-slate-300">Medium</option>
                  <option value="High" className="bg-slate-900 text-slate-300">High</option>
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner w-full md:w-auto col-span-2 sm:col-span-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer w-full"
                >
                  <option value="newest" className="bg-slate-900 text-slate-300">Newest Created</option>
                  <option value="oldest" className="bg-slate-900 text-slate-300">Oldest Created</option>
                  <option value="due_date" className="bg-slate-900 text-slate-300">Due Date</option>
                </select>
              </div>

              {/* Create Task Button */}
              <button
                onClick={() => handleOpenModal()}
                className="w-full md:w-auto justify-center md:ml-auto col-span-2 sm:col-span-3 md:col-span-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </section>

        {/* Task Grid List */}
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
              <p className="text-sm font-medium">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-2xl p-12 text-center">
              <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No tasks found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {search || statusFilter || priorityFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first task above.'}
              </p>
              {!search && !statusFilter && !priorityFilter && (
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => {
                const overdue = isOverdue(task.due_date, task.status);

                return (
                  <div
                    key={task.id}
                    className={`bg-slate-900/90 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                      overdue
                        ? 'border-rose-500/40 bg-rose-950/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                        : 'border-slate-800/80 hover:border-indigo-500/40 shadow-xl shadow-black/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              task.priority === 'High'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>

                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : task.status === 'In Progress'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {task.status}
                          </span>

                          {overdue && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(task)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTaskId(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-white mb-1.5 leading-snug">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal Dialog: Create / Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title..."
                  className={`w-full bg-slate-950 border rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    formErrors.title ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task details (optional)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Priority <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Status <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Due Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer ${
                    formErrors.due_date ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {formErrors.due_date && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.due_date}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Delete Confirmation */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete Task?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(deletingTaskId)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
