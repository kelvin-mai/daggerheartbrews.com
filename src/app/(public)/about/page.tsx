import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Daggerheart Brews, a fan-made homebrew creation tool for the Daggerheart TTRPG.',
};

export default function AboutPage() {
  return (
    <div className='mx-auto max-w-3xl space-y-12'>
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <Image
            src='/assets/images/dh-cgl-logo.png'
            alt='Daggerheart CGL Logo'
            height={56}
            width={56}
          />
          <h1 className='font-eveleth-clean text-4xl'>Daggerheart Brews</h1>
        </div>
        <p className='text-muted-foreground text-lg'>
          A free, open-source fan tool for creating and sharing homebrew content
          for the Daggerheart tabletop roleplaying game.
        </p>
      </div>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>What is Daggerheart Brews?</h2>
        <p>
          Daggerheart Brews is a web application that lets players and game
          masters design custom cards, adversaries, and reference materials
          compatible with the{' '}
          <a
            href='https://daggerheart.com'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            Daggerheart TTRPG
          </a>{' '}
          by Darrington Press. The goal is to make homebrew creation
          approachable — you fill in your content, the tool handles the
          formatting, and you can download print-ready card images or share your
          creations with the community.
        </p>
        <p>Key features include:</p>
        <ul className='list-disc space-y-1 pl-6'>
          <li>Custom card builder with domain, trait, and artwork support</li>
          <li>Adversary creator with full stat block formatting</li>
          <li>GM screen with quick-reference rules and tables</li>
          <li>SRD reference pages for ancestries, classes, and more</li>
          <li>
            Community gallery to browse and share homebrew created by other
            users
          </li>
        </ul>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>About the Creator</h2>
        <p>
          Daggerheart Brews is built and maintained by{' '}
          <a
            href='https://kelvinmai.io'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            Kelvin Mai
          </a>
          , a software developer and tabletop gaming enthusiast. The project
          started as a personal utility and grew into a community tool.
        </p>
        <p>
          The source code is open source and available on{' '}
          <a
            href='https://github.com/kelvin-mai/daggerheartbrews.com'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            GitHub
          </a>
          . Contributions, bug reports, and feature suggestions are welcome.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>
          Daggerheart Community Gaming License
        </h2>
        <div className='rounded-lg border bg-white p-4 text-black'>
          <div className='mb-4 flex justify-center'>
            <Image
              src='/assets/images/dh-cgl-full.png'
              height={120}
              width={400}
              alt='Daggerheart Community Gaming License Logo'
            />
          </div>
          <p className='text-sm'>
            Daggerheart Brews operates under the{' '}
            <a
              href='https://darringtonpress.com/license/'
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-4'
            >
              Darrington Press Community Gaming License (DCGL)
            </a>
            . All reference content is sourced from the Daggerheart System
            Reference Document (SRD). This application is not affiliated with,
            endorsed by, or sponsored by Darrington Press. Users are responsible
            for ensuring that any content they distribute complies with the
            terms of the DCGL.
          </p>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>SRD Reference Data</h2>
        <p>
          The reference pages (ancestries, classes, communities, adversaries,
          and more) are generated from the{' '}
          <a
            href='https://github.com/seansbox/daggerheart-srd'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            daggerheart-srd
          </a>{' '}
          repository, a structured markdown conversion of the Daggerheart SRD
          maintained by{' '}
          <a
            href='https://github.com/seansbox'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            seansbox
          </a>
          . Many thanks for the careful work of organizing the SRD into a
          machine-readable format.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Contact</h2>
        <p>
          Have a question, found a bug, or want to get in touch? Visit the{' '}
          <Link href='/contact' className='underline underline-offset-4'>
            contact page
          </Link>{' '}
          to send a message, or open an issue on{' '}
          <a
            href='https://github.com/kelvin-mai/daggerheartbrews.com/issues'
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4'
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <div className='flex gap-4 pt-4'>
        <Link href='/card/create' className='underline underline-offset-4'>
          Start Building
        </Link>
        <Link href='/community/cards' className='underline underline-offset-4'>
          Browse Community
        </Link>
        <Link href='/contact' className='underline underline-offset-4'>
          Contact
        </Link>
        <Link href='/privacy-policy' className='underline underline-offset-4'>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
