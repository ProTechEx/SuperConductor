import { ResourceAny } from '@/models/resource/resource'

export enum ItemTypes {
	RESOURCE_ITEM = 'resource_item',
	PART_ITEM = 'part_item',
}

export interface ResourceItem {
	resource: ResourceAny
}
