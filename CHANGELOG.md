# Changelog

## 1.4.0

### Novos recursos

- **Resource "User" (Usuários/Atendentes)** — novo recurso para listar e buscar atendentes da organização.
  - `List`: lista usuários com filtros opcionais (role, status, busca por nome/email). Retorna `id`, `name`, `email`, `role`, `status` e as equipes (`teams[]`) de cada atendente.
  - `Get`: obtém um usuário por ID.
  - Útil para descobrir o ID de um atendente e usá-lo em automações (ex.: atribuir lead/conversa).

- **Notas de Contato** (no resource Contact) — `Add Note`, `Get Notes`, `Update Note`, `Delete Note`.
- **Notas de Conversa** (novo resource Conversation) — `Add Note`, `Get Notes`, `Update Note`, `Delete Note` (notas internas).
  - Nas operações `Add Note` (contato e conversa) há um campo opcional **Author (User)** com dropdown de atendentes. Recomendado ao usar API token (o token não tem usuário próprio); se vazio, o primeiro admin da organização é usado como autor.

- **Atribuir lead a atendente** — o campo `Assigned To` do resource Card (em Create e Update) virou um **dropdown de atendentes** (antes era texto livre).

### Correções de bugs

- **Enviar mensagem por telefone voltou a funcionar**: o dropdown de canal (instância WhatsApp) apontava para uma rota inexistente (`/whatsapp-instances`) e ficava sempre vazio. Agora usa a rota correta (`/instances`).
- **Session "Get Many"**: corrigido erro "No endpoint resolved" ao listar sessões.
- **Contact "Get Many"**: os filtros de busca/paginação eram ignorados; agora são aplicados.
- **Pipeline "Create Custom Field"**: o toggle "Required" agora é respeitado.
- **Webhook "Create"**: o campo "Is Active" agora respeita o valor escolhido (antes ficava sempre ativo).

### Melhorias internas

- Dropdowns de usuários e etiquetas migrados para as rotas escopadas pelo token (`/api/users`, `/api/labels`), mais seguras e sem necessidade de `organizationId` no path. O dropdown de usuários agora também traz as equipes de cada atendente.

> Observação: a criação de notas de contato e de conversa via **API token** depende de um ajuste no backend do CRMax (resolução de autor da nota). Esse ajuste acompanha esta versão no servidor.

## 1.3.2

- Alinha envio de mensagem por telefone ao contrato canônico da API CRMax.

## 1.3.0

- Refatora mensagens (estilo WTS).

## 1.2.1

- Corrige contagem de etapas no dropdown de pipeline.

## 1.2.0

- Dropdowns dinâmicos para Pipelines, Stages, Users e Instances.

## 1.1.0

- Adiciona filtro por Contact ID e operação "Get by Contact".

## 1.0.0

- Versão inicial: nó completo do CRMax para n8n.
