import React from 'react';
import { X, Calendar, Loader2, Sparkles } from 'lucide-react';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formErrors,
  isSaving,
  isEditing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-lg mx-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl p-6 sm:p-7 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Design Landing Page UI"
              className={`w-full bg-slate-950/60 border rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-inner ${
                formErrors.title ? 'border-rose-500/80' : 'border-slate-800'
              }`}
            />
            {formErrors.title && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{formErrors.title}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add optional detailed notes or task requirements..."
              className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-inner resize-none"
            />
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Priority <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer shadow-inner"
              >
                <option value="Low" className="bg-slate-900 text-slate-200">Low Priority</option>
                <option value="Medium" className="bg-slate-900 text-slate-200">Medium Priority</option>
                <option value="High" className="bg-slate-900 text-slate-200">High Priority</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer shadow-inner"
              >
                <option value="Pending" className="bg-slate-900 text-slate-200">Pending</option>
                <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
                <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date with Custom & Native Visible Calendar Icon */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                style={{ colorScheme: 'dark' }}
                className={`w-full bg-slate-950/60 border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer shadow-inner ${
                  formErrors.due_date ? 'border-rose-500/80' : 'border-slate-800'
                }`}
              />
            </div>
            {formErrors.due_date && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{formErrors.due_date}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
