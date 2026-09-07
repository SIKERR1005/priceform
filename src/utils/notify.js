let timer = null

export function notify(msg, type = 'info') {
  let el = document.getElementById('gov-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'gov-toast'
    el.style.cssText =
      'position:fixed;top:24px;left:50%;transform:translateX(-50%);padding:10px 22px;color:#fff;border-radius:3px;z-index:99999;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,.25);font-family:Microsoft YaHei,sans-serif;display:none;max-width:80vw;text-align:center;'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.style.background = type === 'error' ? '#a02020' : type === 'success' ? '#2e7d32' : '#8B1A1A'
  el.style.display = 'block'
  clearTimeout(timer)
  timer = setTimeout(() => {
    el.style.display = 'none'
  }, 2400)
}