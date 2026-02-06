import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single pipeline with stages',
				action: 'Get a pipeline',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all pipelines for the organization',
				action: 'Get many pipelines',
			},
			{
				name: 'Get Custom Fields',
				value: 'getCustomFields',
				description: 'List custom fields defined for a pipeline',
				action: 'Get custom fields from a pipeline',
			},
			{
				name: 'Create Custom Field',
				value: 'createCustomField',
				description: 'Create a new custom field for a pipeline',
				action: 'Create a custom field for a pipeline',
			},
		],
		default: 'getMany',
	},
];

export const pipelineFields: INodeProperties[] = [
	// ----------------------------------
	//         pipeline:get
	// ----------------------------------
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the pipeline to retrieve',
	},

	// ----------------------------------
	//    pipeline:getCustomFields
	// ----------------------------------
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['getCustomFields'],
			},
		},
		default: '',
		description: 'The ID of the pipeline to get custom fields from',
	},

	// ----------------------------------
	//   pipeline:createCustomField
	// ----------------------------------
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createCustomField'],
			},
		},
		default: '',
		description: 'The ID of the pipeline to create custom field for',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createCustomField'],
			},
		},
		default: '',
		description: 'The display name of the custom field',
	},
	{
		displayName: 'Field Type',
		name: 'fieldType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createCustomField'],
			},
		},
		options: [
			{
				name: 'Text',
				value: 'text',
			},
			{
				name: 'Number',
				value: 'number',
			},
			{
				name: 'Date',
				value: 'date',
			},
			{
				name: 'Select',
				value: 'select',
			},
			{
				name: 'Checkbox',
				value: 'checkbox',
			},
		],
		default: 'text',
		description: 'The type of the custom field',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createCustomField'],
				fieldType: ['select'],
			},
		},
		default: [],
		description: 'Options for select field type (comma-separated)',
	},
	{
		displayName: 'Required',
		name: 'required',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createCustomField'],
			},
		},
		default: false,
		description: 'Whether the field is required',
	},
];
