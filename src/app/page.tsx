import { LeadForm } from "@/components/lead-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Let&apos;s build something great together
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Tell us about your project and we&apos;ll get back to you within
            one business day.
          </p>
        </div>

        <LeadForm />
      </div>

      <footer className="border-t mt-16">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center text-sm text-muted-foreground">
          Built for{" "}<a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Digital Heroes Training Task</a>
        </div>
      </footer>
    </main>
  );
}
