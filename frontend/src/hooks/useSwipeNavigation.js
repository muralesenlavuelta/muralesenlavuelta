import { useRef } from 'react'

const SWIPE_THRESHOLD = 48

export function useSwipeNavigation(onSwipe) {
  const pointerStart = useRef(null)
  const suppressClick = useRef(false)

  const onPointerDown = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    suppressClick.current = false
    pointerStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerUp = (event) => {
    if (!pointerStart.current) return

    const deltaX = event.clientX - pointerStart.current.x
    const deltaY = event.clientY - pointerStart.current.y
    pointerStart.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return

    suppressClick.current = true
    onSwipe(deltaX < 0 ? 1 : -1)
  }

  const onPointerCancel = () => {
    pointerStart.current = null
  }

  const onClickCapture = (event) => {
    if (!suppressClick.current) return

    event.preventDefault()
    event.stopPropagation()
    suppressClick.current = false
  }

  return { onPointerDown, onPointerUp, onPointerCancel, onClickCapture }
}
