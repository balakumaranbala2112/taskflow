function Dashboard() {
  const stats = [
    {
      title: "Total Tasks",
      value: 24,
    },
    {
      title: "Completed",
      value: 12,
    },
    {
      title: "Pending",
      value: 8,
    },
    {
      title: "Overdue",
      value: 4,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Overview of your tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {stat.title}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;