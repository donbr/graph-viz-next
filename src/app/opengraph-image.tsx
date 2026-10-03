import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'
import { listedDemos } from '@/lib/demos'
import { siteImage } from '@/lib/site'
import { baseColors, graphChrome } from '@/utils/colors'

// Social preview for every route (Next.js adds the og:image tags from this file).
// Generated at build time. Colors come from src/utils/colors.ts and Tailwind's palette,
// so the preview stays in step with the site.
export const alt = siteImage.alt
export const size = { width: siteImage.width, height: siteImage.height }
export const contentType = 'image/png'

const nodes = [
  { x: 210, y: 70, r: 26, color: baseColors.blue },
  { x: 90, y: 190, r: 22, color: baseColors.purple },
  { x: 320, y: 180, r: 30, color: baseColors.green },
  { x: 180, y: 300, r: 24, color: baseColors.orange },
  { x: 330, y: 360, r: 20, color: baseColors.gray },
  { x: 60, y: 360, r: 18, color: baseColors.amber },
]
const tags = [
  { label: 'D3.js', color: baseColors.blue },
  { label: 'Cytoscape.js', color: baseColors.blue },
  { label: 'Leaflet', color: baseColors.purple },
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
          backgroundColor: colors.gray[50],
          borderTop: `12px solid ${colors.blue[600]}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ display: 'flex', fontSize: 28, color: colors.gray[700] }}>
            Don Branson <span style={{ color: colors.gray[400], margin: '0 14px' }}>/</span> Graph Demos
          </div>
          <div style={{ fontSize: 76, color: colors.gray[800], lineHeight: 1.05, marginTop: 28 }}>Graph Visualizations</div>
          <div style={{ fontSize: 34, color: colors.blue[700], marginTop: 20 }}>Knowledge Graph &amp; Network Demos</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            {tags.map(({ label, color }) => (
              <div
                key={label}
                style={{
                  fontSize: 24,
                  padding: '8px 18px',
                  borderRadius: 6,
                  backgroundColor: color.light,
                  color: color.text,
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, color: colors.gray[600], marginTop: 40 }}>
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
              stroke={graphChrome.edge}
              strokeWidth="4"
            />
          ))}
          {nodes.map((n) => (
            <circle key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} r={n.r} fill={n.color.fill} stroke={n.color.border} strokeWidth="4" />
          ))}
        </svg>
      </div>
    ),
    size,
  )
}
