import { createStore } from 'vuex';

import settingsStore from '@/lib/store_settings';
import persistence   from '@/lib/persistence';

const plugins = [
    persistence({ prefectch: true, name: 'settingsStore' })
];

const modules = {
    settingsStore
};

export default createStore({ plugins,  modules });