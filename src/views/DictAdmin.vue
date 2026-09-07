<template>
  <div class="gov-list-wrap">
    <div class="no-print" style="display:flex;align-items:center;gap:10px;margin-bottom:18px;border-bottom:2px solid var(--gov-red);padding-bottom:12px;">
      <span class="tb-title" style="color:var(--gov-red);font-family:var(--font-title);font-size:18px;font-weight:bold;margin-right:auto;">字典数据维护后台</span>
      <button class="gov-btn dark" @click="onSave">保存字典</button>
      <button class="gov-btn dark" @click="$router.push('/')">返回表单</button>
    </div>
    <p style="color:var(--gov-text-mute);font-size:13px;margin-bottom:16px;">
      说明：此处维护各模块档位服务描述、增值项、规则文本。价格不属于字典，由各报价项目实例手动录入。
    </p>

    <div class="gov-card" v-for="m in dict.modules" :key="m.id">
      <div class="gov-card-head">
        <span class="mod-name">模块{{ m.code }}：{{ m.name }}</span>
        <span class="mod-tag" v-if="m.element">五行·{{ m.element }}</span>
      </div>
      <div class="gov-card-body">
        <div class="gov-field-grid">
          <div class="gov-field"><span class="field-label">模块名称</span><div class="field-control"><input class="gov-input w-full" v-model="m.name" /></div></div>
          <div class="gov-field"><span class="field-label">五行标签</span><div class="field-control"><input class="gov-input w-md" v-model="m.element" /></div></div>
          <div class="gov-field full"><span class="field-label">标签说明</span><div class="field-control"><input class="gov-input w-full" v-model="m.elementDesc" /></div></div>
          <div class="gov-field full"><span class="field-label">标配提示</span><div class="field-control"><textarea class="gov-input w-full" rows="2" v-model="m.standardHint"></textarea></div></div>
        </div>
        <template v-if="m.type === 'level'">
          <div class="gov-level-row" v-for="lv in m.levels" :key="lv.level" style="margin-top:10px;">
            <div class="gov-level-head"><span class="gov-level-label">{{ lv.level }}档</span></div>
            <div class="gov-card-body">
              <div class="gov-field"><span class="field-label">档位名称</span><div class="field-control"><input class="gov-input w-full" v-model="lv.name" /></div></div>
              <div class="gov-field full" style="margin-top:8px;"><span class="field-label">服务描述</span><div class="field-control"><textarea class="gov-input w-full" rows="4" v-model="lv.desc"></textarea></div></div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="gov-card" v-if="dict.teaSubOptions.length">
      <div class="gov-card-head"><span class="mod-name">茶歇子选项</span></div>
      <div class="gov-card-body">
        <div class="gov-level-row" v-for="opt in dict.teaSubOptions" :key="opt.id">
          <div class="gov-level-head"><span class="gov-level-label">{{ opt.id }}</span></div>
          <div class="gov-card-body">
            <div class="gov-field"><span class="field-label">选项名称</span><div class="field-control"><input class="gov-input w-full" v-model="opt.name" /></div></div>
            <div class="gov-field full" style="margin-top:8px;"><span class="field-label">说明</span><div class="field-control"><textarea class="gov-input w-full" rows="3" v-model="opt.desc"></textarea></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="gov-card">
      <div class="gov-card-head"><span class="mod-name">增值可选单项</span></div>
      <div class="gov-card-body">
        <div class="gov-level-row" v-for="ad in dict.addons" :key="ad.id">
          <div class="gov-level-head"><span class="gov-level-label">{{ ad.id }}</span></div>
          <div class="gov-card-body">
            <div class="gov-field"><span class="field-label">服务名称</span><div class="field-control"><input class="gov-input w-full" v-model="ad.name" /></div></div>
            <div class="gov-field full" style="margin-top:8px;"><span class="field-label">服务描述</span><div class="field-control"><textarea class="gov-input w-full" rows="3" v-model="ad.desc"></textarea></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="gov-card">
      <div class="gov-card-head"><span class="mod-name">选配规则与交付保障</span></div>
      <div class="gov-card-body">
        <div class="gov-level-row" v-for="(r, i) in dict.rules" :key="i">
          <div class="gov-level-head"><span class="gov-level-label">规则{{ i + 1 }}</span></div>
          <div class="gov-card-body">
            <div class="gov-field"><span class="field-label">标题</span><div class="field-control"><input class="gov-input w-full" v-model="r.title" /></div></div>
            <div class="gov-field full" style="margin-top:8px;"><span class="field-label">内容</span><div class="field-control"><textarea class="gov-input w-full" rows="4" v-model="r.content"></textarea></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-print" style="text-align:center;margin-top:20px;">
      <button class="gov-btn dark" @click="onSave">保存字典</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDictStore } from '@/stores/dict'
import { notify } from '@/utils/notify'

const dict = useDictStore()

onMounted(async () => {
  await dict.load()
})

async function onSave() {
  await dict.persist()
  notify('字典已保存', 'success')
}
</script>