import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  RotateCcw,
  Pencil,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  searchTasks,
  getTrashTasks,
  createTask,
  updateTask,
  deleteTask,
  restoreTask,
} from "../../services/taskService";
import { getCategories } from "../../services/categoryService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import {
  StatusBadge,
  PriorityBadge,
  CategoryBadge,
} from "../../components/ui/Badge";

function Tasks() {
  const queryClient = useQueryClient();

  // Active Tab: 'active' | 'trash'
  const [activeTab, setActiveTab] = useState("active");

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    overdue: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 9,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Form State
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    category: "",
  });
  const [formError, setFormError] = useState("");

  // Queries
  const {
    data: activeTasksData,
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
  } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => searchTasks(filters),
    enabled: activeTab === "active",
  });

  const {
    data: trashTasksData,
    isLoading: isTrashLoading,
    isError: isTrashError,
    error: trashError,
  } = useQuery({
    queryKey: ["trashTasks", { page: filters.page, limit: filters.limit }],
    queryFn: () =>
      getTrashTasks({ page: filters.page, limit: filters.limit }),
    enabled: activeTab === "trash",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setIsCreateModalOpen(false);
      resetTaskForm();
    },
    onError: (err) => {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to create task"
      );
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => updateTask({ taskId, taskData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setEditingTask(null);
      resetTaskForm();
    },
    onError: (err) => {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to update task"
      );
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["trashTasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setDeletingTask(null);
    },
  });

  const restoreTaskMutation = useMutation({
    mutationFn: (taskId) => restoreTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["trashTasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      category: "",
    });
    setFormError("");
  };

  const handleOpenCreate = () => {
    resetTaskForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      category: task.category?._id || task.category || "",
    });
    setFormError("");
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      setFormError("Task title is required");
      return;
    }
    if (!taskForm.description.trim()) {
      setFormError("Task description is required");
      return;
    }

    const payload = {
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      status: taskForm.status,
      priority: taskForm.priority,
    };

    if (taskForm.dueDate) {
      payload.dueDate = new Date(taskForm.dueDate).toISOString();
    }
    if (taskForm.category) {
      payload.category = taskForm.category;
    }

    createTaskMutation.mutate(payload);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      setFormError("Task title is required");
      return;
    }
    if (!taskForm.description.trim()) {
      setFormError("Task description is required");
      return;
    }

    const payload = {
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      status: taskForm.status,
      priority: taskForm.priority,
      category: taskForm.category || null,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null,
    };

    updateTaskMutation.mutate({
      taskId: editingTask._id,
      taskData: payload,
    });
  };

  const handleQuickStatusChange = (task, newStatus) => {
    updateTaskMutation.mutate({
      taskId: task._id,
      taskData: { status: newStatus },
    });
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      category: "",
      overdue: "",
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      limit: 9,
    });
  };

  const currentData = activeTab === "active" ? activeTasksData : trashTasksData;
  const isLoading = activeTab === "active" ? isActiveLoading : isTrashLoading;
  const isError = activeTab === "active" ? isActiveError : isTrashError;
  const currentError = activeTab === "active" ? activeError : trashError;

  const tasksList = currentData?.tasks || [];
  const pagination = currentData?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.priority) ||
    Boolean(filters.category) ||
    Boolean(filters.overdue) ||
    filters.sortBy !== "createdAt" ||
    filters.order !== "desc";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Task Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, track, filter, and organize your day-to-day workflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            New Task
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveTab("active");
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === "active"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => {
              setActiveTab("trash");
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "trash"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Trash</span>
          </button>
        </div>

        {activeTab === "active" && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 pb-2 text-xs font-semibold ${
              showFilters || hasActiveFilters
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters {hasActiveFilters && "•"}</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar (Active tab) */}
      {activeTab === "active" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-xs"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: "", page: 1 }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-150">
              <Select
                label="Status"
                placeholder="All Statuses"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={[
                  { label: "To Do", value: "todo" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Completed", value: "completed" },
                ]}
              />

              <Select
                label="Priority"
                placeholder="All Priorities"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                options={[
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ]}
              />

              <Select
                label="Category"
                placeholder="All Categories"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                options={
                  categories?.map((c) => ({
                    label: c.name,
                    value: c._id,
                  })) || []
                }
              />

              <Select
                label="Sort By"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                placeholder=""
                options={[
                  { label: "Date Created", value: "createdAt" },
                  { label: "Due Date", value: "dueDate" },
                  { label: "Priority", value: "priority" },
                  { label: "Title", value: "title" },
                ]}
              />

              <div className="flex flex-col justify-end gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Overdue Only
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={filters.overdue}
                    onChange={(e) =>
                      handleFilterChange("overdue", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">All Deadlines</option>
                    <option value="true">Overdue Only</option>
                  </select>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs shrink-0"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load tasks: {currentError?.message || "Unknown error"}
        </div>
      )}

      {/* Tasks List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : tasksList.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xs">
          <EmptyState
            title={
              activeTab === "active"
                ? hasActiveFilters
                  ? "No matching tasks found"
                  : "No tasks yet"
                : "Trash is empty"
            }
            message={
              activeTab === "active"
                ? hasActiveFilters
                  ? "Try adjusting your search or filter options."
                  : "Create your first task to start organizing your workflow!"
                : "Deleted tasks will appear here. You can restore them anytime."
            }
          />
          {activeTab === "active" && !hasActiveFilters && (
            <div className="mt-6 text-center">
              <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
                Create First Task
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasksList.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div
                key={task._id}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  task.status === "completed"
                    ? "border-emerald-100 bg-emerald-50/10"
                    : overdue
                    ? "border-rose-200"
                    : "border-gray-100"
                }`}
              >
                <div>
                  {/* Top Bar: Category & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {task.category ? (
                        <CategoryBadge
                          name={task.category.name}
                          color={task.category.color}
                        />
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          General
                        </span>
                      )}
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <div className="flex items-center gap-1">
                      {activeTab === "active" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(task)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                            title="Edit Task"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTask(task)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Move to Trash"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={RotateCcw}
                          loading={restoreTaskMutation.isPending}
                          onClick={() => restoreTaskMutation.mutate(task._id)}
                          className="text-xs"
                        >
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-base font-bold text-gray-900 leading-snug ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="mt-2 text-xs text-gray-600 line-clamp-3 min-h-[36px]">
                    {task.description}
                  </p>
                </div>

                {/* Bottom Bar: Due Date, Status Selector */}
                <div className="mt-5 border-t border-gray-100 pt-3 flex items-center justify-between">
                  {task.dueDate ? (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        overdue
                          ? "text-rose-600 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {overdue ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : (
                        <Calendar className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {overdue && (
                        <span className="rounded bg-rose-100 px-1 py-0.2 text-[10px] uppercase text-rose-700">
                          Overdue
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>No due date</span>
                    </div>
                  )}

                  {activeTab === "active" ? (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleQuickStatusChange(task, e.target.value)
                      }
                      className={`rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-wider focus:outline-none ${
                        task.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : task.status === "in-progress"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <span className="text-[11px] text-rose-500 font-medium bg-rose-50 px-2 py-0.5 rounded">
                      In Trash
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            Showing page <span className="font-bold">{pagination.page}</span> of{" "}
            <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} total items)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={pagination.page <= 1}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetTaskForm();
        }}
        title="Create New Task"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Title"
            name="title"
            placeholder="e.g., Deploy to AWS Lambda"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm({ ...taskForm, title: e.target.value })
            }
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Outline task deliverables and details..."
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
            required
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm({ ...taskForm, status: e.target.value })
              }
              options={[
                { label: "To Do", value: "todo" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" },
              ]}
            />

            <Select
              label="Priority"
              name="priority"
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({ ...taskForm, priority: e.target.value })
              }
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({ ...taskForm, dueDate: e.target.value })
              }
            />

            <Select
              label="Category"
              name="category"
              placeholder="No Category"
              value={taskForm.category}
              onChange={(e) =>
                setTaskForm({ ...taskForm, category: e.target.value })
              }
              options={
                categories?.map((c) => ({
                  label: c.name,
                  value: c._id,
                })) || []
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={createTaskMutation.isPending}
            >
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => {
          setEditingTask(null);
          resetTaskForm();
        }}
        title="Edit Task"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Title"
            name="title"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm({ ...taskForm, title: e.target.value })
            }
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
            required
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm({ ...taskForm, status: e.target.value })
              }
              options={[
                { label: "To Do", value: "todo" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" },
              ]}
            />

            <Select
              label="Priority"
              name="priority"
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({ ...taskForm, priority: e.target.value })
              }
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({ ...taskForm, dueDate: e.target.value })
              }
            />

            <Select
              label="Category"
              name="category"
              placeholder="No Category"
              value={taskForm.category}
              onChange={(e) =>
                setTaskForm({ ...taskForm, category: e.target.value })
              }
              options={
                categories?.map((c) => ({
                  label: c.name,
                  value: c._id,
                })) || []
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={updateTaskMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete / Move to Trash Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        title="Move Task to Trash"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-sm font-medium">
              Move <span className="font-bold">"{deletingTask?.title}"</span> to trash?
            </p>
          </div>

          <p className="text-xs text-gray-500">
            This task will be moved to the Trash tab. You can restore it back anytime.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setDeletingTask(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteTaskMutation.isPending}
              onClick={() => deleteTaskMutation.mutate(deletingTask._id)}
            >
              Move to Trash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Tasks;