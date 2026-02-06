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
					return [{ name: 'Selecione um pipeline primeiro', value: '' }];
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

			// Carregar usuários da organização
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = credentials.baseUrl as string;
				const organizationId = credentials.organizationId as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/organizations/${organizationId}/users`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					for (const user of response) {
						returnData.push({
							name: user.name || user.email,
							value: user.id,
							description: user.email,
						});
					}
				} catch (error) {
					// Retorna lista vazia se der erro
				}

				return returnData;
			},

			// Carregar instâncias WhatsApp
			async getInstances(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('crmaxApi');
				const baseUrl = credentials.baseUrl as string;
				const organizationId = credentials.organizationId as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/organizations/${organizationId}/whatsapp-instances`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					for (const instance of response) {
						returnData.push({
							name: instance.name || instance.instance_name,
							value: instance.id,
							description: instance.phone || 'Sem número',
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
				const baseUrl = credentials.baseUrl as string;
				const organizationId = credentials.organizationId as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/organizations/${organizationId}/labels`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					for (const label of response) {
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
		const baseUrl = credentials.baseUrl as string;
		const organizationId = credentials.organizationId as string;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject = {};
				let qs: IDataObject = {};

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
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (filters.search) qs.search = filters.search;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i, 50) as number;
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
					}
				}

				// ==================== SESSION ====================
				else if (resource === 'session') {
					if (operation === 'getMany') {
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
						body = {
							phone: this.getNodeParameter('phone', i) as string,
							instanceId: this.getNodeParameter('instanceId', i) as string,
							message: this.getNodeParameter('message', i) as string,
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
						body = {
							phone: this.getNodeParameter('phone', i) as string,
							instanceId: this.getNodeParameter('instanceId', i) as string,
							mediaType: fileType,
							mediaUrl: this.getNodeParameter('mediaUrl', i) as string,
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
						const isRequired = this.getNodeParameter('isRequired', i, false) as boolean;
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
						const isActive = this.getNodeParameter('isActive', i, true) as boolean;
						body.isActive = isActive;
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
