import GdeltRecordsViewerPage from '@/components/pages/DynamicGdeltRecordsViewer';
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('gdelt-records-viewer')

export default function Page() {
  return (
    <DemoShell slug="gdelt-records-viewer">
      <GdeltRecordsViewerPage />
    </DemoShell>
  )
}
