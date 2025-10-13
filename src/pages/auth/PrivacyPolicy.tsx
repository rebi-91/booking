import { ShieldCheck, MapPin, Mail, CalendarDays, BookOpen } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-900">
      {/* Page container */}
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* Hero / Header */}
        <header className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-900 p-8 shadow-2xl ring-1 ring-black/10 md:p-12">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 grid items-start gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight  sm:text-4xl">
                Privacy Policy — Coleshill Pharmacy App
              </h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <CalendarDays className="h-4 w-4" />
                Last updated: <span className="font-medium">October 2025</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                GDPR-aligned
              </div>
              <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-200">
                <BookOpen className="h-4 w-4 text-sky-600" />
                Clear & Transparent
              </div>
            </div>
          </div>

          {/* Quick nav */}
          <nav className="relative z-10 mt-6">
            <ul className="flex flex-wrap gap-2 text-sm">
              {[
                { href: "#info-we-collect", label: "1. Information We Collect" },
                { href: "#how-we-use", label: "2. How We Use Information" },
                { href: "#storage-security", label: "3. Data Storage & Security" },
                { href: "#third-parties", label: "4. Third‑Party Services" },
                { href: "#your-rights", label: "5. Your Rights" },
                { href: "#contact", label: "6. Contact Us" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-slate-100 shadow-sm transition hover:border-slate-600 hover:bg-slate-800"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Content card */}
        <article className="prose relative mt-10 max-w-none rounded-3xl border border-slate-800/40 bg-white p-6 text-black shadow-xl md:p-10">
          {/* 1. Information We Collect */}
          <section id="info-we-collect" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">1. Information We Collect</h2>
            <p className="mt-3">We may collect the following types of information:</p>
            <ul className="mt-3 list-disc pl-6">
              <li>
                <span className="font-medium">Personal details</span> you provide when booking an appointment (e.g., name, contact information, and chosen service).
              </li>
              <li>
                <span className="font-medium">Device information</span>, such as operating system and app version, to improve app performance.
              </li>
              <li>
                <span className="font-medium">Location data</span>, if you grant permission, used only to show the nearest pharmacy or service.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-slate-200" />

          {/* 2. How We Use Your Information */}
          <section id="how-we-use" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="mt-3">Your information is used to:</p>
            <ul className="mt-3 list-disc pl-6">
              <li>Schedule and manage pharmacy appointments.</li>
              <li>Provide you with updates about booked services.</li>
              <li>Improve the app experience and our services.</li>
            </ul>
            <div className="mt-4 rounded-xl border border-emerald-300/60 bg-emerald-50 p-4 text-sm text-emerald-900">
              We <span className="font-semibold">do not sell or share</span> your information with third parties for marketing purposes.
            </div>
          </section>

          <hr className="my-8 border-slate-200" />

          {/* 3. Data Storage and Security */}
          <section id="storage-security" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">3. Data Storage and Security</h2>
            <p className="mt-3">
              All data is securely stored and processed in accordance with applicable data protection laws, including the UK GDPR. Access is
              restricted to authorized staff only.
            </p>
          </section>

          <hr className="my-8 border-slate-200" />

          {/* 4. Third-Party Services */}
          <section id="third-parties" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">4. Third-Party Services</h2>
            <p className="mt-3">
              The app may use third-party services (such as Supabase or Expo) to provide functionality. These services may collect limited
              information in accordance with their own privacy policies.
            </p>
          </section>

          <hr className="my-8 border-slate-200" />

          {/* 5. Your Rights */}
          <section id="your-rights" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">5. Your Rights</h2>
            <p className="mt-3">
              You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us using the
              information below.
            </p>
          </section>

          <hr className="my-8 border-slate-200" />

          {/* 6. Contact Us */}
          <section id="contact" className="scroll-mt-28">
            <h2 className="not-prose text-2xl font-semibold">6. Contact Us</h2>
            <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-black md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-slate-600" />
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <a href="mailto:info@coleshillpharmacy.co.uk" className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500">
                    info@coleshillpharmacy.co.uk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-slate-600" />
                <div>
                  <div className="text-sm text-slate-500">Address</div>
                  <div className="font-medium text-slate-800">Coleshill, United Kingdom</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-slate-600" />
                <div>
                  <div className="text-sm text-slate-500">Compliance</div>
                  <div className="font-medium text-slate-800">Aligned with UK GDPR</div>
                </div>
              </div>
            </div>
          </section>
        </article>

        <footer className="mx-auto mt-8 max-w-5xl text-center text-xs text-slate-300">
          © {new Date().getFullYear()} Coleshill Pharmacy. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
