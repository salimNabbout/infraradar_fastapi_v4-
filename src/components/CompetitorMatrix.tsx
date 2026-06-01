import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import type { Competitor } from '../types'

interface CompetitorMatrixProps {
  competitors: Competitor[]
}

const COLORS = ['#16b7a8', '#38bdf8', '#a78bfa', '#fbbf24', '#fb7185']

export function CompetitorMatrix({ competitors }: CompetitorMatrixProps) {
  const data = competitors.map((c) => ({
    nome: c.nome,
    x: c.inovacao,
    y: c.presenca,
    z: c.participacao,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#1f3942" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Inovação"
            domain={[40, 90]}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{
              value: 'Inovação',
              position: 'insideBottom',
              offset: -8,
              fill: '#94a3b8',
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Presença"
            domain={[40, 90]}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{
              value: 'Presença',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 12,
            }}
          />
          <ZAxis type="number" dataKey="z" range={[120, 520]} name="Share" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#16b7a8' }}
            contentStyle={{
              background: '#0d1b20',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#e2e8f0',
            }}
          />
          <Scatter data={data} name="Concorrentes">
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
