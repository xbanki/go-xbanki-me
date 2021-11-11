import { createStore } from 'vuex';

import persistence from 'vuex-persistedstate';

import settingsStore from '@/lib/store_settings';

const plugins = [  persistence({ key: 'settings', paths: ['settingsStore'] }) ];

const modules = { settingsStore };

export default createStore({ plugins,  modules });