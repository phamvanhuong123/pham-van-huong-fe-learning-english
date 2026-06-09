import { useEffect, useState, useRef } from 'react'
import { useClientExamStore } from '../store/useClientExamStore'

export const useExamTimer = (totalDurationMinutes: number, onTimeUp: () => void) => {
  const { status, timeTaken, incrementTimeTaken } = useClientExamStore()

  // Tổng thời gian cho phép (giây)
  const totalSeconds = totalDurationMinutes * 60

  // Thời gian còn lại
  const [timeLeft, setTimeLeft] = useState(Math.max(0, totalSeconds - timeTaken))

  const onTimeUpRef = useRef(onTimeUp)
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (status !== 'IN_PROGRESS') return

    // Nếu vừa vào đã hết giờ (do cộng dồn thời gian offline) thì nộp bài luôn
    if (timeLeft <= 0) {
      onTimeUpRef.current()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUpRef.current()
          return 0
        }
        return prev - 1
      })
      incrementTimeTaken()
    }, 1000)

    return () => clearInterval(timer)
  }, [status, incrementTimeTaken])

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isWarning: timeLeft < 300, // Báo động đỏ khi còn dưới 5 phút
  }
}
