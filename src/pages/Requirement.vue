<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">软件需求分析</div>
    <div class="row">
      <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"/>
      <q-btn color="primary" style="margin-left: 10px" @click="RequirementAnasys">
        <div class="text-center">
          提交<br>Ctrl + Enter
        </div>
      </q-btn>
    </div>
    <div>

      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          label="补充实现细节"
          default-opened
        >
          <q-card>
            <q-card-section>
              <div v-html="DetailMD" class="markdown-body"></div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="输出软件需求"
          default-opened
        >
          <q-card>
            <q-card-section>
              <div v-html="ReqMD" class="markdown-body"></div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-list>

<!--      <div v-html="DetailMD" class="markdown-body"></div>-->
<!--      <div v-html="ReqMD" class="markdown-body" style="margin-top: 30px;"></div>-->
    </div>
<!--    <div style="white-space: pre-wrap">{{OutputText}}</div>-->
  </div>
</template>

<style>
.md-c table { border-collapse: collapse; }
.md-c. tr { border: solid 1px black; }
.md-c td {border: solid 1px black;}
.md-c th {border: solid 1px black;}
.md-c tr:nth-child(even) {background-color: #f2f2f2;}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {marked} from 'marked';
import 'github-markdown-css';
import { useAPIStore } from 'stores/APIStore'

export default defineComponent({
  name: 'RequirementPage',
  setup() {
    let InputText = ref('')
    let DetailText = ref('')
    let DetailMD = ref('')
    let ReqText = ref('')
    let ReqMD = ref('')
    let Chatting = false
    let requestDetail = false
    let requestReq = false
    const store = useAPIStore();

    async function RequirementAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      DetailText.value = ''
      DetailMD.value = ''
      ReqText.value = ''
      ReqMD.value = ''
      requestDetail = false
      requestReq = false

      Chatting = true

      // get req details
      requestDetail = true
      const detailResp = await fetch('/api/stream-req-details', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'model': store.model,
          'requirement': InputText.value,
          'temperature': store.temperature,
        })
      })

      const detailReader = detailResp.body!.getReader()
      const detailDecoder = new TextDecoder('utf-8')

      while (true) {
        const {value, done} = await detailReader.read()

        if (value) {
          DetailText.value = DetailText.value + detailDecoder.decode(value)
          DetailMD.value = marked('### Step1：补充实现细节：\r\n' + DetailText.value)
        }

        if (done) {
          Chatting = false
          break
        }
      }

      // get requirements
      requestReq = true
      const response = await fetch('/api/stream-requirement', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'model': store.model,
          'requirement': InputText.value,
          'detail': DetailText.value,
          'temperature': store.temperature,
        })
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const {value, done} = await reader.read()

        if (value) {
          ReqText.value = ReqText.value + decoder.decode(value)
          ReqMD.value = marked('### Step2：输出软件需求\r\n' + ReqText.value)
        }

        if (done) {
          Chatting = false
          break
        }
      }
    }

    function handleEnter(e: any) {
      if (e.ctrlKey) {
        RequirementAnasys()
        console.log('send')
      }
    }

    return {
      InputText,
      DetailMD,
      ReqMD,
      handleEnter,
      requestDetail,
      requestReq,
      RequirementAnasys
    }
  }
});
</script>

<style scoped>

</style>
