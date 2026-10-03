import ForceDirectedGraph from '../../../components/pages/ForceDirectedGraph'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('force-directed-graph')

export default function Page() {
  return (
    <DemoShell slug="force-directed-graph">
      <ForceDirectedGraph />
    </DemoShell>
  )
}
