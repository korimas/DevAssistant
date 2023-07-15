<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="text-h5">软件需求分析</div>
      <div class="column">
        <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"
                 :disable="isChatting">
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="RequirementAnasys"/>
          </template>
        </q-input>
        <div class="row" style="margin-top: 13px">
          <q-chip v-model:selected="needDetail" icon="panorama_fish_eye" icon-selected="task_alt">
            尝试补充细节(Beta)
          </q-chip>
        </div>
      </div>

      <div>
        <q-list bordered class="rounded-borders" v-show="requestStep > 0">
          <q-expansion-item
            expand-separator
            label="补充实现细节"
            header-class="bg-grey-4"
            v-show="requestStep === 1 || detailGot"
            v-model="DetailExpanded"
          >
            <template v-slot:header>
              <q-item-section side>
                <div class="row items-center">
                  <q-circular-progress
                    indeterminate
                    size="sm"
                    :thickness="0.5"
                    font-size="50px"
                    color="teal"
                    track-color="grey-3"
                    center-color="grey-8"
                    v-if="!detailGot"
                  />

                  <q-icon name="task_alt" size="sm"
                          v-if="detailGot"
                  ></q-icon>
                </div>
              </q-item-section>
              <q-item-section>
                <div class="row">
                  <div>补充实现细节</div>
                  <div class="row items-center">
                    <q-btn flat icon="edit" color="primary" size="sm" @click.stop @click="editDetailText"
                           :disable="!requirementGot"/>
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>

              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <div v-if="!inEditDetail" v-html="DetailMD" class="markdown-body"></div>
                <q-input v-if="inEditDetail" outlined type="textarea"
                         v-model="DetailText"
                         label="细节"
                         class="fit"
                         autogrow
                >
                  <template v-slot:after>
                    <div class="column">
                      <q-btn dense flat icon="save" @click="ParseDetailMarkdown"/>
                      <q-btn dense flat color="primary" @click="inEditDetail = false">取消</q-btn>
                    </div>
                  </template>
                </q-input>

              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="输出软件需求"
            default-opened
            header-class="bg-grey-4"
            v-show="requestStep > 1"
            v-model="reqExpanded"
          >

            <template v-slot:header>
              <q-item-section side>
                <div class="row items-center">
                  <q-circular-progress
                    indeterminate
                    size="sm"
                    :thickness="0.5"
                    font-size="50px"
                    color="teal"
                    track-color="grey-3"
                    center-color="grey-8"
                    v-if="!requirementGot"
                  />

                  <q-icon name="task_alt" size="sm"
                          v-if="requirementGot"
                  ></q-icon>
                </div>
              </q-item-section>
              <q-item-section>
                输出软件需求
              </q-item-section>
            </template>


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
    let requestStep = ref(0)
    const store = useAPIStore();
    let isChatting = ref(false)

    // get detail related
    let DetailText = ref('')
    let DetailMD = ref('')
    let inEditDetail = ref(false)
    let needDetail = ref(false)
    let DetailExpanded = ref(true)
    let reqExpanded = ref(true)
    let detailGot = ref(false)

    // get requirement related
    let ReqText = ref('')
    let ReqMD = ref('')
    let requirementGot = ref(false)


    async function GetDetails() {
      if (InputText.value == '' || isChatting.value) {
        return
      }

      isChatting.value = true
      DetailText.value = ''
      DetailMD.value = ''
      DetailExpanded.value = true
      requestStep.value = 1
      detailGot.value = false

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
          break
        }
      }
      detailGot.value = true
      isChatting.value = false
    }

    async function GetRequirements() {

      if (InputText.value == '' || isChatting.value) {
        return
      }
      isChatting.value = true
      requirementGot.value = false
      ReqText.value = ''
      ReqMD.value = ''
      requestStep.value = 2
      DetailExpanded.value = false
      reqExpanded.value = true

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
          break
        }
      }
      requirementGot.value = true
      isChatting.value = false
    }

    async function RequirementAnasys() {

      if (InputText.value == '' || isChatting.value) {
        return
      }

      requestStep.value = 0
      detailGot.value = false
      requirementGot.value = false

      // get req details
      if (needDetail.value) {
        await GetDetails()
      }
      await GetRequirements()
    }

    function handleEnter(e: any) {
      if (e.ctrlKey) {
        RequirementAnasys()
        console.log('send')
      }
    }

    function editDetailText() {
      inEditDetail.value = true
      console.log('send')
    }

    async function ParseDetailMarkdown() {
      DetailMD.value = marked(DetailText.value)
      inEditDetail.value = false
      await GetRequirements()
    }

    return {
      InputText,
      DetailText,
      DetailMD,
      needDetail,
      ReqMD,
      inEditDetail,
      handleEnter,
      DetailExpanded,
      reqExpanded,
      requestStep,
      editDetailText,
      RequirementAnasys,
      ParseDetailMarkdown,
      detailGot,
      requirementGot,
      isChatting
    }
  }
});
</script>

<style scoped>

</style>
