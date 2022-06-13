import React from 'react'
import { assertNever } from '@shared/lib'
import {
	ChannelFormat,
	Direction,
	Ease,
	RegularTimelineTransition,
	TimelineContentTypeCasparCg,
	TimelineObjCasparCGAny,
	TimelineObjCCGHTMLPage,
	TimelineObjCCGInput,
	TimelineObjCCGIP,
	TimelineObjCCGMedia,
	TimelineObjCCGRecord,
	TimelineObjCCGRoute,
	TimelineObjCCGTemplate,
	Transition,
} from 'timeline-state-resolver-types'
import { EditWrapper, OnSave } from './lib'
import { BooleanInput } from '../../../inputs/BooleanInput'
import { DurationInput } from '../../../inputs/DurationInput'
import { FloatInput } from '../../../inputs/FloatInput'
import { SelectEnum } from '../../../inputs/SelectEnum'
import { IntInput } from '../../../inputs/IntInput'
import { TextInput } from '../../../inputs/TextInput'
import { Link } from '@mui/material'
import { objPathGet, objPathSet } from '../../../../../lib/util'

export const EditTimelineObjCasparCGAny: React.FC<{ obj: TimelineObjCasparCGAny; onSave: OnSave }> = ({
	obj,
	onSave,
}) => {
	let settings: JSX.Element = <></>

	const [showAll, setShowAll] = React.useState(false)
	const [showMixer, setShowMixer] = React.useState(false)
	const [showTransition, setShowTransition] = React.useState(false)

	const commonSettings: JSX.Element = (
		<>
			<div className="setting">
				<SelectEnum
					label="Type"
					fullWidth
					currentValue={obj.content.type}
					options={TimelineContentTypeCasparCg}
					onChange={(newValue) => {
						obj.content.type = newValue
						onSave(obj)
					}}
				/>
			</div>
		</>
	)

	// TODO: base properties:
	// transitions?: {
	//     inTransition?: TimelineTransition;
	//     outTransition?: TimelineTransition;
	// };
	// mixer?: Mixer;

	const getSettingsChannelLayout = (obj: TimelineObjCasparCGAny & { content: { channelLayout?: string } }) => (
		<>
			{showAll || obj.content.channelLayout !== undefined ? (
				<div className="setting">
					<TextInput
						label="channelLayout"
						fullWidth
						currentValue={obj.content.channelLayout}
						onChange={(v) => {
							obj.content.channelLayout = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>
			) : null}
		</>
	)

	const getSettingsVideoAudioFilters = (
		obj: TimelineObjCasparCGAny & { content: { videoFilter?: string; audioFilter?: string } }
	) => (
		<>
			{showAll || obj.content.videoFilter ? (
				<div className="setting">
					<TextInput
						label="VideoFilter"
						fullWidth
						currentValue={obj.content.videoFilter}
						onChange={(v) => {
							obj.content.videoFilter = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>
			) : null}
			{showAll || obj.content.audioFilter ? (
				<div className="setting">
					<TextInput
						label="AudioFilter"
						fullWidth
						currentValue={obj.content.audioFilter}
						onChange={(v) => {
							obj.content.audioFilter = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>
			) : null}
		</>
	)
	const getSettingsTransition = (obj: TimelineObjCasparCGAny, path: string, label: string) => {
		const transition = objPathGet<RegularTimelineTransition>(obj, path, {
			type: Transition.MIX,
			easing: Ease.IN_OUT_CUBIC,
		})

		return (
			(showTransition || (transition.type ?? Transition.CUT) !== Transition.CUT) && (
				<>
					<div className="setting">
						<SelectEnum
							label={`${label} type`}
							fullWidth
							currentValue={transition.type}
							options={Transition}
							onChange={(v) => {
								transition.type = v
								onSave(obj)
							}}
							allowUndefined={true}
						/>
					</div>
					{(transition.type ?? Transition.CUT) !== Transition.CUT && (
						<>
							<div className="setting">
								<DurationInput
									label={`${label} duration`}
									fullWidth
									currentValue={transition.duration}
									onChange={(v) => {
										transition.duration = v
										onSave(obj)
									}}
									allowUndefined={true}
								/>
							</div>
							<div className="setting">
								<SelectEnum
									label={`${label} easing`}
									fullWidth
									currentValue={transition.easing}
									options={Ease}
									onChange={(v) => {
										transition.easing = v
										onSave(obj)
									}}
									allowUndefined={true}
								/>
							</div>
							{transition.type &&
								[Transition.PUSH, Transition.WIPE, Transition.SLIDE].includes(transition.type) && (
									<div className="setting">
										<SelectEnum
											label={`${label} direction`}
											fullWidth
											currentValue={transition.direction}
											options={Direction}
											onChange={(v) => {
												transition.direction = v
												onSave(obj)
											}}
											allowUndefined={true}
										/>
									</div>
								)}
						</>
					)}
				</>
			)
		)
	}

	const showAllButton = showAll ? (
		<Link className="show-hide" href="#" onClick={() => setShowAll(false)}>
			Hide more settings
		</Link>
	) : (
		<Link className="show-hide" href="#" onClick={() => setShowAll(true)}>
			Show more settings
		</Link>
	)
	const showMixerButton = showMixer ? (
		<Link className="show-hide" href="#" onClick={() => setShowMixer(false)}>
			Hide mixer settings
		</Link>
	) : (
		<Link className="show-hide" href="#" onClick={() => setShowMixer(true)}>
			Show mixer settings
		</Link>
	)
	const showTransitionButton = showTransition ? (
		<Link className="show-hide" href="#" onClick={() => setShowTransition(false)}>
			Hide transition settings
		</Link>
	) : (
		<Link className="show-hide" href="#" onClick={() => setShowTransition(true)}>
			Show transition settings
		</Link>
	)

	const obj0 = obj

	if (obj.content.type === TimelineContentTypeCasparCg.MEDIA) {
		const obj = obj0 as TimelineObjCCGMedia
		settings = (
			<>
				<div className="setting">
					<TextInput
						label="Filename"
						fullWidth
						currentValue={obj.content.file}
						onChange={(v) => {
							obj.content.file = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
				<div className="setting">
					<BooleanInput
						label="Looping content"
						currentValue={obj.content.loop}
						onChange={(v) => {
							obj.content.loop = v
							onSave(obj)
						}}
					/>
				</div>

				{showAll ||
				obj.content.seek !== undefined ||
				obj.content.inPoint !== undefined ||
				obj.content.length !== undefined ? (
					<>
						<div className="setting">
							<DurationInput
								label="Seek"
								fullWidth
								currentValue={obj.content.seek}
								onChange={(v) => {
									obj.content.seek = v
									onSave(obj)
								}}
								allowUndefined={true}
							/>
						</div>
						<div className="setting">
							<DurationInput
								label="In Point (ie loop start point)"
								fullWidth
								currentValue={obj.content.inPoint}
								onChange={(v) => {
									obj.content.inPoint = v
									onSave(obj)
								}}
								allowUndefined={true}
							/>
						</div>
						<div className="setting">
							<DurationInput
								label="Length (ie point of freeze/loop)"
								fullWidth
								currentValue={obj.content.length}
								onChange={(v) => {
									obj.content.length = v
									onSave(obj)
								}}
								allowUndefined={true}
							/>
						</div>
					</>
				) : null}

				{/* <div className="setting">
					<label>noStarttime</label>
					<BooleanInput
						currentValue={obj.content.noStarttime}
						onChange={(v) => {
							obj.content.noStarttime = v
							onSave(obj)
						}}
					/>
				</div> */}
				{getSettingsChannelLayout(obj)}
				{getSettingsVideoAudioFilters(obj)}

				{showAllButton}

				{getSettingsTransition(obj, 'content.transitions.inTransition', 'In transition')}
				{getSettingsTransition(obj, 'content.transitions.outTransition', 'Out transition')}
				{showTransitionButton}
				{(showMixer || obj.content.mixer?.brightness !== undefined) && (
					<>
						<FloatInput
							label="Brightness"
							fullWidth
							currentValue={obj.content.mixer?.brightness as number | undefined}
							onChange={(v) => {
								objPathSet(obj, 'content.mixer.brightness', v)
								onSave(obj)
							}}
							allowUndefined={true}
							percentage={true}
							caps={[0, 1]}
						/>
					</>
				)}

				{/*
				anchor?: {
					x: number;
					y: number;
				} | TransitionObject;
				blend?: BlendMode | TransitionObject;
				// brightness?: number | TransitionObject;
				chroma?: {
					keyer: Chroma;
					threshold: number;
					softness: number;
					spill: number;
				} | TransitionObject;
				clip?: {
					x: number;
					y: number;
					width: number;
					height: number;
				} | TransitionObject;
				contrast?: number | TransitionObject;
				crop?: {
					left: number;
					top: number;
					right: number;
					bottom: number;
				} | TransitionObject;
				fill?: {
					x: number;
					y: number;
					xScale: number;
					yScale: number;
				} | TransitionObject;
				keyer?: boolean | TransitionObject;
				levels?: {
					minInput: number;
					maxInput: number;
					gamma: number;
					minOutput: number;
					maxOutput: number;
				} | TransitionObject;
				mastervolume?: number | TransitionObject;
				opacity?: number | TransitionObject;
				perspective?: {
					topLeftX: number;
					topLeftY: number;
					topRightX: number;
					topRightY: number;
					bottomRightX: number;
					bottomRightY: number;
					bottomLeftX: number;
					bottomLeftY: number;
				} | TransitionObject;
				rotation?: number | TransitionObject;
				saturation?: number | TransitionObject;
				straightAlpha?: boolean | TransitionObject;
				volume?: number | TransitionObject;
				bundleWithCommands?: number; */}

				{showMixerButton}
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.IP) {
		const obj = obj0 as TimelineObjCCGIP
		settings = (
			<>
				<div className="setting">
					<TextInput
						label="URI"
						fullWidth
						currentValue={obj.content.uri}
						onChange={(v) => {
							obj.content.uri = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
				{getSettingsChannelLayout(obj)}
				{getSettingsVideoAudioFilters(obj)}

				{showAllButton}
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.INPUT) {
		const obj = obj0 as TimelineObjCCGInput
		settings = (
			<>
				<div className="setting">
					<TextInput
						label='Input Type (eg "decklink")'
						fullWidth
						currentValue={obj.content.inputType}
						onChange={(v) => {
							obj.content.inputType = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
				<div className="setting">
					<IntInput
						label="Device Number"
						fullWidth
						currentValue={obj.content.device}
						onChange={(v) => {
							obj.content.device = v
							onSave(obj)
						}}
						allowUndefined={false}
						caps={[0, 99]}
					/>
				</div>
				<div className="setting">
					<SelectEnum
						label="Device Format"
						fullWidth
						currentValue={obj.content.deviceFormat}
						options={ChannelFormat}
						onChange={(v) => {
							obj.content.deviceFormat = v
							onSave(obj)
						}}
					/>
				</div>
				<div className="setting">
					<TextInput
						label="Filter"
						fullWidth
						currentValue={obj.content.filter}
						onChange={(v) => {
							obj.content.filter = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>

				{getSettingsChannelLayout(obj)}
				{getSettingsVideoAudioFilters(obj)}
				{showAllButton}
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.TEMPLATE) {
		const obj = obj0 as TimelineObjCCGTemplate
		settings = (
			<>
				<div className="setting">
					<SelectEnum
						label="Template Type"
						fullWidth
						currentValue={obj.content.templateType}
						options={{ html: 'HTML', flash: 'Flash' }}
						onChange={(v) => {
							obj.content.templateType = v
							onSave(obj)
						}}
						defaultValue={'html'}
					/>
				</div>
				<div className="setting">
					<TextInput
						label="Name"
						fullWidth
						currentValue={obj.content.name}
						onChange={(v) => {
							obj.content.name = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
				<div className="setting">
					<TextInput
						label="Data"
						fullWidth
						currentValue={obj.content.data}
						onChange={(v) => {
							obj.content.data = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>
				<div className="setting">
					<BooleanInput
						label="Send stop() on stop"
						currentValue={obj.content.useStopCommand}
						onChange={(v) => {
							obj.content.useStopCommand = v
							onSave(obj)
						}}
					/>
				</div>
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.HTMLPAGE) {
		const obj = obj0 as TimelineObjCCGHTMLPage
		settings = (
			<>
				<div className="setting">
					<TextInput
						label="URL"
						fullWidth
						currentValue={obj.content.url}
						onChange={(v) => {
							obj.content.url = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.ROUTE) {
		const obj = obj0 as TimelineObjCCGRoute & { content: { __routeMappedLayer?: boolean } }

		settings = (
			<>
				<div className="setting">
					<TextInput
						label="mappedLayer"
						fullWidth
						currentValue={obj.content.mappedLayer}
						onChange={(v) => {
							obj.content.mappedLayer = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>

				{!obj.content.mappedLayer ? (
					<>
						<div className="setting">
							<IntInput
								label="Channel"
								fullWidth
								currentValue={obj.content.channel}
								onChange={(v) => {
									obj.content.channel = v
									onSave(obj)
								}}
								allowUndefined={true}
								caps={[0, 999]}
							/>
						</div>
						<div className="setting">
							<IntInput
								label="Layer"
								fullWidth
								currentValue={obj.content.layer}
								onChange={(v) => {
									obj.content.layer = v
									onSave(obj)
								}}
								allowUndefined={true}
								caps={[0, 999]}
							/>
						</div>
					</>
				) : null}

				<div className="setting">
					<SelectEnum
						label="Mode"
						fullWidth
						currentValue={obj.content.mode}
						options={{
							BACKGROUND: 'BACKGROUND',
							NEXT: 'NEXT',
						}}
						onChange={(v) => {
							obj.content.mode = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>
				<div className="setting">
					<DurationInput
						label="Delay"
						fullWidth
						currentValue={obj.content.delay}
						onChange={(v) => {
							obj.content.delay = v
							onSave(obj)
						}}
						allowUndefined={true}
					/>
				</div>

				{getSettingsChannelLayout(obj)}
				{getSettingsVideoAudioFilters(obj)}
				{showAllButton}
			</>
		)
	} else if (obj.content.type === TimelineContentTypeCasparCg.RECORD) {
		const obj = obj0 as TimelineObjCCGRecord

		settings = (
			<>
				<div className="setting">
					<TextInput
						label="File name"
						fullWidth
						currentValue={obj.content.file}
						onChange={(v) => {
							obj.content.file = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
				<div className="setting">
					<TextInput
						label="Encoder Options"
						fullWidth
						currentValue={obj.content.encoderOptions}
						onChange={(v) => {
							obj.content.encoderOptions = v
							onSave(obj)
						}}
						allowUndefined={false}
					/>
				</div>
			</>
		)
	} else {
		assertNever(obj.content)
	}

	return (
		<EditWrapper obj={obj} onSave={onSave}>
			{commonSettings}
			{settings}
		</EditWrapper>
	)
}
