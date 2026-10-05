import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import LoadingSpinner from "./components/common/LoadingSpinner";
import EmptyState from "./components/common/EmptyState";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">
        TaskFlow Components
      </h1>

      <div className="max-w-md space-y-6 rounded-xl bg-white p-6 shadow">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
        />

        <div className="flex gap-3">
          <Button>Save</Button>

          <Button variant="secondary">
            Cancel
          </Button>

          <Button variant="danger">
            Delete
          </Button>
        </div>

        <LoadingSpinner />

        <EmptyState
          title="No tasks"
          message="Create your first task."
        />
      </div>
    </div>
  );
}

export default App;