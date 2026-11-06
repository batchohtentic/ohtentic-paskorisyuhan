import Link from "next/link";
import { Parol } from "@/components/Parol";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-6 text-center">
      <div>
        <Parol className="mx-auto h-28 w-20 text-gold-400" />
        <h1 className="mt-6 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-ink-soft">This page may have moved, or isn&rsquo;t published yet.</p>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </main>
  );
}
