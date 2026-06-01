import { useState } from 'react'
import { Check, KeyRound, Server } from 'lucide-react'
import { getApiBaseUrl } from '../services/api'
import { setores } from '../data/mockData'
import { cn } from '../lib/format'

export function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [salvo, setSalvo] = useState(false)
  const [ativos, setAtivos] = useState<string[]>([
    'Data Centers',
    'Energia',
    'Hospitais',
    'Setor Público',
  ])

  function toggleSetor(s: string) {
    setAtivos((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
        <div className="mb-4 flex items-center gap-2">
          <KeyRound size={16} className="text-tealbrand" />
          <h3 className="text-sm font-semibold text-white">
            Integração Perplexity
          </h3>
        </div>
        <p className="mb-3 text-sm text-slate-400">
          A chave fica no backend (<code className="text-slate-300">backend/.env</code>
          ). Este campo é ilustrativo — em produção a chave nunca é exposta no
          frontend.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              setSalvo(false)
            }}
            placeholder="PERPLEXITY_API_KEY"
            className="flex-1 rounded-lg border border-white/10 bg-steel/60 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-tealbrand/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSalvo(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-tealbrand px-4 py-2.5 text-sm font-semibold text-graphite transition hover:bg-tealbrand/90"
          >
            {salvo ? <Check size={16} /> : null}
            {salvo ? 'Salvo' : 'Salvar'}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
        <div className="mb-4 flex items-center gap-2">
          <Server size={16} className="text-tealbrand" />
          <h3 className="text-sm font-semibold text-white">Backend</h3>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-steel/40 px-4 py-3 text-sm">
          <span className="text-slate-400">Endpoint</span>
          <code className="text-slate-200">{getApiBaseUrl()}</code>
        </div>
      </section>

      <section className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
        <h3 className="mb-1 text-sm font-semibold text-white">
          Setores monitorados
        </h3>
        <p className="mb-4 text-sm text-slate-400">
          Define o foco do radar e dos alertas.
        </p>
        <div className="flex flex-wrap gap-2">
          {setores.map((s) => {
            const on = ativos.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSetor(s)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                  on
                    ? 'border-tealbrand/40 bg-tealbrand/15 text-tealbrand'
                    : 'border-white/10 bg-steel/40 text-slate-300 hover:bg-white/5',
                )}
              >
                {s}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
