import { classes, subclasses } from '@/lib/constants/reference';
import { PageHeader } from '@/components/common';
import { FilteredClasses } from './client';

export const metadata = {
  title: 'Classes',
  description:
    'Reference to classes available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Classes'
        subtitle='Browse SRD classes and their subclasses from the System Reference Document'
      >
        <span className='text-muted-foreground text-sm'>
          {classes.length} available
        </span>
      </PageHeader>
      <FilteredClasses classes={classes} subclasses={subclasses} />
    </>
  );
}
