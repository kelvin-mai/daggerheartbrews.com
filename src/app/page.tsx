import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { LogIn, Palette, Download, Users, Sliders } from 'lucide-react';
import {
  AdUnit,
  BuyMeCofffeeBanner,
  DCGLCompatibilityBanner,
  ThemeToggle,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout';
import { auth } from '@/lib/auth';

const features = [
  {
    icon: Palette,
    title: 'Domain Colors & Artwork',
    description:
      'Choose from all Daggerheart domains. Customize card colors, upload your own artwork, and build cards that look exactly how you envision them.',
  },
  {
    icon: Sliders,
    title: 'Full Stat Control',
    description:
      'Set every attribute, trait, and description. Craft weapons, abilities, ancestry traits, spells, and any card type the system supports.',
  },
  {
    icon: Download,
    title: 'Export & Print',
    description:
      'Download your finished cards as high-quality images. Print them, add them to a VTT, or share them directly with your adventuring party.',
  },
  {
    icon: Users,
    title: 'Community Gallery',
    description:
      'Browse homebrew created by other fans, get inspired, and publish your own cards for others to discover and remix.',
  },
];

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const ctaHref = session ? '/profile/homebrew' : '/card/create';
  return (
    <>
      <a
        href='#main-content'
        className='focus:bg-background focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2'
      >
        Skip to main content
      </a>

      <header className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm'>
        <div className='container flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center gap-3'>
            <Image
              src='/assets/images/dh-cgl-logo.png'
              alt='Daggerheart Brews'
              height={32}
              width={32}
              className='size-8'
            />
            <span className='font-eveleth-clean hidden text-lg tracking-tight sm:block'>
              Daggerheart Brews
            </span>
          </Link>
          <nav aria-label='Main navigation' className='flex items-center gap-2'>
            <ThemeToggle />
            <Button size='sm' asChild>
              <Link href={ctaHref}>Start Building</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id='main-content'>
        <section
          aria-labelledby='hero-heading'
          className='relative overflow-hidden py-24 md:py-36 lg:py-48'
        >
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0'
          >
            <Image
              src='/assets/images/dh-keyart.jpg'
              alt=''
              fill
              className='object-cover object-center opacity-15 blur-sm dark:opacity-10'
              priority
            />
          </div>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0'
            style={{
              background:
                'radial-gradient(ellipse 100% 60% at 50% 100%, var(--background), transparent 60%), radial-gradient(ellipse 100% 40% at 50% 0%, var(--background), transparent 50%)',
            }}
          />
          <div className='relative container mx-auto max-w-4xl space-y-10 text-center'>
            <div className='flex justify-center'>
              <Badge
                variant='secondary'
                className='px-4 py-1.5 text-sm font-medium'
              >
                Free to use · No account required
              </Badge>
            </div>
            <h1
              id='hero-heading'
              className='font-eveleth-clean text-5xl leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl'
            >
              Build Homebrew Cards
              <br />
              <span className='text-primary'>for Daggerheart</span>
            </h1>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl'>
              A fan-made card creator for the Daggerheart TTRPG. Design custom
              cards with domain colors and artwork, then export and share them
              with your party.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Button size='lg' className='px-8' asChild>
                <Link href={ctaHref}>Start Building for Free</Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/login'>
                  <LogIn className='mr-2 h-4 w-4' />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          aria-label='Product preview'
          className='container py-24 md:py-36'
        >
          <div className='overflow-hidden rounded-2xl border shadow-2xl'>
            <div
              aria-hidden='true'
              className='bg-muted/50 flex items-center gap-1.5 border-b px-4 py-3'
            >
              <div className='h-3 w-3 rounded-full bg-red-400 opacity-80' />
              <div className='h-3 w-3 rounded-full bg-yellow-400 opacity-80' />
              <div className='h-3 w-3 rounded-full bg-green-400 opacity-80' />
              <div className='ml-3 flex-1'>
                <div className='bg-background/70 text-muted-foreground mx-auto max-w-sm rounded-md px-3 py-1 text-center text-xs'>
                  daggerheartbrews.com/card/create
                </div>
              </div>
            </div>
            <Image
              src='/assets/images/mockup.png'
              alt='Daggerheart Brews card creation interface'
              width={1800}
              height={900}
              className='w-full'
              priority
            />
          </div>
        </section>

        {/* Features */}
        <section
          aria-labelledby='features-heading'
          className='bg-muted/30 border-t py-24 md:py-32'
        >
          <div className='container'>
            <div className='mx-auto mb-16 max-w-2xl text-center'>
              <h2
                id='features-heading'
                className='font-eveleth-clean mb-4 text-3xl sm:text-4xl md:text-5xl'
              >
                Everything You Need to Brew
              </h2>
              <p className='text-muted-foreground md:text-lg'>
                Create professional-quality homebrew cards without any design
                experience.
              </p>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className='bg-card rounded-xl border p-6 transition-shadow duration-200 hover:shadow-lg'
                >
                  <div className='bg-primary/10 dark:bg-sidebar mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg'>
                    <feature.icon className='text-primary dark:text-primary-foreground h-5 w-5' />
                  </div>
                  <h3 className='mb-2 font-semibold tracking-tight'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby='cta-heading' className='border-t py-24'>
          <div className='container mx-auto max-w-2xl space-y-6 text-center'>
            <h2
              id='cta-heading'
              className='font-eveleth-clean text-3xl sm:text-4xl'
            >
              Ready to Start Creating?
            </h2>
            <p className='text-muted-foreground'>
              Jump in without signing up. Create an account to save your cards
              and share them with the community.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Button size='lg' asChild>
                <Link href={ctaHref}>Create Your First Card</Link>
              </Button>
              <Button size='lg' variant='ghost' asChild>
                <Link href='/community'>Browse Community</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className='container space-y-8 py-12'>
          <DCGLCompatibilityBanner className='text-black' />
          <BuyMeCofffeeBanner />
          <AdUnit slot='HOME_BOTTOM' format='auto' />
        </div>
      </main>

      <Footer />
    </>
  );
}
