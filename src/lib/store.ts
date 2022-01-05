import { createStore } from 'vuex';

import eventBusStore from '@/lib/store_event_bus';
import settingsStore from '@/lib/store_settings';
import persistence   from '@/lib/persistence';

const plugins = [ persistence({ application_name: 'go-xbanki-me' }) ];

const modules = {
    settingsStore,
    eventBusStore
};

export default createStore({ plugins,  modules });