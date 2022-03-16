import classNames from 'classnames'
import React from 'react'
import { MdClose } from 'react-icons/md'
import { TabLeftEdge } from './TabLeftEdge'
import { TabRightEdge } from './TabRightEdge'

import './tab.scss'

export const Tab: React.FC<{
	id: string
	name: string
	active?: boolean
	onClick: () => void
	onDoubleClick?: () => void
	onClose?: (id: string) => void
	disableClose?: boolean
}> = (props) => {
	return (
		<div
			className={classNames('tab', {
				active: props.active,
			})}
			title="Double-click to edit"
			onClick={props.onClick}
			onDoubleClick={props.onDoubleClick}
		>
			<TabLeftEdge />
			<div className="label">{props.name}</div>
			{!props.disableClose && (
				<div className="close">
					<button
						title="Close Rundown"
						aria-label="close rundown"
						onClick={(event) => {
							if (props.onClose) props.onClose(props.id)
							event.stopPropagation()
							event.preventDefault()
						}}
					>
						<MdClose />
					</button>
				</div>
			)}
			<TabRightEdge />
		</div>
	)
}