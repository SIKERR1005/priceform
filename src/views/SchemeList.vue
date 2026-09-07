<template>
  <div class="gov-list-wrap">
    <div class="no-print" style="display:flex;align-items:center;gap:10px;margin-bottom:18px;border-bottom:2px solid var(--gov-red);padding-bottom:12px;">
      <span class="tb-title" style="color:var(--gov-red);font-family:var(--font-title);font-size:18px;font-weight:bold;margin-right:auto;">报价方案管理列表</span>
      <button class="gov-btn dark" @click="onNew">新建报价方案</button>
      <button class="gov-btn dark" @click="goDict">字典后台</button>
    </div>

    <table class="gov-table" v-if="s.list.length">
      <thead>
        <tr>
          <th>方案编号</th>
          <th>客户单位</th>
          <th>会议名称</th>
          <th class="num">总金额(元)</th>
          <th>状态</th>
          <th>创建时间</th>
          <th class="no-print">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in s.list" :key="row.id">
          <td>{{ row.schemeNo }}</td>
          <td>{{ row.baseInfo?.customer || '-' }}</td>
          <td>{{ row.baseInfo?.meetingName || '-' }}</td>
          <td class="num">{{ formatMoney(computeTotal(row)) }}</td>
          <td>{{ row.status === 'confirmed' ? '已确认' : '草稿' }}</td>
          <td>{{ fmtDate(row.createdAt) }}</td>
          <td class="no-print">
            <button class="gov-btn ghost" @click="onEdit(row)">编辑</button>
            <button class="gov-btn ghost" @click="onCopy(row)">复制</button>
            <button class="gov-btn ghost" @click="onDel(row)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="gov-empty" v-else>暂无方案，请点击「新建报价方案」</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSchemeStore } from '@/stores/scheme'
import { formatMoney, round2 } from '@/utils/money'
import { notify } from '@/utils/notify'

const router = useRouter()
const s = useSchemeStore()

onMounted(async () => {
  await s.fetchList()
})

function computeTotal(row) {
  let total = 0
  for (const k in row.selections) {
    const sel = row.selections[k]
    if (sel && sel.level) total += round2((Number(sel.price) || 0) * (Number(sel.qty) || 0))
  }
  for (const k in row.addons) {
    const a = row.addons[k]
    if (a && a.selected) total += round2((Number(a.price) || 0) * (Number(a.qty) || 0))
  }
  return round2(total)
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function onNew() {
  s.newScheme()
  router.push('/')
}
function onEdit(row) {
  router.push('/?id=' + row.id)
}
async function onCopy(row) {
  await s.duplicate(row.id)
  notify('方案已复制', 'success')
}
async function onDel(row) {
  if (!confirm(`确认删除方案 ${row.schemeNo}？`)) return
  await s.remove(row.id)
  notify('方案已删除', 'success')
}
function goDict() {
  router.push('/dict')
}
</script>