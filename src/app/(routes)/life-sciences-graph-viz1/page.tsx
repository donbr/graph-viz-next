import LifeSciencesGraphViz1 from '../../../components/pages/LifeSciencesGraphViz1'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('life-sciences-graph-viz1')

export default function Page() {
  return (
    <DemoShell slug="life-sciences-graph-viz1">
      <LifeSciencesGraphViz1 />
    </DemoShell>
  )
}
