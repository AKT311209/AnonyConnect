document.addEventListener('DOMContentLoaded', function () {
  const toastTriggers = document.querySelectorAll('[data-bs-toggle="toast"]')

  for (const toastTrigger of toastTriggers) {
    toastTrigger.addEventListener('click', function () {
      const toastSelector = toastTrigger.getAttribute('data-bs-target')

      if (!toastSelector) return

      try {
        const toastEl = document.querySelector(toastSelector)

        if (!toastEl) return

        const toast = new bootstrap.Toast(toastEl)
        toast.show()
      } catch (e) {
        console.error(e)
      }
    })
  }
}, false)
