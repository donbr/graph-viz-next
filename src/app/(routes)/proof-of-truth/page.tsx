import ProofOfTruthD3Graph from '../../../components/pages/ProofOfTruthD3Graph'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('proof-of-truth')

export default function Page() {
  return (
    <DemoShell slug="proof-of-truth">
      <ProofOfTruthD3Graph />
    </DemoShell>
  )
}
