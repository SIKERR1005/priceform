<template>
  <div class="gov-card">
    <div class="gov-card-head"><span class="mod-name">一、项目基础信息</span></div>
    <div class="gov-card-body">
      <div class="gov-field-grid">
        <div class="gov-field full">
          <span class="field-label gov-required">客户单位名称</span>
          <div class="field-control">
            <input class="gov-input w-full" v-model="s.current.baseInfo.customer" placeholder="请输入客户单位全称" />
          </div>
        </div>
        <div class="gov-field full">
          <span class="field-label gov-required">会议活动名称</span>
          <div class="field-control">
            <input class="gov-input w-full" v-model="s.current.baseInfo.meetingName" placeholder="请输入会议活动名称" />
          </div>
        </div>
        <div class="gov-field">
          <span class="field-label">预估参会人数</span>
          <div class="field-control">
            <input class="gov-input w-md" type="number" min="0" v-model.number="s.current.baseInfo.attendees" placeholder="人数" />
          </div>
        </div>
        <div class="gov-field">
          <span class="field-label">预估活动日期</span>
          <div class="field-control">
            <input class="gov-input w-md" type="date" v-model="s.current.baseInfo.meetingDate" />
          </div>
        </div>
        <div class="gov-field full">
          <span class="field-label">预算区间</span>
          <div class="field-control">
            <input class="gov-input w-lg" v-model="s.current.baseInfo.budgetRange" placeholder="例如：10-15万元" />
          </div>
        </div>
        <div class="gov-field full">
          <span class="field-label">会务模式</span>
          <div class="field-control">
            <div class="gov-mode-options">
              <label><input type="radio" class="gov-radio" value="full" v-model="s.current.baseInfo.meetingMode" />常规全天会务</label>
              <label><input type="radio" class="gov-radio" value="211" v-model="s.current.baseInfo.meetingMode" />16:00-19:00「2+1」错峰创新会务模式（2小时干货分享+1小时深度对接）</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSchemeStore } from '@/stores/scheme'
const s = useSchemeStore()
</script>