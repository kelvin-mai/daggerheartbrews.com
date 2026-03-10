'use client';

import * as React from 'react';

type Template = {
  name: string;
  html: string;
};

export const EmailPreviewClient = ({
  templates,
}: {
  templates: Template[];
}) => {
  const [active, setActive] = React.useState(0);

  return (
    <>
      <div className='mb-4 flex gap-2'>
        {templates.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className='overflow-hidden rounded-lg border'>
        <iframe
          key={active}
          srcDoc={templates[active].html}
          className='w-full'
          style={{ height: '80vh' }}
          title={`${templates[active].name} email preview`}
          sandbox='allow-same-origin'
        />
      </div>
    </>
  );
};
