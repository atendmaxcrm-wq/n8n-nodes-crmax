# n8n-nodes-crmax

![CRMax](https://painel.crmax.com.br/crmax-logo.svg)

Nó customizado para integração do **CRMax CRM** com **n8n**.

## Sobre o CRMax

CRMax é um CRM de gestão de leads via WhatsApp com integração Meta/Google Ads, pipelines de vendas, métricas em tempo real e IA para análises.

## Instalação

### Em instância self-hosted

```bash
# Navegue até a pasta de custom nodes
cd ~/.n8n/custom

# Clone o repositório
git clone https://github.com/crmax/n8n-nodes-crmax.git
cd n8n-nodes-crmax

# Instale dependências e faça o build
npm install
npm run build

# Link o pacote
npm link
```

Depois reinicie o n8n.

## Configuração

1. No n8n, vá em **Credentials** > **New**
2. Procure por **CRMax API**
3. Preencha:
   - **API Token**: Token gerado em CRMax > Configurações > API Tokens (formato: `crmax_xxx`)
   - **Base URL**: `https://painel.crmax.com.br` (ou sua instância)
   - **Organization ID**: UUID da sua organização

## Recursos Disponíveis

### 📋 Cards (Leads)

| Operação | Descrição |
|----------|-----------|
| **Create** | Criar novo card no pipeline |
| **Get** | Obter card por ID |
| **Get Many** | Listar cards com filtros |
| **Update** | Atualizar card |
| **Archive** | Arquivar/desarquivar card |
| **Move Stage** | Mover card para outra etapa |
| **Delete** | Excluir card |
| **Add Note** | Adicionar anotação |
| **Get Notes** | Listar anotações |

### 👤 Contacts

| Operação | Descrição |
|----------|-----------|
| **Create** | Criar contato |
| **Get** | Obter por ID |
| **Get by Phone** | Obter por telefone |
| **Get Many** | Listar contatos |
| **Update** | Atualizar contato |
| **Update by Phone** | Atualizar por telefone |
| **Batch Create/Update** | Criar/atualizar em massa |
| **Update Tags** | Atualizar tags |
| **Update Custom Fields** | Atualizar campos personalizados |

### 💬 Messages

| Operação | Descrição |
|----------|-----------|
| **Send Text** | Enviar mensagem de texto |
| **Send Text Sync** | Enviar texto (aguarda status) |
| **Send Image** | Enviar imagem |
| **Send Audio** | Enviar áudio |
| **Send Document** | Enviar documento |
| **Send via Conversation** | Enviar em conversa existente |
| **Send via Conversation Sync** | Enviar em conversa (aguarda status) |
| **Get Status** | Obter status da mensagem |

### 🎯 Sessions (Helena-style API)

| Operação | Descrição |
|----------|-----------|
| **Get Many** | Listar sessões |
| **Get** | Obter sessão |
| **Update** | Atualizar sessão |
| **Get Messages** | Obter mensagens da sessão |
| **Send Text** | Enviar texto via sessão |
| **Close** | Fechar sessão |
| **Transfer** | Transferir sessão |

### 📊 Pipelines

| Operação | Descrição |
|----------|-----------|
| **Get Many** | Listar pipelines |
| **Get** | Obter pipeline |
| **Get Custom Fields** | Listar campos personalizados |
| **Create Custom Field** | Criar campo personalizado |

### 🔗 Webhooks

| Operação | Descrição |
|----------|-----------|
| **Create** | Criar webhook |
| **Get Many** | Listar webhooks |
| **Get** | Obter webhook |
| **Update** | Atualizar webhook |
| **Delete** | Excluir webhook |
| **Test** | Testar webhook |
| **Get Deliveries** | Ver histórico de entregas |
| **Retry Delivery** | Reenviar entrega falhada |

## Exemplos de Uso

### Criar lead automaticamente

```
Trigger: Webhook (recebe dados do formulário)
    ↓
CRMax: Create Card
    - Pipeline ID: {{$json.pipelineId}}
    - Stage ID: {{$json.stageId}}
    - Title: {{$json.nome}}
    - Phone: {{$json.telefone}}
    - Origin: "Formulário Site"
```

### Enviar mensagem de boas-vindas

```
Trigger: CRMax Webhook (lead.created)
    ↓
CRMax: Send Text
    - Phone: {{$json.contact.phone}}
    - Instance ID: {{$json.instanceId}}
    - Message: "Olá {{$json.contact.name}}! Obrigado pelo contato..."
```

### Mover card após resposta

```
Trigger: CRMax Webhook (message.received)
    ↓
IF: Primeira mensagem?
    ↓ Yes
CRMax: Move Stage
    - Card ID: {{$json.cardId}}
    - Stage ID: "uuid-da-etapa-respondeu"
```

## Eventos de Webhook Disponíveis

- `message.received` - Mensagem recebida
- `message.sent` - Mensagem enviada
- `lead.created` - Lead criado
- `lead.updated` - Lead atualizado
- `lead.moved` - Lead movido de etapa
- `session.new` - Nova sessão
- `session.complete` - Sessão finalizada
- `deal.won` - Negócio ganho
- `deal.lost` - Negócio perdido
- E mais 17 eventos...

## Suporte

- **Documentação API**: https://painel.crmax.com.br/api/reference
- **Email**: contato@crmax.com.br

## Licença

MIT
