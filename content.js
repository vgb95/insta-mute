(function () {
  'use strict'

  const CSS = `
    .insta-mute-btn {
      background: none; border: none; cursor: pointer;
      font-size: 14px; line-height: 1; padding: 3px;
      border-radius: 9999px; transition: all 0.15s;
      opacity: 0.4; display: inline-flex; align-items: center;
      justify-content: center; width: 26px; height: 26px;
      flex-shrink: 0; margin: 0 2px;
    }
    .insta-mute-btn:hover {
      background: rgba(239, 68, 68, 0.15); opacity: 1; transform: scale(1.2);
    }
    .insta-mute-shhh {
      position: fixed;
      font: bold 22px 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
      background: rgba(0, 0, 0, 0.85); color: #fff;
      padding: 3px 12px; border-radius: 14px;
      pointer-events: none; z-index: 999999;
      text-shadow: 1px 1px 0 #000;
      animation: imPop 0.3s ease-out, imFade 1s 0.3s forwards;
      white-space: nowrap;
    }
    @keyframes imPop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.35); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes imFade {
      to { opacity: 0; transform: translateY(-22px); }
    }
  `

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  let currentUserHandle = null

  function injectStyles() {
    const s = document.createElement('style')
    s.textContent = CSS
    document.head.appendChild(s)
  }

  function getCurrentUserHandle() {
    try {
      const link = document.querySelector(
        'a[data-testid="AppTabBar_Profile_Link"]'
      )
      if (link) return link.getAttribute('href').replace('/', '')
    } catch {}
    return null
  }

  function getAuthorHandle(article) {
    try {
      const nameArea = article.querySelector('[data-testid="User-Name"]')
      if (nameArea) {
        const link = nameArea.querySelector('a[href^="/"]')
        if (link) return link.getAttribute('href').replace('/', '')
      }
      const allLinks = article.querySelectorAll('a[href^="/"]')
      for (const link of allLinks) {
        const href = link.getAttribute('href')
        if (href && /^\/[a-zA-Z0-9_]+$/.test(href) && !href.includes('?')) {
          if (link.getAttribute('role') === 'link') {
            return href.replace('/', '')
          }
        }
      }
    } catch {}
    return null
  }

  function findInsertionPoint(article) {
    // Priority 1: Grok button (left of "Explain this")
    const grokSelectors = [
      'button[data-testid="grok"]',
      'button[aria-label*="Grok" i]',
      'button[aria-label*="Explain" i]',
      '[data-testid="grok"]',
    ]
    for (const sel of grokSelectors) {
      const el = article.querySelector(sel)
      if (el) {
        const btn = el.tagName === 'BUTTON' ? el : el.querySelector('button') || el
        return { parent: btn.parentNode, ref: btn }
      }
    }

    // Priority 2: caret / "More" button (···)
    const more = article.querySelector('button[data-testid="caret"], [aria-label="More"]')
    if (more) {
      const btn = more.tagName === 'BUTTON' ? more : more.querySelector('button') || more
      return { parent: btn.parentNode, ref: btn }
    }

    // Priority 3: role="group" actions bar — append
    const group = article.querySelector('[role="group"]')
    if (group) return { parent: group, ref: null }

    // Priority 4: any known action button, insert after last one
    const known = article.querySelectorAll(
      'button[data-testid*="like"], button[data-testid*="reply"], button[data-testid*="retweet"], button[data-testid*="bookmark"], button[data-testid*="view"]'
    )
    if (known.length) {
      const last = known[known.length - 1]
      return { parent: last.parentNode, ref: last.nextSibling }
    }

    return null
  }

  function showShhh(x, y) {
    const el = document.createElement('div')
    el.className = 'insta-mute-shhh'
    el.textContent = 'shhh! 🤫'
    el.style.left = Math.max(0, x - 20) + 'px'
    el.style.top = Math.max(0, y + 5) + 'px'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1400)
  }

  async function handleMute(btn, article, handle) {
    const rect = btn.getBoundingClientRect()

    try {
      // Click the "More" / caret button to open menu
      const caret = article.querySelector(
        'button[data-testid="caret"], [aria-label="More"]'
      )
      if (!caret) return
      const caretBtn = caret.tagName === 'BUTTON' ? caret : caret.querySelector('button') || caret
      caretBtn.click()

      await sleep(200)

      // Find "Silenciar" or "Mute @" in the dropdown
      const items = document.querySelectorAll(
        'div[role="menuitem"], [data-testid="mute"]'
      )
      let clicked = false
      for (const item of items) {
        if (
          item.textContent.includes('Silenciar') ||
          item.textContent.includes('Mute @')
        ) {
          item.click()
          clicked = true
          break
        }
      }
      if (!clicked) {
        console.warn('[Insta Mute] Mute option not found in menu')
        return
      }

      await sleep(150)

      showShhh(rect.left, rect.bottom + 5)
      btn.remove()
    } catch (err) {
      console.error('[Insta Mute] handleMute error:', err)
    }
  }

  function processTweet(article) {
    const status = article.getAttribute('data-insta-mute')
    if (status) return
    article.setAttribute('data-insta-mute', 'processing')

    // Skip own tweets
    if (currentUserHandle) {
      const handle = getAuthorHandle(article)
      if (handle === currentUserHandle) {
        article.setAttribute('data-insta-mute', 'own')
        return
      }
    }

    const point = findInsertionPoint(article)
    if (!point) {
      console.warn('[Insta Mute] No insertion point found', article)
      article.setAttribute('data-insta-mute', 'no-point')
      return
    }

    const handle = getAuthorHandle(article)
    const btn = document.createElement('button')
    btn.className = 'insta-mute-btn'
    btn.title = 'Silenciar a @' + (handle || '')
    btn.textContent = '🤫'
    btn.setAttribute('aria-label', 'Silenciar a @' + (handle || ''))

    if (point.ref) {
      point.parent.insertBefore(btn, point.ref)
    } else {
      point.parent.appendChild(btn)
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      handleMute(this, article, handle)
    })

    article.setAttribute('data-insta-mute', 'injected')
  }

  function sweepTweets() {
    document
      .querySelectorAll('article[data-testid="tweet"]')
      .forEach(function (article) {
        const status = article.getAttribute('data-insta-mute')
        if (status === 'injected' && !article.querySelector('.insta-mute-btn')) {
          article.removeAttribute('data-insta-mute')
          processTweet(article)
        }
      })
  }

  function init() {
    currentUserHandle = getCurrentUserHandle()
    console.log('[Insta Mute] Usuario actual: @' + currentUserHandle)

    document
      .querySelectorAll('article[data-testid="tweet"]')
      .forEach(processTweet)

    const target =
      document.querySelector('div[data-testid="primaryColumn"]') ||
      document.querySelector('main') ||
      document.body

    console.log('[Insta Mute] Observando:', target)

    const observer = new MutationObserver(function () {
      document
        .querySelectorAll('article[data-testid="tweet"]')
        .forEach(processTweet)
    })

    observer.observe(target, { childList: true, subtree: true })

    setInterval(sweepTweets, 2000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectStyles()
      init()
    })
  } else {
    injectStyles()
    init()
  }
})()
