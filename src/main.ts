import { createApp } from 'vue';

import RootComponent from '@/vue/root/root.vue';
import store         from '@/lib/store';

// Create, mount & use VueX store for state.
createApp(RootComponent)
    .use(store)
    .mount('#go-xbanki-application');