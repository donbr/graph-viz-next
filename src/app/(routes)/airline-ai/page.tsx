import AirlineAIKnowledgeGraph from '../../../components/pages/AirlineAIGraph'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('airline-ai')

export default function Page() {
  return (
    <DemoShell slug="airline-ai">
      <AirlineAIKnowledgeGraph />
    </DemoShell>
  )
}
