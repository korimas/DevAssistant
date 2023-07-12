<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="text-h5">软件需求分析</div>
      <div class="column">
        <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter">
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="RequirementAnasys"/>
          </template>
        </q-input>
        <div class="row q-pa-md q-gutter-md">
          <q-chip v-model:selected="needDetail" icon="crop_din">
            尝试补充细节
          </q-chip>
        </div>
      </div>

      <div>
        <q-list bordered class="rounded-borders" v-show="requestReq || requestDetail">
          <q-expansion-item
            expand-separator
            label="补充实现细节"
            default-opened
            header-class="bg-grey-4"
            v-show="requestDetail"
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
            header-class="bg-grey-4"
            v-show="requestReq"
          >
            <q-card>
              <q-card-section>
                <div v-html="ReqMD" class="markdown-body"></div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

      </div>
    </div>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent"/>
    </q-page-scroller>
  </q-page>
</template>

<style>
.md-c table {
  border-collapse: collapse;
}

.md-c. tr {
  border: solid 1px black;
}

.md-c td {
  border: solid 1px black;
}

.md-c th {
  border: solid 1px black;
}

.md-c tr:nth-child(even) {
  background-color: #f2f2f2;
}

</style>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {marked} from 'marked';
import 'github-markdown-css';
import {useAPIStore} from 'stores/APIStore'

export default defineComponent({
  name: 'RequirementPage',
  setup() {
    let InputText = ref('')
    let DetailText = ref('')
    let DetailMD = ref('')
    let ReqText = ref('')
    let ReqMD = ref('')
    let Chatting = false
    let requestDetail = ref(false)
    let requestReq = ref(false)
    let needDetail = ref(false)
    const store = useAPIStore();

    async function RequirementAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      DetailText.value = ''
      DetailMD.value = ''
      ReqText.value = ''
      ReqMD.value = ''
      requestDetail.value = false
      requestReq.value = false

      Chatting = true

      // get req details
      if (needDetail.value) {
        requestDetail.value = true
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
            DetailMD.value = marked(DetailText.value)
          }

          if (done) {
            Chatting = false
            break
          }
        }
      }

      // get requirements
      requestReq.value = true
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
          ReqMD.value = marked(ReqText.value)
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
      needDetail,
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
