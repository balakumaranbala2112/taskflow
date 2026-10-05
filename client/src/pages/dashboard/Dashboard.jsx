import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  CheckCircle,
} from "lucide-react";
import { getDashboardStats } from "../../services/dashboardService";
import { getTasks, createTask, updateTask } from "../../services/taskService";
import { getCategories } from "../../services/categoryService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";

function Dashboard() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: recentTasksData, isLoading: isRecentTasksLoading } = useQuery({
    queryKey: ["recentTasks"],
    queryFn: () => getTasks({ limit: 5 }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentTasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreateModalOpen(false);
      setTaskForm({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        category: "",
      });
      setFormError("");
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
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentTasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreateTask = (e) => {
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

  const handleToggleTaskStatus = (task) => {
    const nextStatus = task.status === "completed" ? "todo" : "completed";
    updateTaskMutation.mutate({
      taskId: task._id,
      taskData: { status: nextStatus },
    });
  };

  if (isStatsLoading) {
    return <LoadingSpinner />;
  }

  if (isStatsError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <h3 className="font-bold text-lg">Unable to load dashboard</h3>
        <p className="mt-1 text-sm">Please check your network and try refreshing.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchStats()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const summary = stats?.summary || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  };

  const completionRate = summary.totalTasks > 0
    ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
    : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: summary.totalTasks,
      icon: Layers,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All active tasks created",
    },
    {
      title: "Completed",
      value: summary.completedTasks,
      icon: CheckCircle2,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: `${completionRate}% overall completion`,
    },
    {
      title: "In Progress / Pending",
      value: summary.pendingTasks,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Tasks awaiting completion",
    },
    {
      title: "Overdue",
      value: summary.overdueTasks,
      icon: AlertTriangle,
      color: "from-rose-600 to-red-600",
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
      description: summary.overdueTasks > 0 ? "Requires urgent attention" : "All deadlines on track",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{user?.name || "there"}</span>! Here is a summary of your active workflow.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-sm"
        >
          New Task
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {card.title}
                </p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {card.value}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-gray-500">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Visual Breakdowns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress & Status Breakdown */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Tasks by Status
              </h3>
              <span className="text-xs font-semibold text-gray-500">
                {summary.totalTasks} total
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                  <span>Completion Rate</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2.5 pt-2">
                {["todo", "in-progress", "completed"].map((st) => {
                  const item = stats?.tasksByStatus?.find((x) => x._id === st);
                  const count = item ? item.count : 0;
                  const pct = summary.totalTasks > 0 ? Math.round((count / summary.totalTasks) * 100) : 0;
                  return (
                    <div key={st} className="flex items-center justify-between text-sm">
                      <StatusBadge status={st} />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Tasks by Priority
              </h3>
            </div>

            <div className="mt-6 space-y-3">
              {["high", "medium", "low"].map((pr) => {
                const item = stats?.tasksByPriority?.find((x) => x._id === pr);
                const count = item ? item.count : 0;
                return (
                  <div
                    key={pr}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3 bg-gray-50/50"
                  >
                    <PriorityBadge priority={pr} />
                    <span className="text-sm font-extrabold text-gray-900">
                      {count} {count === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tasks by Category */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-500" />
                Tasks by Category
              </h3>
              <Link
                to="/categories"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="mt-6 space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {stats?.tasksByCategory?.length > 0 ? (
                stats.tasksByCategory.map((cat, idx) => (
                  <div
                    key={cat.category || idx}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="font-medium text-gray-700 truncate max-w-[160px]">
                      {cat.categoryName}
                    </span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                      {cat.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 py-4 text-center">
                  No category assignments yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Recent Tasks</h3>
            <p className="text-xs text-gray-500">Your most recently created action items</p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>View All Tasks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4">
          {isRecentTasksLoading ? (
            <LoadingSpinner />
          ) : recentTasksData?.tasks?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentTasksData.tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-slate-50/50 px-2 rounded-xl transition"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task)}
                      className={`mt-0.5 rounded-md p-1 transition ${
                        task.status === "completed"
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title={task.status === "completed" ? "Mark as Incomplete" : "Mark as Completed"}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-semibold text-gray-900 ${
                          task.status === "completed" ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {task.category && (
                      <CategoryBadge
                        name={task.category.name}
                        color={task.category.color}
                      />
                    )}
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks created yet"
              message="Click 'New Task' to get your first task added!"
            />
          )}
        </div>
      </div>

      {/* Quick Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Task Title"
            name="title"
            placeholder="e.g., Design UI prototype"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Provide task details and acceptance criteria..."
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
              value={taskForm.category}
              onChange={(e) =>
                setTaskForm({ ...taskForm, category: e.target.value })
              }
              placeholder="No Category"
              options={
                categories?.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
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
    </div>
  );
}

export default Dashboard;