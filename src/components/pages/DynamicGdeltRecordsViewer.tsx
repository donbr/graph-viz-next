'use client'

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the GdeltRecordsViewer with SSR disabled
const DynamicGdeltRecordsViewer = dynamic(
  () => import('./GdeltRecordsViewer').then(mod => mod.GdeltRecordsViewer),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow-md p-6 text-gray-600" role="status">
        Loading viewer…
      </div>
    ),
  }
);

const GdeltRecordsViewerPage: React.FC = () => {
  return <DynamicGdeltRecordsViewer />;
};

export default GdeltRecordsViewerPage;
