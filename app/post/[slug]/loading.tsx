export default function PostLoading() {
  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto max-w-4xl px-6 pt-12">
        {/* Header skeleton */}
        <header className="mb-12 text-center">
          <div className="mx-auto mb-4 h-4 w-24 animate-pulse rounded bg-gray-800" />
          <div className="mx-auto mb-2 h-9 w-3/4 max-w-xl animate-pulse rounded bg-gray-800 sm:h-10" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-800" />
        </header>

        {/* Glitch-style loading label (optional) */}
        <p className="mb-8 font-mono text-xs uppercase tracking-widest text-gray-500">
          <span className="glitch-layers inline-block" data-text="Loading data...">
            Loading data...
          </span>
        </p>

        {/* Paragraph lines skeleton */}
        <div className="space-y-6">
          <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-[90%] animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-[75%] animate-pulse rounded bg-gray-800" />
          <div className="mt-8 h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-[85%] animate-pulse rounded bg-gray-800" />
        </div>
      </main>
    </div>
  );
}
