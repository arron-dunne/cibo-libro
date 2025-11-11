import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/app/components/footer/Footer";

export default function TermsPage() {
  return (
    <>
      <main className="mt-4 mb-8 sm:mt-10 mx-auto max-w-3xl px-4">

        <div className="w-full h-min flex justify-center px-8">
          <Link href="/">
            <Image className="max-w-xs" width={573} height={129} src="/images/logo.png" alt="Cibo Libro logo" />
          </Link>
        </div>

        <article className="w-full mt-8 px-6 py-8 text-orange-950 bg-white rounded-2xl shadow-2xl prose prose-orange prose-headings:font-semibold prose-headings:text-orange-900 max-w-none">

          <h1 className="text-center text-4xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-center text-sm text-orange-700 border-t pt-2">
            Last updated: November 2025
          </p>

          <p>
            This Privacy Policy explains how Cibo Libro Ltd (“we,” “us,” or
            “our”) collects, uses, and protects your personal data.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            Cibo Libro Ltd, registered in England & Wales (Company No. [TBD]),
            Registered Office: [Registered Office Address, UK]. Email:{" "}
            <a href="mailto:privacy@cibolibro.com">privacy@cibolibro.com</a>.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect only what’s needed to provide and improve Cibo Libro:</p>
          <ul>
            <li>
              <strong>Account data</strong> — email, password hash (to create your
              account)
            </li>
            <li>
              <strong>Recipe data</strong> — titles, ingredients, steps, tags,
              images
            </li>
            <li>
              <strong>Device & usage data</strong> — browser type, region,
              interactions
            </li>
            <li>
              <strong>Analytics</strong> — anonymized event tracking
            </li>
          </ul>
          <p>We do not sell personal data or use it for advertising.</p>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>Operate and improve the Service</li>
            <li>Authenticate and secure your account</li>
            <li>Respond to support requests</li>
            <li>Comply with legal obligations (e.g., DMCA)</li>
            <li>Analyze usage (aggregated & anonymized)</li>
          </ul>

          <h2>4. Data Storage & Security</h2>
          <ul>
            <li>Hosted on Vercel, Neon Postgres, and Cloudflare R2</li>
            <li>All connections encrypted (HTTPS/TLS)</li>
            <li>Passwords hashed securely</li>
            <li>Access limited to authorized personnel</li>
          </ul>

          <h2>5. Third-Party Processors</h2>
          <p>
            We use GDPR-compliant vendors such as Vercel (hosting), Neon
            (database), Cloudflare R2 (storage), PostHog (analytics), and Sentry
            (error tracking).
          </p>

          <h2>6. Data Retention</h2>
          <p>
            You can delete your account anytime. Data is deleted within 30 days;
            backups may persist up to 90 days.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Data may be processed in the UK, EU, US, or Australia with safeguards
            such as Standard Contractual Clauses (SCCs).
          </p>

          <h2>8. Your Rights</h2>
          <ul>
            <li>Access, correct, or delete your data</li>
            <li>Withdraw consent (where applicable)</li>
            <li>Request data export</li>
            <li>
              Lodge a complaint with the UK Information Commissioner’s Office
              (ICO)
            </li>
          </ul>

          <h2>9. Cookies</h2>
          <p>
            We use minimal cookies for authentication and anonymous analytics. You
            can disable cookies in your browser, but some features may break.
          </p>

          <h2>10. Children</h2>
          <p>
            Cibo Libro is intended for users aged 16+. We do not knowingly collect
            data from children.
          </p>

          <h2>11. Updates</h2>
          <p>
            We may update this policy periodically. Material changes will be
            posted on this page.
          </p>

          <h2>12. Contact</h2>
          <p>
            For privacy matters, email{" "}
            <a href="mailto:privacy@cibolibro.com">privacy@cibolibro.com</a> or
            visit our{" "}
            <Link href="/legal/contact" className="underline">
              Contact page
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer />

    </>
  );
}
