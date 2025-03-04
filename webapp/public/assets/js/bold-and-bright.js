(function () {
  'use strict' // Start of use strict

  function initParallax () {
    if (!('requestAnimationFrame' in window)) return
    if (/Mobile|Android/.test(navigator.userAgent)) return

    const parallaxItems = document.querySelectorAll('[data-bss-parallax]')

    if (!parallaxItems.length) return

    const defaultSpeed = 0.5
    const visible = []
    let scheduled

    window.addEventListener('scroll', scroll)
    window.addEventListener('resize', scroll)

    scroll()

    function scroll () {
      visible.length = 0

      for (let i = 0; i < parallaxItems.length; i++) {
        const rect = parallaxItems[i].getBoundingClientRect()
        const speed = parseFloat(parallaxItems[i].getAttribute('data-bss-parallax-speed'), 10) || defaultSpeed

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          visible.push({
            speed,
            node: parallaxItems[i]
          })
        }
      }

      cancelAnimationFrame(scheduled)

      if (visible.length) {
        scheduled = requestAnimationFrame(update)
      }
    }

    function update () {
      for (let i = 0; i < visible.length; i++) {
        const node = visible[i].node
        const speed = visible[i].speed

        node.style.transform = 'translate3d(0, ' + (-window.scrollY * speed) + 'px, 0)'
      }
    }
  }

  initParallax()
})() // End of use strict
