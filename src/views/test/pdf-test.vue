<template>
 <div>
  <!-- <Mypdf :url="url"></Mypdf> -->
  <Word :wordURL="'http://127.0.0.1/ideo_resource/1651204340943159296.docx'"></Word>
 </div>
</template>

<script>
import Mypdf from '../../components/file/mypdf.vue'
import Word from '../../components/file/word.vue'

export default {
  components: {
    Mypdf,
    Word
  },
  data() {
    return {
      url:'http://127.0.0.1/ideo_resource/1651566692666441728.pdf'
    }
  }
}
</script>

<style>

</style>