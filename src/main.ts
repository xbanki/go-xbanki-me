import { createApp } from 'vue';

import RootComponent from '@/vue/root/root.vue';
import store         from '@/lib/store';

// Create, mount & use VueX store for state.
const application = createApp(RootComponent);

// Temporary config call for pre-Vue 3.3
application.config.unwrapInjectedRef = true;

// Use store & mount
application.use(store).mount('#go-xbanki-application');