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
            Terms of Use
          </h1>

          <p className="mb-6 text-center text-sm text-orange-700 border-t pt-2">
            Last updated: November 2025
          </p>

          <p>
            Welcome to <strong>Cibo Libro</strong> (“we,” “us,” or “our”). These
            Terms of Use (“Terms”) govern your access to and use of the Cibo Libro
            website, mobile web app, and related services (collectively, the
            “Service”).
          </p>

          <p>
            By creating an account or using the Service, you agree to these Terms.
            If you do not agree, please do not use Cibo Libro.
          </p>

          <h2>1. About Us</h2>
          <p>
            Cibo Libro is operated by <strong>Cibo Libro Ltd</strong>, a company
            registered in England and Wales (Company No. [TBD]), with its
            registered office at [Registered Office Address, UK]. You can contact
            us at{" "}
            <a href="mailto:support@cibolibro.com">support@cibolibro.com</a>.
          </p>

          <h2>2. What We Provide</h2>
          <ul>
            <li>Save and manage personal recipes, manually or via import</li>
            <li>View recipes in a distraction-free “Cook Mode”</li>
            <li>Organize recipes using tags and search filters</li>
            <li>Optionally share owned recipes publicly</li>
          </ul>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Upload or share content that infringes others’ copyright, trademark,
              or privacy rights
            </li>
            <li>Attempt to copy, scrape, or reverse engineer our Service</li>
            <li>Interfere with or damage the Service (malware, DDoS, etc.)</li>
            <li>Use Cibo Libro for any unlawful purpose</li>
          </ul>
          <p>
            We reserve the right to suspend or remove accounts violating these
            Terms.
          </p>

          <h2>4. Copyright and Imported Content</h2>
          <p>
            Imported recipes are stored privately for your personal use only. You
            must not republish, distribute, or make public any imported content
            that you do not own.
          </p>
          <p>
            If you publish recipes publicly, you warrant that you own or have
            permission to publish them. Rights-holders can file takedown notices
            via our{" "}
            <Link href="/legal/dmca" className="underline">
              DMCA / Copyright Policy
            </Link>{" "}
            page.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All Cibo Libro trademarks, designs, and software are owned by Cibo
            Libro Ltd. You retain ownership of your own recipes or content.
          </p>
          <p>
            By using the Service, you grant us a limited licence to store,
            process, and display your content solely to operate the platform.
          </p>

          <h2>6. Privacy</h2>
          <p>
            Your privacy is important to us. See our{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            for details on how we collect and use your data.
          </p>

          <h2>7. Account Security</h2>
          <p>
            You’re responsible for maintaining the confidentiality of your login
            credentials. If you suspect unauthorised access, contact{" "}
            <a href="mailto:support@cibolibro.com">support@cibolibro.com</a>{" "}
            immediately.
          </p>

          <h2>8. Availability and Changes</h2>
          <p>
            We aim for uninterrupted service but do not guarantee uptime. Features
            may change or be discontinued at any time.
          </p>

          <h2>9. Disclaimer</h2>
          <p>
            Cibo Libro is provided “as is” without warranties of any kind. We do
            not guarantee recipe accuracy, nutritional information, or dietary
            suitability. Use your own judgment when cooking.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Cibo Libro Ltd is not liable
            for any indirect, incidental, or consequential damages. Our total
            liability shall not exceed the amount (if any) you paid us in the 12
            months prior to the claim.
          </p>

          <h2>11. Termination</h2>
          <p>
            You may delete your account at any time. We may suspend or terminate
            access if you breach these Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. The courts
            of England and Wales have exclusive jurisdiction.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:support@cibolibro.com">support@cibolibro.com</a> or
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
