import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook',
				action: 'Get a webhook',
			},
			{
				name: 'Get Deliveries',
				value: 'getDeliveries',
				description: 'Get webhook delivery history',
				action: 'Get webhook deliveries',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many webhooks',
				action: 'Get many webhooks',
			},
			{
				name: 'Retry Delivery',
				value: 'retryDelivery',
				description: 'Retry a failed webhook delivery',
				action: 'Retry a webhook delivery',
			},
			{
				name: 'Test',
				value: 'test',
				description: 'Send a test payload to the webhook',
				action: 'Test a webhook',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
			},
		],
		default: 'getMany',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the webhook',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'The endpoint URL to receive webhooks',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			// Message Events
			{
				name: 'Message Received',
				value: 'message.received',
				description: 'Triggered when a message is received',
			},
			{
				name: 'Message Sent',
				value: 'message.sent',
				description: 'Triggered when a message is sent',
			},
			{
				name: 'Message Updated',
				value: 'message.updated',
				description: 'Triggered when a message is updated',
			},
			// Lead Events
			{
				name: 'Lead Created',
				value: 'lead.created',
				description: 'Triggered when a lead is created',
			},
			{
				name: 'Lead Updated',
				value: 'lead.updated',
				description: 'Triggered when a lead is updated',
			},
			{
				name: 'Lead Moved',
				value: 'lead.moved',
				description: 'Triggered when a lead is moved between stages',
			},
			{
				name: 'Lead Deleted',
				value: 'lead.deleted',
				description: 'Triggered when a lead is deleted',
			},
			{
				name: 'Lead Assigned',
				value: 'lead.assigned',
				description: 'Triggered when a lead is assigned to a user',
			},
			// Conversation Events
			{
				name: 'Conversation Started',
				value: 'conversation.started',
				description: 'Triggered when a conversation is started',
			},
			{
				name: 'Conversation Closed',
				value: 'conversation.closed',
				description: 'Triggered when a conversation is closed',
			},
			{
				name: 'Conversation Transferred',
				value: 'conversation.transferred',
				description: 'Triggered when a conversation is transferred',
			},
			// Session Events
			{
				name: 'Session New',
				value: 'session.new',
				description: 'Triggered when a new session is created',
			},
			{
				name: 'Session Update',
				value: 'session.update',
				description: 'Triggered when a session is updated',
			},
			{
				name: 'Session Complete',
				value: 'session.complete',
				description: 'Triggered when a session is completed',
			},
			// Contact Events
			{
				name: 'Contact Created',
				value: 'contact.created',
				description: 'Triggered when a contact is created',
			},
			{
				name: 'Contact Updated',
				value: 'contact.updated',
				description: 'Triggered when a contact is updated',
			},
			{
				name: 'Contact Tagged',
				value: 'contact.tagged',
				description: 'Triggered when a contact is tagged',
			},
			{
				name: 'Contact Tag Update',
				value: 'contact.tag_update',
				description: 'Triggered when contact tags are updated',
			},
			// Card Note Events
			{
				name: 'Card Note New',
				value: 'card.note_new',
				description: 'Triggered when a new note is added to a card',
			},
			{
				name: 'Card Note Update',
				value: 'card.note_update',
				description: 'Triggered when a card note is updated',
			},
			// Payment Events
			{
				name: 'Payment New',
				value: 'payment.new',
				description: 'Triggered when a new payment is created',
			},
			{
				name: 'Payment Update',
				value: 'payment.update',
				description: 'Triggered when a payment is updated',
			},
			// Deal Events
			{
				name: 'Deal Won',
				value: 'deal.won',
				description: 'Triggered when a deal is won',
			},
			{
				name: 'Deal Lost',
				value: 'deal.lost',
				description: 'Triggered when a deal is lost',
			},
			{
				name: 'Deal Scheduled',
				value: 'deal.scheduled',
				description: 'Triggered when a deal is scheduled',
			},
			{
				name: 'Deal Shown',
				value: 'deal.shown',
				description: 'Triggered when a deal is shown',
			},
		],
		default: [],
		description: 'The events that trigger this webhook',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
		],
	},

	// ----------------------------------
	//         webhook:update
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update', 'get', 'delete', 'test', 'getDeliveries'],
			},
		},
		default: '',
		description: 'The ID of the webhook',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the webhook',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/webhook',
				description: 'The endpoint URL to receive webhooks',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					// Message Events
					{
						name: 'Message Received',
						value: 'message.received',
						description: 'Triggered when a message is received',
					},
					{
						name: 'Message Sent',
						value: 'message.sent',
						description: 'Triggered when a message is sent',
					},
					{
						name: 'Message Updated',
						value: 'message.updated',
						description: 'Triggered when a message is updated',
					},
					// Lead Events
					{
						name: 'Lead Created',
						value: 'lead.created',
						description: 'Triggered when a lead is created',
					},
					{
						name: 'Lead Updated',
						value: 'lead.updated',
						description: 'Triggered when a lead is updated',
					},
					{
						name: 'Lead Moved',
						value: 'lead.moved',
						description: 'Triggered when a lead is moved between stages',
					},
					{
						name: 'Lead Deleted',
						value: 'lead.deleted',
						description: 'Triggered when a lead is deleted',
					},
					{
						name: 'Lead Assigned',
						value: 'lead.assigned',
						description: 'Triggered when a lead is assigned to a user',
					},
					// Conversation Events
					{
						name: 'Conversation Started',
						value: 'conversation.started',
						description: 'Triggered when a conversation is started',
					},
					{
						name: 'Conversation Closed',
						value: 'conversation.closed',
						description: 'Triggered when a conversation is closed',
					},
					{
						name: 'Conversation Transferred',
						value: 'conversation.transferred',
						description: 'Triggered when a conversation is transferred',
					},
					// Session Events
					{
						name: 'Session New',
						value: 'session.new',
						description: 'Triggered when a new session is created',
					},
					{
						name: 'Session Update',
						value: 'session.update',
						description: 'Triggered when a session is updated',
					},
					{
						name: 'Session Complete',
						value: 'session.complete',
						description: 'Triggered when a session is completed',
					},
					// Contact Events
					{
						name: 'Contact Created',
						value: 'contact.created',
						description: 'Triggered when a contact is created',
					},
					{
						name: 'Contact Updated',
						value: 'contact.updated',
						description: 'Triggered when a contact is updated',
					},
					{
						name: 'Contact Tagged',
						value: 'contact.tagged',
						description: 'Triggered when a contact is tagged',
					},
					{
						name: 'Contact Tag Update',
						value: 'contact.tag_update',
						description: 'Triggered when contact tags are updated',
					},
					// Card Note Events
					{
						name: 'Card Note New',
						value: 'card.note_new',
						description: 'Triggered when a new note is added to a card',
					},
					{
						name: 'Card Note Update',
						value: 'card.note_update',
						description: 'Triggered when a card note is updated',
					},
					// Payment Events
					{
						name: 'Payment New',
						value: 'payment.new',
						description: 'Triggered when a new payment is created',
					},
					{
						name: 'Payment Update',
						value: 'payment.update',
						description: 'Triggered when a payment is updated',
					},
					// Deal Events
					{
						name: 'Deal Won',
						value: 'deal.won',
						description: 'Triggered when a deal is won',
					},
					{
						name: 'Deal Lost',
						value: 'deal.lost',
						description: 'Triggered when a deal is lost',
					},
					{
						name: 'Deal Scheduled',
						value: 'deal.scheduled',
						description: 'Triggered when a deal is scheduled',
					},
					{
						name: 'Deal Shown',
						value: 'deal.shown',
						description: 'Triggered when a deal is shown',
					},
				],
				default: [],
				description: 'The events that trigger this webhook',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
		],
	},

	// ----------------------------------
	//         webhook:retryDelivery
	// ----------------------------------
	{
		displayName: 'Delivery ID',
		name: 'deliveryId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['retryDelivery'],
			},
		},
		default: '',
		description: 'The ID of the webhook delivery to retry',
	},
];
