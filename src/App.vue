<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from "./components/ProductComponent/NavbarComponent.vue";
 
</script>

 <template>
 
 <NavbarComponent/>
  <div class="routerview" style="margin-top: 75px;">
    <RouterView />

  </div>
 
  
 </template>

<script setup lang="ts">
  
</script>