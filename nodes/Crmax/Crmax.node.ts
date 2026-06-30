import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

import { cardOperations, cardFields } from './CardDescription';
import { contactOperations, contactFields } from './ContactDescription';
import { sessionOperations, sessionFields } from './SessionDescription';
import { messageOperations, messageFields } from './MessageDescription';
import { pipelineOperations, pipelineFields } from './PipelineDescription';
import { webhookOperations, webhookFields } from './WebhookDescription';
import { userOperations, userFields } from './UserDescription';
import { conversationOperations, conversationFields } from './ConversationDescription';

export class Crmax implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CRMax',
		name: 'crmax',
		icon: 'file:crmax.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'CRMax CRM - Gestão de Leads via WhatsApp',
		defaults: {
			name: 'CRMax',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'crmaxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Card',
						value: 'card',
						description: 'Gerenciar cards/leads no pipeline',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Gerenciar contatos',
					},
					{
						name: 'Conversation',
						value: 'conversation',
						description: 'Notas internas de conversas',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Listar usuários/atendentes da organização',
					},
					{
						name: 'Message',
						value: 'message',
						description: 'Enviar mensagens (texto, imagem, áudio, documento)',
					},
					{
						name: 'Pipeline',
						value: 'pipeline',
						description: 'Listar pipelines e etapas',
					},
					{
						name: 'Session',
						value: 'session',
						description: 'Gerenciar sessões de atendimento (Helena-style API)',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Gerenciar webhooks de saída',
					},
				],
				default: 'card',
			},
			// Card
			...cardOperations,
			...cardFields,
			// Contact
			...contactOperations,
			...contactFields,
			// Conversation
			...conversationOperations,
			...conversationFields,
			// User
			...userOperations,
			...userFields,
			// Session
			...sessionOperations,
			...sessionFields,
			// Message
			...messageOperations,
			...messageFields,
			// Pipeline
			...pipelineOperations,
			...pipelineFields,
			// Webhook
			...webhookOperations,
			...webhookFields,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			// Carregar pipelines
			async getPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = credentials.baseUrl as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/pipelines`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					for (const pipeline of response) {
						returnData.push({
							name: pipeline.name,
							value: pipeline.id,
							description: `${pipeline.stage_count || 0} etapas`,
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar etapas de um pipeline
			async getStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = credentials.baseUrl as string;
				const returnData: INodePropertyOptions[] = [];

				// Tenta pegar o pipelineId do contexto
				const pipelineId = this.getCurrentNodeParameter('pipelineId') as string;
				if (!pipelineId) {
					return [{ name: 'Selecione Um Pipeline Primeiro', value: '' }];
				}

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/pipelines/${pipelineId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					if (response.stages) {
						for (const stage of response.stages) {
							returnData.push({
								name: stage.name,
								value: stage.id,
							});
						}
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar usuários/atendentes da organização
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
				const returnData: INodePropertyOptions[] = [];

				try {
					// /api/users é escopado pelo token (não precisa de orgId no path) e
					// retorna { users: [...] } com as equipes de cada atendente.
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/users`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					const users = Array.isArray(response) ? response : response.users || [];
					for (const user of users) {
						returnData.push({
							name: user.name || user.email,
							value: user.id,
							description: user.role ? `${user.email} · ${user.role}` : user.email,
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar instâncias/canais WhatsApp
			async getInstances(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
				const organizationId = credentials.organizationId as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					// Rota correta é /instances (não /whatsapp-instances, que não existe na API).
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/organizations/${organizationId}/instances`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					const instances = Array.isArray(response) ? response : response.instances || [];
					for (const instance of instances) {
						returnData.push({
							name: instance.name || instance.instance_name,
							value: instance.id,
							description: instance.phone_number || instance.phone || 'Sem número',
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar labels/etiquetas
			async getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
				const returnData: INodePropertyOptions[] = [];

				try {
					// /api/labels é escopado pelo token (sem orgId no path).
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/labels`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					const labels = Array.isArray(response) ? response : response.labels || [];
					for (const label of labels) {
						returnData.push({
							name: label.name,
							value: label.id,
							description: label.color || '',
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar equipes
			async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = credentials.baseUrl as string;
				const organizationId = credentials.organizationId as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/organizations/${organizationId}/teams`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					for (const team of response) {
						returnData.push({
							name: team.name,
							value: team.id,
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('crmaxApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
		const organizationId = credentials.organizationId as string;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject = {};
				const qs: IDataObject = {};

				// ==================== CARD ====================
				if (resource === 'card') {
					if (operation === 'create') {
						method = 'POST';
						endpoint = `/api/organizations/${organizationId}/cards`;
						body = {
							pipelineId: this.getNodeParameter('pipelineId', i) as string,
							stageId: this.getNodeParameter('stageId', i) as string,
							title: this.getNodeParameter('title', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						if (additionalFields.phone) body.phone = additionalFields.phone;
						if (additionalFields.email) body.email = additionalFields.email;
						if (additionalFields.origin) body.origin = additionalFields.origin;
						if (additionalFields.value) body.value = additionalFields.value;
						if (additionalFields.scheduledDate) body.scheduledDate = additionalFields.scheduledDate;
						if (additionalFields.assignedTo) body.assignedTo = additionalFields.assignedTo;
						if (additionalFields.notes) body.notes = additionalFields.notes;
						if (additionalFields.contactId) body.contactId = additionalFields.contactId;
						if (additionalFields.dynamicFields) {
							try {
								body.dynamicFields = JSON.parse(additionalFields.dynamicFields as string);
							} catch {
								body.dynamicFields = additionalFields.dynamicFields;
							}
						}
					} else if (operation === 'get') {
						method = 'GET';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}`;
					} else if (operation === 'getMany') {
						method = 'GET';
						endpoint = '/api/cards';
						qs.pipelineId = this.getNodeParameter('pipelineId', i) as string;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						// Filtros básicos
						if (filters.contactId) qs.contactId = filters.contactId;
						if (filters.stageId) qs.stageId = filters.stageId;
						if (filters.assignedTo) qs.assignedTo = filters.assignedTo;
						if (filters.status) qs.status = filters.status;
						if (filters.includeArchived) qs.includeArchived = 'true';
						if (filters.textFilter) qs.textFilter = filters.textFilter;
						if (filters.origin) qs.origin = filters.origin;
						if (filters.labelId) qs.labelId = filters.labelId;
						// Filtros de data
						if (filters.createdAtAfter) qs.createdAtAfter = filters.createdAtAfter;
						if (filters.createdAtBefore) qs.createdAtBefore = filters.createdAtBefore;
						if (filters.updatedAtAfter) qs.updatedAtAfter = filters.updatedAtAfter;
						if (filters.updatedAtBefore) qs.updatedAtBefore = filters.updatedAtBefore;
						if (filters.scheduledDateAfter) qs.scheduledDateAfter = filters.scheduledDateAfter;
						if (filters.scheduledDateBefore) qs.scheduledDateBefore = filters.scheduledDateBefore;
						// Filtros de valor
						if (filters.valueMin) qs.valueMin = filters.valueMin;
						if (filters.valueMax) qs.valueMax = filters.valueMax;
						// Incluir detalhes
						if (filters.includeDetails && Array.isArray(filters.includeDetails)) {
							qs.includeDetails = (filters.includeDetails as string[]).join(',');
						}
						// Ordenação
						if (filters.orderBy) qs.orderBy = filters.orderBy;
						if (filters.orderDirection) qs.orderDirection = filters.orderDirection;
						// Paginação
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i, 50) as number;
							qs.pageNumber = filters.pageNumber || 1;
						} else {
							qs.pageSize = 100;
						}
					} else if (operation === 'getByContact') {
						method = 'GET';
						endpoint = '/api/cards';
						qs.contactId = this.getNodeParameter('contactId', i) as string;
						const pipelineId = this.getNodeParameter('pipelineId', i, '') as string;
						if (pipelineId) qs.pipelineId = pipelineId;
						const includeArchived = this.getNodeParameter('includeArchived', i, false) as boolean;
						if (includeArchived) qs.includeArchived = 'true';
						qs.pageSize = 100;
					} else if (operation === 'update') {
						method = 'PATCH';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}`;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						Object.assign(body, updateFields);
					} else if (operation === 'archive') {
						method = 'PATCH';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}/archive`;
						body.archive = this.getNodeParameter('archive', i) as boolean;
					} else if (operation === 'moveStage') {
						method = 'PATCH';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}`;
						body.stageId = this.getNodeParameter('stageId', i) as string;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}`;
					} else if (operation === 'addNote') {
						method = 'POST';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}/notes`;
						body.content = this.getNodeParameter('content', i) as string;
					} else if (operation === 'getNotes') {
						method = 'GET';
						const cardId = this.getNodeParameter('cardId', i) as string;
						endpoint = `/api/cards/${cardId}/notes`;
					}
				}

				// ==================== CONTACT ====================
				else if (resource === 'contact') {
					if (operation === 'create') {
						method = 'POST';
						endpoint = '/api/contacts';
						body.phone = this.getNodeParameter('phone', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						if (additionalFields.name) body.name = additionalFields.name;
						if (additionalFields.email) body.email = additionalFields.email;
						if (additionalFields.source) body.source = additionalFields.source;
					} else if (operation === 'get') {
						method = 'GET';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}`;
					} else if (operation === 'getByPhone') {
						method = 'GET';
						const phone = this.getNodeParameter('phone', i) as string;
						endpoint = `/api/contacts/phone/${phone}`;
					} else if (operation === 'getMany') {
						method = 'GET';
						endpoint = '/api/contacts';
						// A collection no description chama-se 'additionalFields'.
						const filters = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						if (filters.search) qs.search = filters.search;
						if (filters.pageNumber) qs.pageNumber = filters.pageNumber;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i, 50) as number;
						} else if (filters.pageSize) {
							qs.pageSize = filters.pageSize;
						}
					} else if (operation === 'update') {
						method = 'PUT';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}`;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						Object.assign(body, updateFields);
					} else if (operation === 'updateByPhone') {
						method = 'PUT';
						const phone = this.getNodeParameter('phone', i) as string;
						endpoint = `/api/contacts/phone/${phone}`;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						Object.assign(body, updateFields);
					} else if (operation === 'batchCreateUpdate') {
						method = 'POST';
						endpoint = '/api/contacts/batch';
						const contactsJson = this.getNodeParameter('contacts', i) as string;
						body.contacts = JSON.parse(contactsJson);
					} else if (operation === 'updateTags') {
						method = 'PUT';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}/tags`;
						const tagsJson = this.getNodeParameter('tags', i) as string;
						body.tags = JSON.parse(tagsJson);
					} else if (operation === 'updateCustomFields') {
						method = 'PUT';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}/custom-fields`;
						const customFieldsJson = this.getNodeParameter('customFields', i) as string;
						body.customFields = JSON.parse(customFieldsJson);
					} else if (operation === 'addNote') {
						method = 'POST';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}/notes`;
						body.content = this.getNodeParameter('content', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						if (userId) body.userId = userId;
					} else if (operation === 'getNotes') {
						method = 'GET';
						const contactId = this.getNodeParameter('contactId', i) as string;
						endpoint = `/api/contacts/${contactId}/notes`;
					} else if (operation === 'updateNote') {
						method = 'PUT';
						const contactId = this.getNodeParameter('contactId', i) as string;
						const noteId = this.getNodeParameter('noteId', i) as string;
						endpoint = `/api/contacts/${contactId}/notes/${noteId}`;
						body.content = this.getNodeParameter('content', i) as string;
					} else if (operation === 'deleteNote') {
						method = 'DELETE';
						const contactId = this.getNodeParameter('contactId', i) as string;
						const noteId = this.getNodeParameter('noteId', i) as string;
						endpoint = `/api/contacts/${contactId}/notes/${noteId}`;
					}
				}

				// ==================== CONVERSATION ====================
				else if (resource === 'conversation') {
					if (operation === 'addNote') {
						method = 'POST';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						endpoint = `/api/conversations/${conversationId}/notes`;
						body.content = this.getNodeParameter('content', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						if (userId) body.userId = userId;
					} else if (operation === 'getNotes') {
						method = 'GET';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						endpoint = `/api/conversations/${conversationId}/notes`;
					} else if (operation === 'updateNote') {
						method = 'PUT';
						const noteId = this.getNodeParameter('noteId', i) as string;
						endpoint = `/api/notes/${noteId}`;
						body.content = this.getNodeParameter('content', i) as string;
					} else if (operation === 'deleteNote') {
						method = 'DELETE';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						const noteId = this.getNodeParameter('noteId', i) as string;
						endpoint = `/api/conversations/${conversationId}/notes/${noteId}`;
					} else if (operation === 'assign') {
						method = 'POST';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						endpoint = `/api/conversations/${conversationId}/assign`;
						body.userId = this.getNodeParameter('userId', i) as string;
						const teamId = this.getNodeParameter('teamId', i, '') as string;
						if (teamId) body.teamId = teamId;
					} else if (operation === 'transfer') {
						method = 'POST';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						endpoint = `/api/conversations/${conversationId}/transfer`;
						const toUserId = this.getNodeParameter('toUserId', i, '') as string;
						const toTeamId = this.getNodeParameter('toTeamId', i, '') as string;
						const reason = this.getNodeParameter('reason', i, '') as string;
						if (toUserId) body.toUserId = toUserId;
						if (toTeamId) body.toTeamId = toTeamId;
						if (reason) body.reason = reason;
					} else if (operation === 'toggleAi') {
						method = 'PATCH';
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						endpoint = `/api/conversations/${conversationId}/ai`;
						body.enabled = this.getNodeParameter('aiEnabled', i) as boolean;
					}
				}

				// ==================== USER ====================
				else if (resource === 'user') {
					if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/users';
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (filters.role) qs.role = filters.role;
						if (filters.status) qs.status = filters.status;
						if (filters.search) qs.search = filters.search;
					} else if (operation === 'get') {
						method = 'GET';
						const userId = this.getNodeParameter('userId', i) as string;
						endpoint = `/api/users/${userId}`;
					}
				}

				// ==================== SESSION ====================
				else if (resource === 'session') {
					// O description usa value 'getAll'; aceitamos ambos por compatibilidade.
					if (operation === 'getAll' || operation === 'getMany') {
						method = 'GET';
						endpoint = '/api/sessions';
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (filters.status) qs.status = filters.status;
						if (filters.contactId) qs.contactId = filters.contactId;
						if (filters.channelId) qs.channelId = filters.channelId;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						if (!returnAll) {
							qs.limit = this.getNodeParameter('limit', i, 50) as number;
						}
					} else if (operation === 'get') {
						method = 'GET';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}`;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						Object.assign(body, updateFields);
					} else if (operation === 'getMessages') {
						method = 'GET';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}/messages`;
					} else if (operation === 'sendText') {
						method = 'POST';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}/messages/text`;
						body.text = this.getNodeParameter('text', i) as string;
					} else if (operation === 'close') {
						method = 'POST';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}/close`;
					} else if (operation === 'transfer') {
						method = 'POST';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}/transfer`;
						const transferTo = this.getNodeParameter('transferTo', i, {}) as IDataObject;
						if (transferTo.departmentId) body.departmentId = transferTo.departmentId;
						if (transferTo.userId) body.userId = transferTo.userId;
					}
				}

				// ==================== MESSAGE ====================
				else if (resource === 'message') {
					if (operation === 'sendTextBySession') {
						// Enviar texto por Session ID (igual WTS)
						method = 'POST';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						endpoint = `/api/sessions/${sessionId}/messages/text`;
						body.text = this.getNodeParameter('message', i) as string;
					} else if (operation === 'sendTextByPhone') {
						// Enviar texto por telefone + instância
						method = 'POST';
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						endpoint = options.sync ? '/api/messages/send-sync' : '/api/messages/send';
						// Contrato canônico da API CRMax: number/instanceName/text.
						// instanceId é o UUID do dropdown — a rota resolve UUID -> instance_name.
						body = {
							number: this.getNodeParameter('phone', i) as string,
							instanceId: this.getNodeParameter('instanceId', i) as string,
							text: this.getNodeParameter('message', i) as string,
						};
					} else if (operation === 'sendFileBySession') {
						// Enviar arquivo por Session ID
						method = 'POST';
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						const fileType = this.getNodeParameter('fileType', i) as string;
						endpoint = `/api/sessions/${sessionId}/messages/${fileType}`;
						body.mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
						const caption = this.getNodeParameter('caption', i, '') as string;
						if (caption) body.caption = caption;
						const fileName = this.getNodeParameter('fileName', i, '') as string;
						if (fileName) body.fileName = fileName;
					} else if (operation === 'sendFileByPhone') {
						// Enviar arquivo por telefone + instância
						method = 'POST';
						endpoint = '/api/messages/send';
						const fileType = this.getNodeParameter('fileType', i) as string;
						// Contrato canônico da API CRMax: number/instanceName/mediaType/media.
						// instanceId é o UUID do dropdown — a rota resolve UUID -> instance_name.
						body = {
							number: this.getNodeParameter('phone', i) as string,
							instanceId: this.getNodeParameter('instanceId', i) as string,
							mediaType: fileType,
							media: this.getNodeParameter('mediaUrl', i) as string,
						};
						const caption = this.getNodeParameter('caption', i, '') as string;
						if (caption) body.caption = caption;
						const fileName = this.getNodeParameter('fileName', i, '') as string;
						if (fileName) body.fileName = fileName;
					} else if (operation === 'getStatus') {
						method = 'GET';
						const messageId = this.getNodeParameter('messageId', i) as string;
						endpoint = `/api/messages/${messageId}/status`;
					}
				}

				// ==================== PIPELINE ====================
				else if (resource === 'pipeline') {
					if (operation === 'getMany') {
						method = 'GET';
						endpoint = '/api/pipelines';
					} else if (operation === 'get') {
						method = 'GET';
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;
						endpoint = `/api/pipelines/${pipelineId}`;
					} else if (operation === 'getCustomFields') {
						method = 'GET';
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;
						endpoint = `/api/pipelines/${pipelineId}/custom-fields`;
					} else if (operation === 'createCustomField') {
						method = 'POST';
						const pipelineId = this.getNodeParameter('pipelineId', i) as string;
						endpoint = `/api/pipelines/${pipelineId}/custom-fields`;
						body = {
							name: this.getNodeParameter('name', i) as string,
							fieldType: this.getNodeParameter('fieldType', i) as string,
						};
						const options = this.getNodeParameter('options', i, []) as string[];
						if (options.length > 0) body.options = options;
						const isRequired = this.getNodeParameter('required', i, false) as boolean;
						if (isRequired) body.isRequired = isRequired;
					}
				}

				// ==================== WEBHOOK ====================
				else if (resource === 'webhook') {
					if (operation === 'create') {
						method = 'POST';
						endpoint = '/api/webhooks';
						body = {
							name: this.getNodeParameter('name', i) as string,
							url: this.getNodeParameter('url', i) as string,
							events: this.getNodeParameter('events', i) as string[],
						};
						// isActive vive dentro da collection additionalFields no description.
						const webhookAdditional = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						body.isActive = webhookAdditional.isActive !== undefined ? webhookAdditional.isActive : true;
					} else if (operation === 'getMany') {
						method = 'GET';
						endpoint = '/api/webhooks';
					} else if (operation === 'get') {
						method = 'GET';
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint = `/api/webhooks/${webhookId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint = `/api/webhooks/${webhookId}`;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						Object.assign(body, updateFields);
					} else if (operation === 'delete') {
						method = 'DELETE';
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint = `/api/webhooks/${webhookId}`;
					} else if (operation === 'test') {
						method = 'POST';
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint = `/api/webhooks/${webhookId}/test`;
					} else if (operation === 'getDeliveries') {
						method = 'GET';
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						endpoint = `/api/webhooks/${webhookId}/deliveries`;
					} else if (operation === 'retryDelivery') {
						method = 'POST';
						const deliveryId = this.getNodeParameter('deliveryId', i) as string;
						endpoint = `/api/webhook-deliveries/${deliveryId}/retry`;
					}
				}

				// Validate endpoint was set
				if (!endpoint) {
					throw new Error(`No endpoint resolved for resource=${resource}, operation=${operation}. Please check your node configuration.`);
				}

				// Make API request
				const options: IDataObject = {
					method,
					url: `${baseUrl}${endpoint}`,
					json: true,
				};

				// Add body for POST/PUT/PATCH
				if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length > 0) {
					options.body = body;
				}

				// Add query string if not empty
				if (Object.keys(qs).length > 0) {
					options.qs = qs;
				}

				responseData = await this.helpers.requestWithAuthentication.call(
					this,
					'crmaxApi',
					options,
				);

				// Handle array responses
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item })));
				} else if (responseData.items && Array.isArray(responseData.items)) {
					// Paginated response
					returnData.push(...responseData.items.map((item: unknown) => ({ json: item })));
				} else if (responseData.users && Array.isArray(responseData.users)) {
					// Wrapped list (ex.: GET /api/users -> { users: [...] })
					returnData.push(...responseData.users.map((item: unknown) => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
