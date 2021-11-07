import { createStore, Plugin } from 'vuex';

import persistence from '@/lib/persistence';

/**
 * Plugin array that should *only* be used in dev mode.
 * @private
 */
const plugins: Array<Plugin<unknown>> = [];

/**
 * VueX "module" stores, or nested state objects.
 * @private
 */
const modules = {};

export default createStore({
    plugins,
    modules
});