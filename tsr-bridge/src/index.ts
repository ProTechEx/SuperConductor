import { TSRTimelineObj } from 'timeline-state-resolver'
import { DeviceType, Timeline, TSRTimeline } from 'timeline-state-resolver-types'
import { KoaServer } from './KoaServer'
import { TSR } from './TSR'

const tsr = new TSR()

const storedTimelines: {
	[id: string]: Timeline.TimelineObject
} = {}

let storedTimeline: TSRTimeline | null = null

function updateTSR() {
	const timelines = Object.values(storedTimelines)
	// tsr.conductor.setTimelineAndMappings(Object.values(storedTimelines), tsr.allInputs.mappings)
	// tsr.conductor.setTimelineAndMappings(timelines, tsr.allInputs.mappings)
	// console.log('Updating TSR', storedTimeline)
	tsr.conductor.setTimelineAndMappings(storedTimeline!, tsr.allInputs.mappings)
}

const playTimeline = (id: string, groupId: string, newTimeline: TSRTimeline) => {
	console.log('PLAY TIMELINE FIRED!', newTimeline)

	// create a group
	// const group: TSRTimelineObj = {
	// 	id: id,
	// 	enable: {
	// 		start: Date.now(),
	// 	},
	// 	layer: groupId,
	// 	children: newTimeline,
	// 	isGroup: true,
	// 	content: {},
	// }

	// storedTimelines[id] = newTimeline
	storedTimeline = newTimeline.map((nt) => {
		;(nt.enable as any).start += Date.now()
		return nt
	})

	// we actually should look up others with the same groupId and remove them:
	Object.entries(storedTimelines).forEach(([id, obj]) => {
		if (obj.layer === groupId) {
			delete storedTimelines[id]
		}
	})

	updateTSR()
	return Date.now()
}

const stopTimeline = (id: string) => {
	// delete storedTimelines[id]
	storedTimeline = []
	updateTSR()
}

const koaServer = new KoaServer({
	playTimeline,
	stopTimeline,
})