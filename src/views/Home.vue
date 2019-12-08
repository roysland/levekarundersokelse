<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <bydels-tree></bydels-tree>
  </div>
</template>

<script>
// @ is an alias to /src
import BydelsTree from '@/components/BydelsTree'
import HelloWorld from '@/components/HelloWorld'
export default {
  name: 'home',
  components: { BydelsTree, HelloWorld }
}
</script>
