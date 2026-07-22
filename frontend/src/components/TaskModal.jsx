import React from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mongo-brand-teal-deep/80 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg mx-4 bg-mongo-canvas border border-mongo-hairline shadow-level-4 rounded-mongo-lg p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-6">
          <h2 className="mongo-heading-3 text-mongo-ink">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-mongo-slate hover:text-mongo-ink transition-colors rounded-mongo-pill"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block mongo-caption-bold text-mongo-ink mb-2">
              Title <span className="text-mongo-semantic-warning-text">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Design Landing Page UI"
              className={`w-full bg-mongo-canvas border rounded-mongo-md py-[10px] px-4 mongo-body-md text-mongo-ink placeholder:text-mongo-slate focus:outline-none focus:border-mongo-brand-green-dark transition-colors ${
                formErrors.title ? 'border-[#E61763]' : 'border-mongo-hairline-strong'
              }`}
            />
            {formErrors.title && <p className="mongo-body-sm text-[#E61763] mt-1.5">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block mongo-caption-bold text-mongo-ink mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add detailed notes..."
              className="w-full bg-mongo-canvas border border-mongo-hairline-strong text-mongo-ink rounded-mongo-md py-[10px] px-4 mongo-body-md placeholder:text-mongo-slate focus:outline-none focus:border-mongo-brand-green-dark transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mongo-caption-bold text-mongo-ink mb-2">
                Priority <span className="text-mongo-semantic-warning-text">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-mongo-canvas border border-mongo-hairline-strong text-mongo-ink rounded-mongo-md py-[10px] px-4 mongo-body-md focus:outline-none focus:border-mongo-brand-green-dark transition-colors cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block mongo-caption-bold text-mongo-ink mb-2">
                Status <span className="text-mongo-semantic-warning-text">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-mongo-canvas border border-mongo-hairline-strong text-mongo-ink rounded-mongo-md py-[10px] px-4 mongo-body-md focus:outline-none focus:border-mongo-brand-green-dark transition-colors cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mongo-caption-bold text-mongo-ink mb-2">
              Due Date <span className="text-mongo-semantic-warning-text">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-mongo-steel pointer-events-none z-10" />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className={`w-full bg-mongo-canvas border rounded-mongo-md py-[10px] pl-[44px] pr-4 mongo-body-md text-mongo-ink focus:outline-none focus:border-mongo-brand-green-dark transition-colors cursor-pointer ${
                  formErrors.due_date ? 'border-[#E61763]' : 'border-mongo-hairline-strong'
                }`}
              />
            </div>
            {formErrors.due_date && <p className="mongo-body-sm text-[#E61763] mt-1.5">{formErrors.due_date}</p>}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 mt-6 border-t border-mongo-hairline-soft">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto text-mongo-ink mongo-button-md bg-transparent border border-mongo-hairline-strong hover:bg-mongo-surface-soft rounded-mongo-pill px-[22px] py-[10px] transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto bg-mongo-brand-green text-mongo-brand-teal-deep mongo-button-md rounded-mongo-pill py-[10px] px-[22px] mongo-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
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
