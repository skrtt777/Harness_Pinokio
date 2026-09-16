# AI Harness

Harness de IA local, 1-click via [Pinokio](https://pinokio.co): chat com o [Codex CLI](https://github.com/openai/codex) organizado por projetos/conversas, memória real persistida em SQLite (com extração automática pela própria IA após cada resposta) e um atlas neural 3D da memória.

- **Chat**: conversas agrupadas por projeto, cada projeto pode ter instruções próprias enviadas em toda mensagem.
- **Memória real, não só visual**: três escopos — geral, por projeto, por conversa. A cada mensagem o backend seleciona as memórias mais relevantes (conversa → projeto → geral) e injeta no prompt enviado ao Codex; depois de cada resposta, uma segunda chamada ao Codex extrai fatos/decisões relevantes da troca e salva como memória. Também dá para criar/editar/excluir memória manualmente.
- **Atlas 3D**: visualização WebGL da memória real (cai para uma demonstração sintética de 1.000 registros só enquanto não há memória real).
- **Local-first**: tudo roda em `127.0.0.1`; os dados ficam em `app/app/data/harness.db` (SQLite), nunca saem da máquina exceto pelas chamadas que o próprio Codex CLI já faz.

## Pré-requisito

[Codex CLI](https://github.com/openai/codex) instalado e autenticado no terminal (comando `codex` disponível no PATH). O AI Harness não lê nem copia tokens — ele reusa a sessão já autenticada do Codex CLI, chamando `codex exec --ephemeral --json`.

## Usar pelo Pinokio

1. **Install** — instala as dependências do backend e do frontend, e builda a interface.
2. **Start** — sobe o servidor local e abre a Web UI.
3. **Update** — `git pull` + reinstala dependências + rebuild. Não apaga conversas nem memórias.
4. **Reset** — remove `node_modules`/`dist` para reinstalar do zero. Também não apaga conversas nem memórias (elas ficam em `app/app/data/`, fora do que o reset toca).

## Rodar sem o Pinokio (desenvolvimento)

Veja `app/README.md` para instruções de desenvolvimento local (backend + `vite dev` para o frontend) e para os comandos de teste (`npm test`, `npm run test:memory`).

## API

O backend expõe uma API REST simples em `http://127.0.0.1:<porta>` (a porta é escolhida pelo Pinokio; em desenvolvimento local o padrão é `8787`). Sem autenticação — é local, pensado para um único usuário na própria máquina.

### Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Status e provedor configurado |
| GET / POST | `/api/projects` | Listar / criar projetos |
| GET / PATCH / DELETE | `/api/projects/:id` | Ler / atualizar / remover um projeto |
| GET / POST | `/api/conversations` | Listar (opcional `?projectId=`) / criar conversas |
| GET / PATCH / DELETE | `/api/conversations/:id` | Ler (com mensagens) / renomear / mover / remover |
| POST | `/api/conversations/:id/messages` | Enviar mensagem — roda o turno completo (Codex + extração de memória) |
| GET | `/api/memories` | Listar memórias (filtros: `scope`, `projectId`, `conversationId`, `kind`, `query`) |
| GET | `/api/memories/stats` | Contagem de memórias por escopo/tipo |
| POST | `/api/memories` | Criar memória manual |
| PATCH / DELETE | `/api/memories/:id` | Editar / remover memória |

### JavaScript

```javascript
const base = "http://127.0.0.1:8787";

const conversation = await fetch(`${base}/api/conversations`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ title: "Nova conversa" }),
}).then((r) => r.json());

const turn = await fetch(`${base}/api/conversations/${conversation.id}/messages`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ message: "Qual foi a última decisão que combinamos?" }),
}).then((r) => r.json());

console.log(turn.message.content, turn.memoryAccess, turn.memoryCreated);
```

### Python

```python
import requests

base = "http://127.0.0.1:8787"

conversation = requests.post(f"{base}/api/conversations", json={"title": "Nova conversa"}).json()

turn = requests.post(
    f"{base}/api/conversations/{conversation['id']}/messages",
    json={"message": "Qual foi a última decisão que combinamos?"},
).json()

print(turn["message"]["content"], turn["memoryAccess"], turn["memoryCreated"])
```

### curl

```bash
curl -s -X POST http://127.0.0.1:8787/api/conversations \
  -H "content-type: application/json" \
  -d '{"title":"Nova conversa"}'

curl -s -X POST http://127.0.0.1:8787/api/conversations/<id>/messages \
  -H "content-type: application/json" \
  -d '{"message":"Qual foi a última decisão que combinamos?"}'

curl -s "http://127.0.0.1:8787/api/memories?scope=global"
```

## Estrutura

```text
.
├── install.js / start.js / update.js / reset.js / pinokio.js / pinokio.json   # launcher Pinokio
└── app/                    # aplicação, self-contained
    ├── app/                  # backend (Node.js nativo + better-sqlite3)
    │   ├── server.js           # HTTP server + rotas REST
    │   ├── db.js                # schema SQLite e conexão
    │   ├── store.js             # acesso a dados (projetos/conversas/mensagens/memórias)
    │   ├── codex.js             # adaptador do Codex CLI
    │   └── memoryExtractor.js   # extração automática de memória por IA
    ├── frontend/              # React + TypeScript + Vite + Three.js
    └── test/                  # testes do backend (node --test)
```
