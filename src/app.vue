<script>
import LanguageSwitcher from "./public/components/language-switcher.component.vue";

export default {
  name: 'app',
  components: {LanguageSwitcher},
  title: 'TelaSecure',
  data() {
    return {
      drawer: false, // Puedes cambiar esto a false para que el drawer no aparezca
      items: [
        {label: 'Home', to: '/home'},
        {label: 'Cocineros', to: '/chefs'},
        {label: 'Publicaciones', to: '/posts'},
        {label: 'Pedidos', to: '/orders'},
        {label: 'Recetas', to: '/dishes'},
        {label: 'Favoritos', to: '/favorites'},
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <header>
    <pv-toolbar class="dark-toolbar full-width">
      <template #start>
        <img src="/src/assets/Logo_Sabores_Cercano.png" alt="Logo" width="80px"/>
        <h3 class="title-color">Sabores Cercanos</h3>
      </template>
      <template #center>
        <div class="flex-column">
          <router-link v-for="item in items"
                       :key="item.label"
                       v-slot="{ navigate, href }"
                       :to="item.to" custom>
            <pv-button class="p-button-text no-border" :href="href" @click="navigate">{{ item.label }}</pv-button>
          </router-link>
          <router-link to="/sign-in">
            <pv-button class="toolbar-icon" id="sign-in-icon">Sign In</pv-button>
          </router-link>
          <router-link to="/sign-up">
            <pv-button class="toolbar-icon" id="sign-up-icon">Sign Up</pv-button>
          </router-link>
        </div>
      </template>
      <template #end>
        <language-switcher></language-switcher>
      </template>
    </pv-toolbar>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<style scoped>
/* Estilo para que el toolbar ocupe todo el ancho */
.full-width {
  width: 100%; /* Hace que el toolbar sea del ancho completo */
  position: fixed; /* Fija el toolbar en la parte superior */
  top: 0;
  left: 0;
  height: 80px;
  z-index: 1000; /* Asegura que se superponga al contenido */
}

/* Estilo para el toolbar */
.dark-toolbar {
  background-color: darkorange; /* Cambia el color de fondo a naranja */
  color: white; /* Texto en color blanco */
  display: flex;
  align-items: center;
  align-content: center;
}

/* Estilo para los botones del toolbar sin borde */
.no-border {
  border: none; /* Elimina el borde de los botones */
  background: none; /* Elimina el fondo del botón */
  color: white; /* Asegura que el texto sea blanco */
}

/* Oculta el pv-drawer */
pv-drawer {
  display: none; /* Oculta completamente el drawer */
}

</style>
