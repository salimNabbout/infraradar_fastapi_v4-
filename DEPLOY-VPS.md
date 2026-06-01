# Deploy do CETEM Market Intelligence na VPS Hostinger

Guia completo para publicar o projeto (frontend React/Vite + backend FastAPI) numa VPS Ubuntu da Hostinger, servido pelo nginx no seu domínio.

**Arquitetura final:**

```
Navegador
   │  (seu-dominio.com.br)
   ▼
 nginx  ──► arquivos estáticos do frontend (pasta dist/)
   │
   └─ /api/* ──► FastAPI (uvicorn) em 127.0.0.1:8000 ──► Perplexity
```

O nginx serve o site e encaminha tudo que começa com `/api/` para o backend. Como frontend e API ficam no mesmo domínio, não há problema de CORS.

**Premissas deste guia:** VPS Ubuntu 22.04/24.04 (padrão Hostinger), acesso root por SSH, repositório já no GitHub, domínio próprio, sem HTTPS por enquanto (há um apêndice no final para adicionar depois).

> Em todo o guia, troque os marcadores:
> - `SEU_DOMINIO.com.br` → seu domínio real
> - `IP_DA_VPS` → o IP da sua VPS (aparece no painel da Hostinger)
> - `git@github.com:SEU_USUARIO/SEU_REPO.git` → a URL do seu repositório
> - `main` → o nome do seu branch principal, se for diferente

---

## 1. Conectar na VPS por SSH

No painel da Hostinger (hPanel → VPS) você encontra o IP e a senha de root. No seu Windows, abra o PowerShell ou o Prompt de Comando e rode:

```bash
ssh root@IP_DA_VPS
```

Digite a senha quando pedir. Na primeira conexão, confirme com `yes`.

---

## 2. Atualizar o sistema e instalar o básico

```bash
apt update && apt upgrade -y
apt install -y git nginx curl ufw python3-venv python3-pip
```

Instale o Node.js 20 LTS (necessário para o build do frontend) via NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Confira as versões:

```bash
node -v      # deve mostrar v20.x
python3 -V   # deve mostrar Python 3.10+
nginx -v
```

---

## 3. Firewall (recomendado)

Libere SSH e o nginx, depois ative o firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## 4. Clonar o projeto do GitHub

Vamos colocar o projeto em `/var/www`:

```bash
mkdir -p /var/www
cd /var/www
git clone git@github.com:SEU_USUARIO/SEU_REPO.git cetem-market-intelligence
cd cetem-market-intelligence
```

> **Repositório privado?** Se o `git clone` por SSH pedir chave, a forma mais simples é clonar por HTTPS usando um Personal Access Token:
> ```bash
> git clone https://github.com/SEU_USUARIO/SEU_REPO.git cetem-market-intelligence
> ```
> e informar seu usuário + token quando solicitado.

Confirme que a estrutura veio certa:

```bash
ls          # deve listar: backend  src  package.json  index.html  deploy ...
```

---

## 5. Backend FastAPI

### 5.1 Criar o ambiente virtual e instalar dependências

```bash
cd /var/www/cetem-market-intelligence/backend
python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
```

### 5.2 Configurar a chave da Perplexity

```bash
cp .env.example .env
nano .env
```

Preencha assim (salve com `Ctrl+O`, `Enter`, e saia com `Ctrl+X`):

```ini
PERPLEXITY_API_KEY=cole_sua_chave_aqui
PERPLEXITY_MODEL=sonar
CORS_ORIGINS=http://SEU_DOMINIO.com.br,http://www.SEU_DOMINIO.com.br
```

> A chave fica **somente** na VPS, nunca no frontend. Pegue a sua em https://www.perplexity.ai/settings/api

### 5.3 Subir o backend como serviço (systemd)

O projeto já traz o arquivo pronto em `deploy/cetem-backend.service`. Instale-o:

```bash
cp /var/www/cetem-market-intelligence/deploy/cetem-backend.service /etc/systemd/system/cetem-backend.service
systemctl daemon-reload
systemctl enable --now cetem-backend
```

Verifique se está rodando e respondendo:

```bash
systemctl status cetem-backend --no-pager
curl http://127.0.0.1:8000/api/health
```

O `curl` deve retornar algo como `{"status":"ok","perplexityConfigured":true,"model":"sonar"}`.

> Se der erro de permissão de leitura, garanta que o `www-data` consegue ler a pasta:
> ```bash
> chown -R www-data:www-data /var/www/cetem-market-intelligence
> ```

---

## 6. Frontend (build estático)

```bash
cd /var/www/cetem-market-intelligence
npm ci
npm run build
```

Isso gera a pasta `dist/` com os arquivos otimizados que o nginx vai servir. Confirme:

