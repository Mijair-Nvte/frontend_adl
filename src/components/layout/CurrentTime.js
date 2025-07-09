'use client'

import { useEffect, useState } from 'react'

export default function CurrentTime() {
  const [time, setTime] = useState(getFormattedTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime())
    }, 1000) // actualiza cada segundo

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="">
      {time}
    </div>
  )
}

function getFormattedTime() {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}
