import { AsyncRegion } from '../shared/components/AsyncRegion';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { useState } from 'react';
import { Button } from '../shared/components/ui/Button';
import { Dialog } from '../shared/components/ui/Dialog';

export function WorkspacePage({ audience }: { audience: 'supplier' | 'admin' }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const name = audience === 'supplier' ? 'Supplier workspace' : 'Super admin workspace';
  return <>
    <Breadcrumbs items={[{ label: 'Marketplace', to: '/' }]} current={name} />
    <div className="page-heading"><p className="eyebrow">Layout preview</p><h1>{name}</h1><p>Your workspace is being prepared.</p></div>
    <AsyncRegion title="Overview" state={{ status: 'empty', message: 'Workspace features are not available yet. Please check back later.' }} />
    <Button variant="secondary" onClick={() => setAboutOpen(true)}>About this workspace</Button>
    <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} title="About this workspace"
      description="This is a layout preview. Account features are not available yet." />
  </>;
}
