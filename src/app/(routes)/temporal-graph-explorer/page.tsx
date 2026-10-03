import TemporalGraphExplorer from '../../../components/pages/TemporalGraphExplorer'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('temporal-graph-explorer')

export default function Page() {
  return (
    <DemoShell slug="temporal-graph-explorer">
      <TemporalGraphExplorer />
    </DemoShell>
  )
}
