import CytoscapeGraphViz1 from '../../../components/pages/CytoscapeGraphViz1'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('cytoscape-graph-viz1')

export default function Page() {
  return (
    <DemoShell slug="cytoscape-graph-viz1">
      <CytoscapeGraphViz1 />
    </DemoShell>
  )
}
