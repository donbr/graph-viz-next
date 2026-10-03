import MCPKnowledgeGraph from '../../../components/pages/McpGraphVisualization'
import DemoShell from '@/components/DemoShell'
import { demoMetadata } from '@/lib/demos'

export const metadata = demoMetadata('mcp-graph-visualization')

export default function Page() {
  return (
    <DemoShell slug="mcp-graph-visualization">
      <MCPKnowledgeGraph />
    </DemoShell>
  )
}
