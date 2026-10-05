import Button from "../../components/ui/Button";
import EmptyState from "../../components/common/EmptyState";

function Tasks() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage your tasks.
          </p>
        </div>

        <Button>Create Task</Button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <EmptyState
          title="No tasks yet"
          message="Create your first task to get started."
        />
      </div>
    </div>
  );
}

export default Tasks;