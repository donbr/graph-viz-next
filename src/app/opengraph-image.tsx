import { ImageResponse } from 'next/og'
import { listedDemos } from '@/lib/demos'

// Social preview for every route (Next.js adds the og:image tags from this file).
// Generated at build time; colors follow the site's gray-800 / blue-700 / gray-50 tokens.
export const alt = 'Graph Visualizations: knowledge graph and network demos by Don Branson'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Node fills and borders from src/utils/colors.ts (Tailwind 500 / 700 pairs)
const nodes = [
  { x: 210, y: 70, r: 26, fill: '#3b82f6', stroke: '#1d4ed8' },
  { x: 90, y: 190, r: 22, fill: '#a855f7', stroke: '#7e22ce' },
  { x: 320, y: 180, r: 30, fill: '#22c55e', stroke: '#15803d' },
  { x: 180, y: 300, r: 24, fill: '#f97316', stroke: '#c2410c' },
  { x: 330, y: 360, r: 20, fill: '#6b7280', stroke: '#374151' },
  { x: 60, y: 360, r: 18, fill: '#fdba74', stroke: '#f97316' },
]
const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [1, 5]]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#f9fafb',
          borderTop: '12px solid #2563eb',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#374151' }}>
            Don Branson <span style={{ color: '#9ca3af', margin: '0 14px' }}>/</span> Graph Demos
          </div>
          <div style={{ fontSize: 76, color: '#1f2937', lineHeight: 1.05, marginTop: 28 }}>Graph Visualizations</div>
          <div style={{ fontSize: 34, color: '#1d4ed8', marginTop: 20 }}>Knowledge Graph &amp; Network Demos</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            {['D3.js', 'Cytoscape.js', 'Leaflet'].map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 24,
                  padding: '8px 18px',
                  borderRadius: 6,
                  backgroundColor: tag === 'Leaflet' ? '#f3e8ff' : '#dbeafe',
                  color: tag === 'Leaflet' ? '#6b21a8' : '#1e40af',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, color: '#4b5563', marginTop: 40 }}>
            {`${listedDemos.length} interactive demos · graph-viz-next.vercel.app`}
          </div>
        </div>
        <svg width="400" height="430" viewBox="0 0 400 430">
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="#9ca3af"
              strokeWidth="4"
            />
          ))}
          {nodes.map((n) => (
            <circle key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke={n.stroke} strokeWidth="4" />
          ))}
        </svg>
      </div>
    ),
    size,
  )
}
