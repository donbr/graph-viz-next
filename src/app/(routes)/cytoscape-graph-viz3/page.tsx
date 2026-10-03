import CytoscapeGraphViz3 from '../../../components/pages/CytoscapeGraphViz3'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('cytoscape-graph-viz3')

export default function Page() {
  return (
    <DemoShell slug="cytoscape-graph-viz3">
      <CytoscapeGraphViz3 />
    </DemoShell>
  )
}
