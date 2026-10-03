import CytoscapeGraphExplorer from '../../../components/pages/CytoscapeGraphExplorer'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('cytoscape-graph-explorer')

export default function Page() {
  return (
    <DemoShell slug="cytoscape-graph-explorer">
      <CytoscapeGraphExplorer />
    </DemoShell>
  )
}
