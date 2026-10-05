import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  CheckSquare,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";

function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
            <CheckSquare className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Task<span className="text-blue-500">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" icon={ArrowRight}>
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-8 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Streamlined Productivity for Modern Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Master your workflow. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            Deliver on time, every time.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Organize, prioritize, and track your tasks effortlessly with real-time
          analytics, category tagging, and automated deadline tracking.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" variant="primary" icon={ArrowRight} className="shadow-lg shadow-blue-500/25">
              {isAuthenticated ? "Go to Dashboard" : "Start Free Today"}
            </Button>
          </Link>
          <Link to={isAuthenticated ? "/tasks" : "/login"}>
            <Button size="lg" variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700">
              {isAuthenticated ? "View Tasks" : "Sign In to Account"}
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Intelligent Tasks</h3>
            <p className="mt-2 text-sm text-slate-400">
              Categorize, prioritize, and search through your tasks in seconds with advanced filters.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Stats</h3>
            <p className="mt-2 text-sm text-slate-400">
              Gain actionable insights with automated breakdown of completion rates and overdue items.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Trash & Recovery</h3>
            <p className="mt-2 text-sm text-slate-400">
              Accidentally delete a task? Soft-delete trash lets you restore tasks whenever you need.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        TaskFlow © {new Date().getFullYear()} — Pair programming full-stack application
      </footer>
    </div>
  );
}

export default Home;