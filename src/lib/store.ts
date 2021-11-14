import { createStore } from 'vuex';

import persistence from 'vuex-persistedstate';

import eventBusStore from '@/lib/store_event_bus';
import settingsStore from '@/lib/store_settings';

const plugins = [  persistence({ key: 'settings', paths: ['settingsStore'] }) ];

const modules = {
    settingsStore,
    eventBusStore
};

export default createStore({ plugins,  modules });