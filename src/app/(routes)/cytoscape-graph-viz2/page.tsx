import CytoscapeGraphViz2 from '../../../components/pages/CytoscapeGraphViz2'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('cytoscape-graph-viz2')

export default function Page() {
  return (
    <DemoShell slug="cytoscape-graph-viz2">
      <CytoscapeGraphViz2 />
    </DemoShell>
  )
}
