# Semgrep

Semgrep é um analisador estático de segurança (SAST) que roda na CI em todo pull request. Complementa o Biome: o Biome encontra problemas de qualidade de código, o Semgrep encontra padrões de segurança.

## Rulesets ativos

| Ruleset         | O que detecta                                               |
| --------------- | ----------------------------------------------------------- |
| `p/typescript`  | Problemas comuns em TypeScript                              |
| `p/nodejs`      | Prototype pollution, path traversal, injeção de comandos    |
| `p/jwt`         | JWT sem verificação de assinatura, algoritmos fracos        |
| `p/aws-lambda`  | Misconfigs comuns em funções Lambda                         |
| `p/secrets`     | Secrets e credenciais hardcoded no código                   |

## Rodar localmente antes do PR

Rode antes de abrir um PR para garantir que a CI não vai falhar.

### Opção 1 — Docker (sem instalar nada)

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep \
  semgrep scan --error \
    --config p/typescript \
    --config p/nodejs \
    --config p/jwt \
    --config p/aws-lambda \
    --config p/secrets
```

### Opção 2 — CLI via pip

```bash
pip install semgrep

semgrep scan --error \
  --config p/typescript \
  --config p/nodejs \
  --config p/jwt \
  --config p/aws-lambda \
  --config p/secrets
```

O flag `--error` faz o processo retornar código não-zero se encontrar findings — mesmo comportamento da CI.

## Ignorar arquivos

O arquivo `.semgrepignore` na raiz do repositório controla o que é ignorado (similar ao `.gitignore`). Por padrão estão excluídos: `node_modules/`, `dist/`, `.next/`, arquivos de teste e `*.d.ts`.

## CI

O workflow `.github/workflows/security.yml` roda automaticamente em todo pull request. Falha o PR se encontrar qualquer finding nos rulesets configurados.
