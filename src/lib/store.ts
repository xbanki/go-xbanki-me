import { createStore } from 'vuex';

import componentSettingsStore from '@/lib/store_component_settings';
import eventBusStore          from '@/lib/store_event_bus';
import settingsStore          from '@/lib/store_settings';
import persistence            from '@/lib/persistence';

const plugins = [ persistence({ application_name: 'go-xbanki-me', namespaces: ['settingsStore'] }) ];

const modules = {
    componentSettingsStore,
    settingsStore,
    eventBusStore
};

export default createStore({ plugins,  modules });