```bash
ls dist        # deve conter index.html e a pasta assets/
```

---

## 7. Configurar o nginx

O projeto já traz o arquivo pronto em `deploy/nginx-cetem.conf`. Instale e ative:

```bash
cp /var/www/cetem-market-intelligence/deploy/nginx-cetem.conf /etc/nginx/sites-available/cetem

# trocar o dominio dentro do arquivo:
nano /etc/nginx/sites-available/cetem    # substitua SEU_DOMINIO.com.br

# ativar o site e desativar o default
ln -sf /etc/nginx/sites-available/cetem /etc/nginx/sites-enabled/cetem
rm -f /etc/nginx/sites-enabled/default

# testar e recarregar
nginx -t
systemctl reload nginx
```

---

## 8. Apontar o domínio para a VPS (DNS)

No painel onde seu domínio está registrado (Hostinger ou outro), crie/edite os registros:

| Tipo | Nome | Valor        |
|------|------|--------------|
| A    | @    | IP_DA_VPS    |
| A    | www  | IP_DA_VPS    |

A propagação costuma levar de alguns minutos até algumas horas. Para testar do seu PC:

```bash
ping SEU_DOMINIO.com.br      # deve responder com o IP_DA_VPS
```

Quando propagar, abra no navegador: **http://SEU_DOMINIO.com.br** — o dashboard deve carregar.

---

## 9. Atualizar o projeto depois (deploy contínuo)

Sempre que você fizer mudanças e der `git push` no GitHub, atualize a VPS rodando o script pronto:

```bash
cd /var/www/cetem-market-intelligence
bash deploy/deploy.sh
```

Ele faz `git pull`, rebuilda o frontend, atualiza o backend, reinicia o serviço e recarrega o nginx — tudo de uma vez.

---

## Comandos úteis (manutenção)

```bash
# logs do backend em tempo real
journalctl -u cetem-backend -f

# reiniciar / parar / status do backend
systemctl restart cetem-backend
systemctl status cetem-backend --no-pager

# testar config do nginx e recarregar
nginx -t && systemctl reload nginx

# logs de erro do nginx
tail -f /var/log/nginx/error.log
```

---

## Apêndice A — Ligar a busca real ao backend (opcional)

Hoje a tela **Buscas Perplexity** do frontend usa uma busca *simulada* (mock) sobre os dados locais — ela não chama o backend ainda. O backend, porém, já está pronto e funcional. Para ligar a busca real:

1. Crie um arquivo `.env.production` na **raiz do projeto** (não no backend) com a linha:

   ```ini
   VITE_API_URL=
   ```

   Deixe vazio mesmo — assim o frontend chama `/api/...` no mesmo domínio (passando pelo nginx).

2. No arquivo `src/services/api.ts`, troque o corpo da função `searchPerplexity` para chamar o backend de verdade:

   ```ts
   export async function searchPerplexity(query: string) {
     const resp = await fetch(`${getApiBaseUrl()}/api/search/perplexity`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ query, type: 'Pesquisa livre' }),
     })
     if (!resp.ok) throw new Error('Falha na busca')
     return resp.json()
   }
   ```

   (O formato de retorno do backend tem `summary`, `insights`, `nextSteps`, `citations` — ajuste a página `PerplexitySearch.tsx` para exibir esses campos.)

3. `git push` e rode `bash deploy/deploy.sh` na VPS.

> Se preferir, me peça que eu faço essa integração no código para você.

---

## Apêndice B — Adicionar HTTPS depois (Let's Encrypt)

Quando quiser o cadeado (recomendado em produção), com o domínio já apontando para a VPS:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d SEU_DOMINIO.com.br -d www.SEU_DOMINIO.com.br
```

O Certbot configura o SSL automaticamente no nginx e renova sozinho. Depois disso, o site passa a responder em **https://SEU_DOMINIO.com.br**.

---

## Resolução de problemas

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Página em branco / 404 ao recarregar uma rota | SPA fallback ausente | Confirme o bloco `try_files ... /index.html` no nginx |
| `/api/...` retorna 502 Bad Gateway | Backend caiu ou não subiu | `systemctl status cetem-backend` e `journalctl -u cetem-backend -f` |
| Busca retorna 503 "PERPLEXITY_API_KEY não configurada" | `.env` sem a chave | Edite `backend/.env` e `systemctl restart cetem-backend` |
| `npm run build` falha | Node desatualizado | Confirme `node -v` (>= 20) |
| Domínio não abre | DNS não propagou | `ping SEU_DOMINIO.com.br` deve mostrar o IP da VPS |
| Permissão negada nos arquivos | Dono errado | `chown -R www-data:www-data /var/www/cetem-market-intelligence` |
