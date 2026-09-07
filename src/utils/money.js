const CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const CN_UNIT = ['', '拾', '佰', '仟']
const CN_SECTION = ['', '万', '亿', '兆']

function sectionToCN(section) {
  let str = ''
  for (let i = 3; i >= 0; i--) {
    const d = Math.floor(section / Math.pow(10, i)) % 10
    if (d === 0) {
      if (str && !str.endsWith('零')) str += '零'
    } else {
      str += CN_NUM[d] + CN_UNIT[i]
    }
  }
  str = str.replace(/零+$/, '')
  return str
}

function integerToCN(n) {
  if (n === 0) return ''
  const sections = []
  while (n > 0) {
    sections.push(n % 10000)
    n = Math.floor(n / 10000)
  }
  let str = ''
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = sections[i]
    if (sec === 0) continue
    if (str && !str.endsWith('零') && sec < 1000) {
      str += '零'
    }
    str += sectionToCN(sec) + CN_SECTION[i]
  }
  return str
}

export function toChineseAmount(num) {
  if (num === null || num === undefined || num === '') return ''
  num = Number(num)
  if (!Number.isFinite(num)) return ''
  if (num === 0) return '人民币零元整'

  const negative = num < 0
  num = Math.abs(num)
  const cents = Math.round(num * 100)
  const intPart = Math.floor(cents / 100)
  const jiao = Math.floor((cents % 100) / 10)
  const fen = cents % 10

  const intCN = intPart === 0 ? '' : integerToCN(intPart)
  let result = '人民币' + (negative ? '负' : '') + intCN + '元'

  if (jiao === 0 && fen === 0) {
    result += '整'
  } else {
    if (intPart > 0 && jiao === 0) result += '零'
    if (jiao > 0) result += CN_NUM[jiao] + '角'
    if (fen > 0) result += CN_NUM[fen] + '分'
  }
  return result
}

export function formatMoney(num) {
  if (num === null || num === undefined || num === '') return ''
  const n = Number(num)
  if (isNaN(n)) return ''
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function round2(num) {
  if (num === null || num === undefined || num === '') return 0
  const n = Number(num)
  if (isNaN(n)) return 0
  return Math.round(n * 100) / 100
}