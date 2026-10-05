function EmptyState({
    title = "No data found",
    message = "There is nothing to display.",
}) {
    return (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
                {title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                {message}
            </p>
        </div>
    );
}

export default EmptyState;