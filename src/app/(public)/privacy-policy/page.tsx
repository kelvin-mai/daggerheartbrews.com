import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Daggerheart Brews.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 2026';

  return (
    <div className='mx-auto max-w-3xl space-y-10'>
      <div className='space-y-2'>
        <h1 className='font-eveleth-clean text-4xl'>Privacy Policy</h1>
        <p className='text-muted-foreground text-sm'>
          Last updated: {lastUpdated}
        </p>
      </div>

      <p>
        This privacy policy describes how Daggerheart Brews (&ldquo;we&rdquo;,
        &ldquo;our&rdquo;, &ldquo;us&rdquo;) collects, uses, and shares
        information when you use <strong>daggerheartbrews.com</strong>. By using
        the site you agree to the practices described here.
      </p>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Information We Collect</h2>

        <div className='space-y-3'>
          <h3 className='text-lg font-semibold'>Account information</h3>
          <p>
            When you register an account we collect your{' '}
            <strong>email address</strong> and a display name. If you sign in
            via a social provider (Google or Discord), we receive the email
            address and profile information permitted by that provider.
            Passwords, when used, are stored as salted hashes and are never
            readable by us.
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='text-lg font-semibold'>User-created content</h3>
          <p>
            Cards and adversaries you create are stored in our database
            associated with your account. Content you mark as public is visible
            to all visitors. You can delete your content at any time from your
            profile.
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='text-lg font-semibold'>Usage data</h3>
          <p>
            We collect anonymous usage data through Vercel Analytics and Vercel
            Speed Insights. This includes page views, referrer information,
            browser type, and performance metrics. This data is aggregated and
            cannot be used to identify you individually.
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='text-lg font-semibold'>Cookies</h3>
          <p>
            We use cookies and similar technologies for the following purposes:
          </p>
          <ul className='list-disc space-y-1 pl-6'>
            <li>
              <strong>Authentication session cookies</strong> — to keep you
              signed in between visits. These are essential and are set by
              Better Auth.
            </li>
            <li>
              <strong>Theme preference</strong> — to remember your light/dark
              mode choice.
            </li>
            <li>
              <strong>Advertising cookies</strong> — Google AdSense may set
              cookies to serve personalised or contextual advertisements. See
              the Third-party Services section below.
            </li>
            <li>
              <strong>Analytics cookies</strong> — Vercel Analytics may store
              minimal session identifiers to count unique visitors.
            </li>
          </ul>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Third-party Services</h2>
        <p>
          We use the following third-party services that may collect or process
          data on our behalf:
        </p>

        <div className='divide-y overflow-hidden rounded-lg border'>
          <div className='hover:bg-accent space-y-1 p-4 transition-colors'>
            <h3 className='font-semibold'>Google AdSense</h3>
            <p className='text-muted-foreground text-sm'>
              We display advertisements served by Google AdSense. Google may use
              cookies to serve ads based on your prior visits to this or other
              websites. You can opt out of personalised advertising by visiting{' '}
              <a
                href='https://www.google.com/settings/ads'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4'
              >
                Google Ads Settings
              </a>
              . Google&apos;s use of advertising cookies is governed by the{' '}
              <a
                href='https://policies.google.com/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4'
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className='hover:bg-accent space-y-1 p-4 transition-colors'>
            <h3 className='font-semibold'>
              Vercel Analytics &amp; Speed Insights
            </h3>
            <p className='text-muted-foreground text-sm'>
              Anonymous performance and traffic analytics provided by Vercel. No
              personally identifiable information is collected. See the{' '}
              <a
                href='https://vercel.com/docs/analytics/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4'
              >
                Vercel Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className='hover:bg-accent space-y-1 p-4 transition-colors'>
            <h3 className='font-semibold'>Better Auth</h3>
            <p className='text-muted-foreground text-sm'>
              Authentication is powered by Better Auth. Session tokens and
              account credentials are stored in our own database (Neon
              PostgreSQL) and are not shared with third parties beyond the OAuth
              providers you choose (Google, Discord).
            </p>
          </div>

          <div className='hover:bg-accent space-y-1 p-4 transition-colors'>
            <h3 className='font-semibold'>Neon (Database)</h3>
            <p className='text-muted-foreground text-sm'>
              Our PostgreSQL database is hosted by Neon. Your account data and
              created content are stored on Neon&apos;s infrastructure. See the{' '}
              <a
                href='https://neon.tech/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4'
              >
                Neon Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className='hover:bg-accent space-y-1 p-4 transition-colors'>
            <h3 className='font-semibold'>Resend</h3>
            <p className='text-muted-foreground text-sm'>
              Transactional emails (email verification, password reset) are sent
              via Resend. Your email address is passed to Resend solely for
              delivery purposes. See the{' '}
              <a
                href='https://resend.com/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4'
              >
                Resend Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>How We Use Your Information</h2>
        <ul className='list-disc space-y-2 pl-6'>
          <li>To create and manage your account</li>
          <li>To store and serve your homebrew content</li>
          <li>
            To send transactional emails (email verification, password reset)
          </li>
          <li>To improve the performance and usability of the site</li>
          <li>To display relevant advertisements through Google AdSense</li>
        </ul>
        <p>
          We do not sell your personal data to any third party. We do not use
          your data for any purpose beyond what is described in this policy.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Data Retention</h2>
        <p>
          Account data and user-created content are retained for as long as your
          account is active. You may delete your content at any time from your
          profile. To request full account deletion, contact us at the address
          below.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal data, including the right to:
        </p>
        <ul className='list-disc space-y-1 pl-6'>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to or restrict certain processing</li>
          <li>
            Withdraw consent for personalised advertising (via Google Ads
            Settings)
          </li>
        </ul>
        <p>
          To exercise any of these rights, please{' '}
          <Link href='/contact' className='underline underline-offset-4'>
            contact us
          </Link>
          .
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Children&apos;s Privacy</h2>
        <p>
          This site is not directed at children under the age of 13. We do not
          knowingly collect personal information from children. If you believe a
          child has provided us with personal data, please contact us and we
          will delete it promptly.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          noted by updating the &ldquo;Last updated&rdquo; date at the top of
          this page. Continued use of the site after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Contact</h2>
        <p>
          Questions about this privacy policy or requests regarding your data
          can be submitted via the{' '}
          <Link href='/contact' className='underline underline-offset-4'>
            contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
