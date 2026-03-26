import { useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    const el = ref.current
    if (el) {
      // Observe all .reveal elements within
      const children = el.querySelectorAll('.reveal')
      children.forEach(c => observer.observe(c))
      // Also observe the el itself if it has reveal class
      if (el.classList.contains('reveal')) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
