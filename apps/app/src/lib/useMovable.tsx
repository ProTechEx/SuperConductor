import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type HTMLElementEventHandler<T> = (this: HTMLElement, ev: T) => any

type StartingValues = {
	dragging: boolean
	pointerX: number
	pointerY: number
	originX: number
	originY: number
}

interface DeltaPosition {
	x: number
	y: number
}
interface Position {
	clientX: number
	clientY: number
}

/**
 * The minimum distance, in pixels, that a drag must be performed before isDragging is set to true.
 */
const MIN_DRAG_DISTANCE = 1

export function useMovable(
	moveElement: React.RefObject<HTMLDivElement | null>,

	callbacks: {
		/** Called upon drag start move */
		onDragStart: (position: Position) => void
		/** Called upon drag move */
		onDragMove: (delta: DeltaPosition, position: Position) => void
		/** Called upon drag end */
		onDragEnd: (delta: DeltaPosition, position: Position) => void
	}
	// startingValues: StartingValues = {
	// 	dragging: false,
	// 	pointerX: 0,
	// 	pointerY: 0,
	// 	originX: 0,
	// 	originY: 0,
	// }
	// ): [boolean, number, number, number, number, number, number] {
) {
	const originPointerPosition = useRef<{ clientX: number; clientY: number } | undefined>(undefined)
	const isDragging = useRef<boolean>(false)
	const delta = useRef<DeltaPosition>({ x: 0, y: 0 })
	const position = useRef<Position>({ clientX: 0, clientY: 0 })
	const onPointerMoveIsSet = useRef<boolean>(false)

	useLayoutEffect(() => {
		if (!moveElement.current) {
			console.log('no moveElement')
			return
		}
		moveElement.current.addEventListener('pointerdown', onPointerDown)
		document.body.addEventListener('pointerup', onPointerUp)
		return () => {
			if (!moveElement.current) {
				console.log('no moveElement on unmount')
				return
			}
			moveElement.current.removeEventListener('pointerdown', onPointerDown)
			document.body.removeEventListener('pointerup', onPointerUp)
		}
	}, [])

	const onPointerDown = useCallback((event: PointerEvent) => {
		originPointerPosition.current = {
			clientX: event.clientX,
			clientY: event.clientY,
		}
		// Do nothing else here, the consumer will call onStartMoving if we are to start moving
	}, [])

	// Called by consumer when a movement starts
	const onStartMoving = useCallback(() => {
		console.log('startmoving', originPointerPosition.current)

		if (!originPointerPosition.current) {
			console.error('Warning: onStartMoving: originPointerPosition.current was not set')
		}

		if (!onPointerMoveIsSet.current) {
			onPointerMoveIsSet.current = true
			document.body.addEventListener('pointermove', onPointerMove)
		} else {
			console.error('Warning: onStartMoving: onPointerMoveIsSet.current was already set')
		}
	}, [])

	const onPointerMove = useCallback((event: PointerEvent) => {
		position.current = {
			clientX: event.clientX,
			clientY: event.clientY,
		}
		if (!originPointerPosition.current) {
			// Dirty fix:
			originPointerPosition.current = position.current
		}

		delta.current = {
			x: position.current.clientX - originPointerPosition.current.clientX,
			y: position.current.clientY - originPointerPosition.current.clientY,
		}

		if (Math.abs(delta.current.x) >= MIN_DRAG_DISTANCE && Math.abs(delta.current.y) >= MIN_DRAG_DISTANCE) {
			if (!isDragging.current) {
				isDragging.current = true
				callbacks.onDragStart(position.current)
			}
		}

		if (isDragging.current) {
			callbacks.onDragMove(delta.current, position.current)
		}
	}, [])

	const onPointerUp = useCallback((_event: PointerEvent) => {
		if (isDragging.current) {
			try {
				callbacks.onDragEnd(delta.current, position.current)
			} catch (err) {
				console.error(err)
			}

			// Cleanup:
			isDragging.current = false
		}
		if (onPointerMoveIsSet.current) {
			document.body.removeEventListener('pointermove', onPointerMove)
			onPointerMoveIsSet.current = false
		}
		originPointerPosition.current = undefined
		delta.current = { x: 0, y: 0 }
	}, [])

	return {
		onStartMoving,
	}

	/*
	const [isDragging, setIsDragging] = useState(startingValues.dragging)
	const [isPointerDown, setIsPointerDown] = useState(startingValues.dragging)
	const [pointerPosition, setPointerPosition] = useState({
		clientX: startingValues.pointerX,
		clientY: startingValues.pointerY,
	})
	const [originPointerPosition, setOriginPointerPosition] = useState({
		clientX: startingValues.originX,
		clientY: startingValues.originY,
	})
	const onPointerMove = useCallback<HTMLElementEventHandler<PointerEvent>>((ev) => {
		setPointerPosition({
			clientX: ev.clientX,
			clientY: ev.clientY,
		})
	}, [])
	const onPointerUp = useCallback<HTMLElementEventHandler<PointerEvent>>((ev) => {
		setIsPointerDown(false)
		ev.preventDefault()
	}, [])
	const onPointerDown = useCallback<HTMLElementEventHandler<PointerEvent>>((ev) => {
		if (ev.pointerType === 'mouse' && ev.buttons !== 0b0001) {
			return
		}

		console.log('onPointerDown')

		// These are order-sensitive.
		setOriginPointerPosition({
			clientX: ev.clientX,
			clientY: ev.clientY,
		})
		setPointerPosition({
			clientX: ev.clientX,
			clientY: ev.clientY,
		})
		setIsPointerDown(true)

		ev.preventDefault()
	}, [])

	useEffect(() => {
		const horizontalMoveMeetsThreshold =
			Math.abs(pointerPosition.clientX - originPointerPosition.clientX) >= MIN_DRAG_DISTANCE
		const verticalMoveMeetsThreshold =
			Math.abs(pointerPosition.clientY - originPointerPosition.clientY) >= MIN_DRAG_DISTANCE
		if (isPointerDown && (horizontalMoveMeetsThreshold || verticalMoveMeetsThreshold)) {
			setIsDragging(true)
		} else {
			setIsDragging(false)
		}
	}, [isPointerDown, pointerPosition, originPointerPosition])

	useEffect(() => {
		if (!el) return

		el.addEventListener('pointerdown', onPointerDown)

		return () => {
			if (!el) return

			el.removeEventListener('pointerdown', onPointerDown)
		}
	}, [el, onPointerDown])

	useEffect(() => {
		document.body.addEventListener('pointerup', onPointerUp)
		document.body.addEventListener('pointermove', onPointerMove)

		return () => {
			document.body.removeEventListener('pointerup', onPointerUp)
			document.body.removeEventListener('pointermove', onPointerMove)
		}
	}, [onPointerMove, onPointerUp])

	return [
		isDragging,
		pointerPosition.clientX - originPointerPosition.clientX,
		pointerPosition.clientY - originPointerPosition.clientY,
		pointerPosition.clientX,
		pointerPosition.clientY,
		originPointerPosition.clientX,
		originPointerPosition.clientY,
	]
	*/
}
