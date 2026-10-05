import { Link } from "react-router-dom";
import { AlertCircle, Home as HomeIcon } from "lucide-react";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
      <h2 className="mt-2 text-xl font-bold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-sm text-gray-600 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" icon={HomeIcon}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
