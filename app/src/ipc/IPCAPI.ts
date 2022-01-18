import { BridgeStatus } from '@/models/project/Bridge'
import { Project } from '@/models/project/Project'
import { ResourceAny } from '@/models/resource/resource'
import { Rundown } from '@/models/rundown/Rundown'
import { Resources } from '@/react/contexts/Resources'

/** Methods that can be called on the server, by the client */
export interface IPCServerMethods {
	triggerSendAll: () => Promise<void>
	triggerSendRundown: (data: { rundownId: string }) => Promise<void>

	playPart: (data: { rundownId: string; groupId: string; partId: string }) => Promise<void>
	queuePartGroup: (data: { rundownId: string; groupId: string; partId: string }) => Promise<void>
	unqueuePartGroup: (data: { rundownId: string; groupId: string; partId: string }) => Promise<void>
	stopGroup: (data: { rundownId: string; groupId: string }) => Promise<void>
	newPart: (data: {
		rundownId: string
		/** The group to create the part into. If null; will create a "transparent group" */
		groupId: string | null

		name: string
	}) => Promise<string>
	newGroup: (data: { rundownId: string; name: string }) => Promise<string>
	deletePart: (data: { rundownId: string; groupId: string; partId: string }) => Promise<void>
	deleteGroup: (data: { rundownId: string; groupId: string }) => Promise<void>
	movePart: (data: {
		from: { rundownId: string; groupId: string; partId: string }
		to: { rundownId: string; groupId: string; position: number }
	}) => Promise<void>
	ungroupPart: (data: { rundownId: string; groupId: string; partId: string }) => Promise<void>

	updateTimelineObj: (data: {
		rundownId: string
		groupId: string
		partId: string

		timelineObjId: string
		enableStart: number
		enableDuration: number
		layer: string | number
	}) => Promise<void>
	deleteTimelineObj: (data: {
		rundownId: string
		groupId: string
		partId: string

		timelineObjId: string
	}) => Promise<void>
	addResourceToTimeline: (data: {
		rundownId: string
		groupId: string
		partId: string

		layerId: string
		resourceId: string
	}) => Promise<void>

	newTemplateData: (data: {
		rundownId: string
		groupId: string
		partId: string

		timelineObjId: string
	}) => Promise<void>
	updateTemplateData: (data: {
		rundownId: string
		groupId: string
		partId: string

		timelineObjId: string
		key: string
		changedItemId: string
		value: string
	}) => Promise<void>
	deleteTemplateData: (data: {
		rundownId: string
		groupId: string
		partId: string

		timelineObjId: string
		key: string
	}) => Promise<void>

	toggleGroupLoop: (data: { rundownId: string; groupId: string; value: boolean }) => Promise<void>
	toggleGroupAutoplay: (data: { rundownId: string; groupId: string; value: boolean }) => Promise<void>
	refreshResources: () => Promise<void>
}
export interface IPCClientMethods {
	updateProject: (project: Project) => void
	updateRundown: (fileName: string, rundown: Rundown) => void
	updateResource: (id: string, resource: ResourceAny | null) => void
	updateBridgeStatus: (id: string, status: BridgeStatus | null) => void
}
