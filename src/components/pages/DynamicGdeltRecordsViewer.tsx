'use client'

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the GdeltRecordsViewer with SSR disabled
const DynamicGdeltRecordsViewer = dynamic(
  () => import('./GdeltRecordsViewer').then(mod => mod.GdeltRecordsViewer),
  { ssr: false }
);

const GdeltRecordsViewerPage: React.FC = () => {
  return <DynamicGdeltRecordsViewer />;
};

export default GdeltRecordsViewerPage;
