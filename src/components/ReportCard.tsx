import { Download, FileText } from 'lucide-react'
import type { Report } from '../types'
import { formatDate } from '../lib/format'

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
      <div className="mb-3 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-tealbrand/15 text-tealbrand">
          <FileText size={18} />
        </span>
        <span className="rounded-full bg-steel/60 px-2 py-0.5 text-[11px] font-medium text-slate-300">
          {report.tipo}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-white">{report.titulo}</h3>
      <p className="mt-1 text-xs text-slate-400">{report.destaque}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{report.periodo}</span>
        <span>{report.paginas} págs.</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-[11px] text-slate-500">
          Atualizado {formatDate(report.atualizadoEm)}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-tealbrand/15 px-3 py-1.5 text-xs font-medium text-tealbrand transition hover:bg-tealbrand/25"
        >
          <Download size={13} /> Abrir
        </button>
      </div>
    </div>
  )
}
