export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-full max-w-sm animate-pulse rounded bg-muted" />
        <div className="mt-4 h-64 w-full animate-pulse rounded-lg border bg-muted/50" />
      </div>
    </main>
  );
}