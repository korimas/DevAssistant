<template>
  <!-- <q-dialog v-model="AuthRequire" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">请输入密码</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            type="password"
            v-model="Password"
            autofocus
            @keyup.enter="Auth"
          />
          <p class="text-grey text-right">Note: My company name.</p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="确定" @click="Auth" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import axios from 'axios';
// import { Password as LocalPassword, savePassword } from './RobotModels';
// import { useAPIStore } from 'stores/APIStore';

let AuthRequire = ref(false);
let AuthSuccess = ref(true);
// let Password = ref(LocalPassword);

// function Auth() {
//   axios
//     .post('/api/auth', { password: Password.value })
//     .then((response: any) => {
//       // handle response
//       if (response && response.data.success) {
//         AuthRequire.value = false;
//         AuthSuccess.value = true;
//         savePassword(Password.value);
//       }
//     })
//     .catch((error: any) => {
//       // handle error
//       Password.value = '';
//       console.error(error);
//     });
// }
</script>
