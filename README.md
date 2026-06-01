# CETEM Market Intelligence

Frontend executivo para inteligência de mercado da CETEM Tecnologia, focado em automação, BMS, infraestrutura, automação industrial, energia, data centers, hospitais, facilities e projetos públicos/privados.

Esta entrega implementa somente o frontend principal. Não há backend real, banco de dados real, autenticação real, scraping ou chamadas reais ao Perplexity.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Arquitetura modular preparada para integração futura com FastAPI

## Como rodar (backend + frontend juntos)

A forma mais simples é usar o script único, que instala dependências na primeira
execução e sobe os dois serviços:

```bash
# Windows
start.bat

# macOS / Linux
./start.sh
```

Na primeira vez, configure sua chave da Perplexity em `backend/.env`
(`PERPLEXITY_API_KEY=...`). Veja `backend/README.md` para detalhes.

- Frontend: http://localhost:5173
- Backend:  http://localhost:8000/docs

## Como rodar (manual, separado)

```bash
npm install
npm run dev
```

Depois abra o endereço exibido pelo Vite, normalmente:

```bash
http://localhost:5173
```

## Estrutura

```txt
src/
  components/       Componentes reutilizáveis de layout, cards, tabelas e estados
  data/             Dados mockados coerentes com inteligência de mercado B2B
  hooks/            Hooks utilitários para simular comportamento de app real
  lib/              Helpers de UI
  pages/            Telas principais do dashboard
  services/         Camada preparada para futura integração com FastAPI
  types/            Tipagens centrais do domínio
```

## Páginas implementadas

- Visão Geral
- Radar de Mercado
- Oportunidades
- Concorrentes
- Leads e Contas-Alvo
- Projetos e Licitações
- Tendências
- Notícias e Sinais
- Relatórios
- Buscas Perplexity
- Configurações

## Componentes incluídos

- AppLayout
- Sidebar
- Header
- KpiCard
- ChartCard
- DataTable
- FilterBar
- StatusBadge
- InsightCard
- OpportunityScore
- CompetitorMatrix
- TrendMatrix
- ReportCard
- EmptyState
- LoadingState
- ErrorState

## Dados mockados

Os dados ficam em:

```txt
src/data/mockData.ts
```

Eles cobrem oportunidades, concorrentes, leads, projetos, tendências, notícias, relatórios, histórico de buscas e KPIs executivos.

## Integração futura com Cowork/FastAPI

A pasta `src/services` já contém funções simuladas com comentários indicando os endpoints futuros.

Endpoints previstos:

```txt
GET  /api/dashboard/overview
GET  /api/market/signals
GET  /api/opportunities
GET  /api/competitors
GET  /api/leads
GET  /api/projects
GET  /api/trends
GET  /api/reports
POST /api/search/perplexity
GET  /api/search/history
```

Fluxo previsto:

```txt
Usuário → Dashboard CETEM → FastAPI Cowork → Perplexity Search → Processamento IA → Retorno de insights ao dashboard
```

## Observação de produto

O Perplexity aparece no frontend como motor conceitual de busca e pesquisa. Na fase futura, o dashboard não deverá chamar o Perplexity diretamente; o backend Cowork via FastAPI fará a orquestração, consolidação das fontes, enriquecimento por IA e retorno dos insights ao frontend.
