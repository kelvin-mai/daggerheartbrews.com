type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

export const PageHeader = ({
  title,
  subtitle,
  className,
  children,
}: PageHeaderProps) => (
  <div className={className}>
    {children ? (
      <div className='flex items-baseline gap-2'>
        <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
          {title}
        </h1>
        {children}
      </div>
    ) : (
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        {title}
      </h1>
    )}
    {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
  </div>
);
