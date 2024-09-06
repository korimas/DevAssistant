<template>
  <q-item
    active-class="bg-grey-3 text-grey-8"
    clickable
    v-ripple
    :to="link"
    :disable="disable"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <!--      <q-item-label caption>{{ caption }}</q-item-label>-->
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },

    disable: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
