import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import TaskModal from './TaskModal';
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
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

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
    { name: 'In Progress', value: stats.inProgress, color: '#006DCA' },
    { name: 'Completed', value: stats.completed, color: '#00ED64' },
    { name: 'Overdue', value: stats.overdue, color: '#E61763' },
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
    <div className="min-h-screen bg-mongo-surface text-mongo-ink">
      
      {/* Top Nav - Always Dark */}
      <div className="bg-mongo-brand-teal-deep text-mongo-on-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <header className="mobile-header flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-mongo-brand-green" strokeWidth={2.5} />
              <span className="mongo-heading-4 tracking-tight">Task Manager</span>
            </div>
            
            <div className="mobile-header-actions flex items-center gap-6">
              <span className="hidden sm:inline-block mongo-body-sm-medium opacity-70">
                {user?.email || 'admin@test.com'}
              </span>
              <button
                onClick={toggleTheme}
                className="opacity-70 hover:opacity-100 transition-opacity"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="mongo-body-sm-medium hover:text-mongo-brand-green transition-colors"
              >
                Sign Out
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* MongoDB Hero Band - Now includes Overview & Charts */}
      <div className={`overview-container pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out flex flex-col ${showCharts ? 'min-h-[calc(100vh-64px)] pb-12' : 'pb-8'}`}>
        <div className="max-w-[1280px] mx-auto w-full">

          {/* Statistics Cards & Charts (Inside Hero) */}
          <section className="mt-8 space-y-4">
            <div className="mobile-overview-header flex items-center justify-between">
              <h2 className="mongo-heading-2">Overview</h2>
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="bg-mongo-brand-green-dark text-white hover:bg-[#00523b] mongo-button-md rounded-mongo-pill px-[22px] py-[10px] transition-colors flex items-center gap-2 shadow-sm"
              >
                {showCharts ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Hide Analytics</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Show Analytics</span>
                  </>
                )}
              </button>
            </div>

            <div className="mobile-stats-grid grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Tasks', value: stats.total, icon: ListTodo },
                { label: 'Pending', value: stats.pending, icon: Clock },
                { label: 'In Progress', value: stats.inProgress, icon: Loader2 },
                { label: 'Completed', value: stats.completed, icon: CheckCircle2 },
                { label: 'Overdue', value: stats.overdue, icon: AlertTriangle },
              ].map((stat, i) => (
                <div key={i} className="mobile-stat-card overview-stat-card rounded-mongo-md px-4 py-3 flex flex-col justify-between hover:opacity-90 transition-opacity duration-200">
                  <div className="flex items-center justify-between mb-2 opacity-70">
                    <span className="mongo-caption-bold">{stat.label}</span>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="mongo-heading-3">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            {showCharts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 pt-2">
                <div className="overview-chart-card rounded-mongo-md px-4 py-6 flex flex-col justify-between transition-colors duration-200">
                  <h3 className="mongo-caption-bold opacity-80 mb-4 text-center">Task Status Breakdown</h3>
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-mongo-canvas)', borderColor: 'var(--color-mongo-hairline-strong)', borderRadius: '8px', color: 'var(--color-mongo-ink)' }} itemStyle={{ color: 'var(--color-mongo-ink)' }} />
                        <Legend verticalAlign="bottom" height={24} formatter={(value) => <span className="mongo-caption-bold opacity-80">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="overview-chart-card rounded-mongo-md px-4 py-6 flex flex-col justify-between transition-colors duration-200">
                  <h3 className="mongo-caption-bold opacity-80 mb-4 text-center">Priority Distribution</h3>
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="priority" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }} opacity={0.5} />
                        <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }} opacity={0.5} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-mongo-canvas)', borderColor: 'var(--color-mongo-hairline-strong)', borderRadius: '8px', color: 'var(--color-mongo-ink)' }} itemStyle={{ color: 'var(--color-mongo-ink)' }} cursor={{fill: 'var(--color-mongo-hairline)'}} />
                        <Bar dataKey="count" fill="var(--color-mongo-brand-teal)" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Main Container - Tasks List */}
      <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-3">
        {/* Filters and List */}
        <section className="space-y-6">
          <div className="tasks-toolbar-container flex flex-wrap items-center justify-between gap-4">
             <h2 className="tasks-title mongo-heading-2 shrink-0">Tasks</h2>
             
             {/* Controls */}
             <div className="tasks-controls-container flex flex-wrap items-center gap-3">
               <button
                 onClick={() => handleOpenModal()}
                 className="create-task-btn bg-mongo-brand-green-dark text-white h-[40px] rounded-mongo-md px-4 mongo-body-sm-medium hover:bg-[#00523b] transition-colors flex items-center justify-center gap-2 shadow-sm"
               >
                 <span>Create Task</span>
                 <Plus className="w-4 h-4" />
               </button>

               <div className="search-container relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mongo-steel" />
                 <input
                   type="text"
                   placeholder="Search tasks"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-[200px] sm:w-[240px] h-[40px] bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md pl-9 pr-8 mongo-body-sm text-mongo-ink placeholder:text-mongo-steel focus:outline-none focus:border-mongo-brand-green transition-colors shadow-none"
                 />
                 {search && (
                   <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mongo-steel hover:text-mongo-ink flex items-center justify-center">
                     <X className="w-4 h-4" />
                   </button>
                 )}
               </div>

               <div className="filters-container flex flex-wrap items-center gap-3">
                 <select
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="h-[40px] bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md px-3 pr-8 mongo-body-sm text-mongo-ink focus:outline-none focus:border-mongo-brand-green cursor-pointer shadow-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23657376%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                 >
                   <option value="">All Statuses</option>
                   <option value="Pending">Pending</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Completed">Completed</option>
                 </select>

                 <select
                   value={priorityFilter}
                   onChange={(e) => setPriorityFilter(e.target.value)}
                   className="h-[40px] bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md px-3 pr-8 mongo-body-sm text-mongo-ink focus:outline-none focus:border-mongo-brand-green cursor-pointer shadow-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23657376%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                 >
                   <option value="">All Priorities</option>
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                 </select>

                 <select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="h-[40px] bg-mongo-canvas border border-mongo-hairline-strong rounded-mongo-md px-3 pr-8 mongo-body-sm text-mongo-ink focus:outline-none focus:border-mongo-brand-green cursor-pointer shadow-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23657376%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                 >
                   <option value="newest">Newest</option>
                   <option value="oldest">Oldest</option>
                   <option value="due_date">Due Date</option>
                 </select>
               </div>
             </div>
          </div>

          {/* Task Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-mongo-slate">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-mongo-brand-green-dark" />
              <p className="mongo-body-sm-medium">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-mongo-canvas border border-mongo-hairline rounded-mongo-lg p-16 text-center shadow-level-1">
              <ListTodo className="w-12 h-12 text-mongo-muted mx-auto mb-4" />
              <h3 className="mongo-heading-5 text-mongo-ink">No tasks found</h3>
              <p className="mongo-body-md text-mongo-slate mt-2 max-w-md mx-auto">
                {search || statusFilter || priorityFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first task.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => {
                const overdue = isOverdue(task.due_date, task.status);

                return (
                  <div
                    key={task.id}
                    className="bg-mongo-canvas border border-mongo-hairline rounded-mongo-lg px-4 py-3 flex flex-col justify-between hover:shadow-level-2 transition-shadow duration-200"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                           {/* Status Tag */}
                           <span className={`text-[11px] font-semibold rounded-mongo-xs px-[6px] py-[2px] ${
                              task.status === 'Completed' ? 'bg-mongo-brand-green-soft text-mongo-brand-green-dark' :
                              task.status === 'In Progress' ? 'bg-mongo-accent-blue text-mongo-on-dark' :
                              'bg-mongo-surface-soft text-mongo-slate border border-mongo-hairline'
                           }`}>
                             {task.status}
                           </span>
                           {/* Priority Tag */}
                           <span className={`text-[11px] font-semibold rounded-mongo-xs px-[6px] py-[2px] ${
                              task.priority === 'High' ? 'bg-mongo-accent-orange text-mongo-on-dark' :
                              task.priority === 'Medium' ? 'bg-mongo-accent-purple text-mongo-on-dark' :
                              'bg-mongo-surface-soft text-mongo-slate border border-mongo-hairline'
                           }`}>
                             {task.priority}
                           </span>
                           {overdue && (
                             <span className="text-[11px] font-semibold rounded-mongo-xs px-[6px] py-[2px] bg-mongo-semantic-warning-bg text-mongo-semantic-warning-text">
                               Overdue
                             </span>
                           )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenModal(task)} className="text-mongo-steel hover:text-mongo-brand-green-dark transition-colors p-1">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeletingTaskId(task.id)} className="text-mongo-steel hover:text-mongo-accent-pink transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-[15px] font-semibold text-mongo-ink mb-1 line-clamp-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-[13px] text-mongo-charcoal line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-mongo-hairline-soft flex items-center justify-between text-[12px] text-mongo-slate mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-mongo-slate" />
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        isSaving={isSaving}
        isEditing={!!editingTask}
      />

      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mongo-brand-teal-deep/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-mongo-canvas border border-mongo-hairline rounded-mongo-lg p-8 text-center shadow-level-4">
            <h3 className="mongo-heading-4 text-mongo-ink mb-2">Delete Task?</h3>
            <p className="mongo-body-md text-mongo-charcoal mb-8">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDeleteTask(deletingTaskId)}
                className="w-full bg-[#E61763] hover:bg-[#C21151] text-white mongo-button-md rounded-mongo-pill py-[10px] transition-colors"
              >
                Delete Task
              </button>
              <button
                onClick={() => setDeletingTaskId(null)}
                className="w-full bg-transparent border border-mongo-hairline-strong text-mongo-ink hover:bg-mongo-surface-soft mongo-button-md rounded-mongo-pill py-[10px] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
