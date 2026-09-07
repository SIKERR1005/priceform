import { useSchemeStore } from '@/stores/scheme'
import { useDictStore } from '@/stores/dict'
import { toChineseAmount, formatMoney, round2 } from '@/utils/money'

function esc(str) {
  if (str == null) return ''
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function ensureContainer() {
  let el = document.getElementById('pdf-root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'pdf-root'
    el.style.position = 'fixed'
    el.style.left = '-99999px'
    el.style.top = '0'
    el.style.width = '794px'
    el.style.background = '#fff'
    el.style.zIndex = '-1'
    document.body.appendChild(el)
  }
  return el
}

function pdfOptions(filename) {
  return {
    margin: [10, 10, 12, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.gov-card', '.gov-sign-block', 'tr', '.gov-summary'] }
  }
}

async function exportHTML(html, filename) {
  const html2pdf = (await import('html2pdf.js')).default
  const root = ensureContainer()
  root.innerHTML = html
  try {
    await html2pdf().set(pdfOptions(filename)).from(root).save()
  } finally {
    root.innerHTML = ''
  }
}

function buildSignHtml(signatures) {
  const blocks = Object.keys(signatures || {})
    .map((side) => {
      const blk = signatures[side]
      const lines = (blk.fields || []).map((f) => `<div class="sign-line"><span class="sign-cap">${f}：</span></div>`).join('')
      return `<div class="gov-sign-block"><div class="sign-title">${blk.title}</div>${lines}</div>`
    })
    .join('')
  return `<div class="gov-sign">${blocks}</div>`
}

function buildRulesHtml(rules) {
  return (rules || [])
    .map((r) => `<div class="rule-item"><div class="rule-title">${r.title}</div><div class="rule-content">${r.content}</div></div>`)
    .join('')
}

function modeText(mode) {
  return mode === 'full' ? '常规全天会务' : mode === '211' ? '16:00-19:00「2+1」错峰创新会务模式（2小时干货分享+1小时深度对接）' : ''
}

function buildQuoteHTML(s, dict) {
  const bi = s.current.baseInfo
  let modulesHtml = ''
  for (const m of dict.levelModules) {
    const sel = s.current.selections[m.id]
    if (!sel || !sel.level) continue
    const lv = m.levels.find((l) => l.level === sel.level)
    const sub = m.hasSubOption && sel.subOption ? dict.teaSubOptions.find((o) => o.id === sel.subOption) : null
    const subtotal = round2((Number(sel.price) || 0) * (Number(sel.qty) || 0))
    modulesHtml += `
      <div class="gov-card">
        <div class="gov-card-head"><span class="mod-name">模块${m.code}：${m.name}（${sel.level}档·${lv ? lv.name : ''}）</span></div>
        <div class="gov-card-body">
          ${m.standardHint ? `<div class="gov-hint">${m.standardHint}</div>` : ''}
          <div class="gov-level-desc">${lv ? lv.desc : ''}</div>
          ${sub ? `<div class="gov-sub-options"><div class="sub-title">茶歇版本：${sub.name}</div><div class="sub-desc">${sub.desc}</div></div>` : ''}
          <div class="gov-input-row"><label>单价：¥${formatMoney(sel.price)}</label><label>数量：${sel.qty}</label><span class="gov-subtotal">小计：<b>¥${formatMoney(subtotal)}</b></span></div>
        </div>
      </div>`
  }
  let addonHtml = ''
  for (const ad of dict.addons) {
    const a = s.current.addons[ad.id]
    if (!a || !a.selected) continue
    const subtotal = round2((Number(a.price) || 0) * (Number(a.qty) || 0))
    addonHtml += `
      <div class="gov-card">
        <div class="gov-card-head"><span class="mod-name">增值·${ad.name}</span></div>
        <div class="gov-card-body">
          <div class="gov-level-desc">${ad.desc}</div>
          <div class="gov-input-row"><label>单价：¥${formatMoney(a.price)}</label><label>数量：${a.qty}</label><span class="gov-subtotal">小计：<b>¥${formatMoney(subtotal)}</b></span></div>
        </div>
      </div>`
  }
  return `
    <div class="gov-page">
      <div class="gov-redheader">
        <h1 class="red-title">${dict.header.title}</h1>
        <div class="red-subtitle">${dict.header.subtitle}</div>
      </div>
      <hr class="gov-redline"/>
      <div class="gov-doc-no"><span>方案编号：${s.current.schemeNo}</span><span>制作日期：${bi.makeDate || ''}</span></div>
      <div class="gov-section-title">一、项目基础信息</div>
      <table class="gov-table">
        <tr><td style="width:28%">客户单位名称</td><td>${esc(bi.customer)}</td></tr>
        <tr><td>会议活动名称</td><td>${esc(bi.meetingName)}</td></tr>
        <tr><td>预估参会人数</td><td>${bi.attendees || ''}</td></tr>
        <tr><td>预估活动日期</td><td>${bi.meetingDate || ''}</td></tr>
        <tr><td>预算区间</td><td>${esc(bi.budgetRange)}</td></tr>
        <tr><td>会务模式</td><td>${modeText(bi.meetingMode)}</td></tr>
      </table>
      <div class="gov-section-title">二、模块选配明细</div>
      ${modulesHtml || '<div class="gov-empty">未勾选任何模块</div>'}
      <div class="gov-section-title">三、增值可选单项</div>
      ${addonHtml || '<div class="gov-empty">未勾选任何增值项</div>'}
      <div class="gov-section-title">四、报价汇总</div>
      <div class="gov-summary">
        <div class="gov-summary-head">报价汇总</div>
        <div class="gov-summary-body">
          <div class="gov-summary-total"><span class="t-label">合计总金额：</span><span class="t-value">¥${formatMoney(s.totalAmount)}</span></div>
          <div class="gov-summary-cn">${s.totalChinese}</div>
          ${s.current.remark ? `<div style="margin-top:10px;font-size:13px;">备注：${esc(s.current.remark)}</div>` : ''}
        </div>
      </div>
      <div class="gov-section-title">五、选配规则与IP交付保障</div>
      <div class="gov-rules">${buildRulesHtml(dict.rules)}</div>
      <div class="gov-section-title">六、签章确认</div>
      ${buildSignHtml(dict.signatures)}
    </div>`
}

function buildTableHTML(s, dict) {
  const bi = s.current.baseInfo
  let rows = ''
  let idx = 0
  for (const m of dict.levelModules) {
    const sel = s.current.selections[m.id]
    if (!sel || !sel.level) continue
    idx++
    const lv = m.levels.find((l) => l.level === sel.level)
    const sub = m.hasSubOption && sel.subOption ? dict.teaSubOptions.find((o) => o.id === sel.subOption) : null
    const subtotal = round2((Number(sel.price) || 0) * (Number(sel.qty) || 0))
    rows += `<tr><td>${idx}</td><td>模块${m.code}·${m.name}</td><td>${sel.level}档·${lv ? lv.name : ''}${sub ? '·' + sub.name : ''}</td><td>${lv ? lv.desc : ''}</td><td class="num">${formatMoney(sel.price)}</td><td class="num">${sel.qty}</td><td class="num">${formatMoney(subtotal)}</td></tr>`
  }
  for (const ad of dict.addons) {
    const a = s.current.addons[ad.id]
    if (!a || !a.selected) continue
    idx++
    const subtotal = round2((Number(a.price) || 0) * (Number(a.qty) || 0))
    rows += `<tr><td>${idx}</td><td>增值·${ad.name}</td><td>加购项</td><td>${ad.desc}</td><td class="num">${formatMoney(a.price)}</td><td class="num">${a.qty}</td><td class="num">${formatMoney(subtotal)}</td></tr>`
  }
  return `
    <div class="gov-page">
      <div class="gov-redheader">
        <h1 class="red-title">${dict.header.title}</h1>
        <div class="red-subtitle">明细组合报价表</div>
      </div>
      <hr class="gov-redline"/>
      <div class="gov-doc-no"><span>方案编号：${s.current.schemeNo}</span><span>客户单位：${esc(bi.customer)}</span></div>
      <table class="gov-table">
        <thead><tr><th>序号</th><th>模块名称</th><th>选中档位</th><th>服务简述</th><th class="num">单价(元)</th><th class="num">数量</th><th class="num">小计(元)</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7" class="gov-empty">未勾选任何项目</td></tr>'}</tbody>
        <tfoot><tr><td colspan="6" style="text-align:right;">合计总金额</td><td class="num">¥${formatMoney(s.totalAmount)}</td></tr></tfoot>
      </table>
      <div class="gov-summary-cn" style="margin-top:10px;">${s.totalChinese}</div>
      ${s.current.remark ? `<div style="margin-top:10px;font-size:13px;">备注：${esc(s.current.remark)}</div>` : ''}
      <div style="margin-top:28px;">${buildSignHtml(dict.signatures)}</div>
    </div>`
}

function buildStandardHTML(s, dict) {
  const bi = s.current.baseInfo
  let items = ''
  let idx = 0
  for (const m of dict.levelModules) {
    const sel = s.current.selections[m.id]
    if (!sel || !sel.level) continue
    idx++
    const lv = m.levels.find((l) => l.level === sel.level)
    const sub = m.hasSubOption && sel.subOption ? dict.teaSubOptions.find((o) => o.id === sel.subOption) : null
    items += `
      <div class="gov-card">
        <div class="gov-card-head"><span class="mod-name">${idx}. 模块${m.code}：${m.name}（${sel.level}档·${lv ? lv.name : ''}）</span></div>
        <div class="gov-card-body">
          ${m.standardHint ? `<div class="gov-hint">${m.standardHint}</div>` : ''}
          <div class="gov-level-desc">${lv ? lv.desc : ''}</div>
          ${sub ? `<div class="gov-sub-options"><div class="sub-title">茶歇版本：${sub.name}</div><div class="sub-desc">${sub.desc}</div></div>` : ''}
        </div>
      </div>`
  }
  for (const ad of dict.addons) {
    const a = s.current.addons[ad.id]
    if (!a || !a.selected) continue
    idx++
    items += `
      <div class="gov-card">
        <div class="gov-card-head"><span class="mod-name">${idx}. 增值可选单项：${ad.name}</span></div>
        <div class="gov-card-body"><div class="gov-level-desc">${ad.desc}</div></div>
      </div>`
  }
  return `
    <div class="gov-page">
      <div class="gov-redheader">
        <h1 class="red-title">${dict.header.title}</h1>
        <div class="red-subtitle">对应档位全套执行标准说明</div>
      </div>
      <hr class="gov-redline"/>
      <div class="gov-doc-no"><span>方案编号：${s.current.schemeNo}</span><span>客户单位：${esc(bi.customer)}</span></div>
      <div class="gov-section-title">已选档位执行标准与交付成果</div>
      ${items || '<div class="gov-empty">未勾选任何档位</div>'}
      <div class="gov-section-title">选配规则与IP交付保障</div>
      <div class="gov-rules">${buildRulesHtml(dict.rules)}</div>
    </div>`
}

export async function exportQuotePDF() {
  const s = useSchemeStore()
  const dict = useDictStore()
  await exportHTML(buildQuoteHTML(s, dict), `个性化选配确认单_${s.current.schemeNo}.pdf`)
}

export async function exportTablePDF() {
  const s = useSchemeStore()
  const dict = useDictStore()
  await exportHTML(buildTableHTML(s, dict), `明细组合报价表_${s.current.schemeNo}.pdf`)
}

export async function exportStandardPDF() {
  const s = useSchemeStore()
  const dict = useDictStore()
  await exportHTML(buildStandardHTML(s, dict), `档位全套执行标准说明_${s.current.schemeNo}.pdf`)
}

export async function exportAll() {
  await exportQuotePDF()
  await exportTablePDF()
  await exportStandardPDF()
}