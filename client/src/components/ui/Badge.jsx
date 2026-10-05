export function StatusBadge({ status }) {
  const statusMap = {
    todo: {
      label: "To Do",
      classes: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    },
    "in-progress": {
      label: "In Progress",
      classes: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    completed: {
      label: "Completed",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
  };

  const current = statusMap[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${current.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const priorityMap = {
    low: {
      label: "Low",
      classes: "bg-sky-50 text-sky-700 border-sky-200",
    },
    medium: {
      label: "Medium",
      classes: "bg-orange-50 text-orange-700 border-orange-200",
    },
    high: {
      label: "High",
      classes: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const current = priorityMap[priority] || {
    label: priority,
    classes: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${current.classes}`}
    >
      {current.label}
    </span>
  );
}

export function CategoryBadge({ name, color = "#64748b" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color || "#64748b" }}
      />
      {name}
    </span>
  );
}
