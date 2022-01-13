import { MutationPayload, Store } from 'vuex';

import deepmerge from 'deepmerge';
import semver    from 'semver';

import application_data from '~/package.json';

import config from '@/lib/config';
import Queue  from '@/lib/queue';

/**
 * Persistence plugin setup options.
 * @public
 */
export interface PersistenceOptions {

    /**
     * Application name which is used to prefix all saved storage states.
     * @type {string}
     */
    application_name: string;

    /**
     * `namespaces` are keys present in the root module level that should be persisted.
     * @type {Array<string>}
     */
    namespaces?: string[];
}

/**
 * Internal metadata for the persistence plugin.
 * @private
 */
interface PersistenceMetadata {

    /**
     * Last valid semantic version used with this persistence module.
     * @type {string}
     */
    last_used_version: string;

    /**
     * List of keys that this persistence module uses.
     * @type {Array<string>}
     */
    known_namespaces: string[];

    /**
     * Application name which is used to prefix all saved storage states.
     * @type {string}
     */
     application_name: string;
}

/**
 * Plugin persistence options defaults.
 * @see {PersistenceOptions}
 */
const persistence_defaults: PersistenceOptions = {
    application_name: 'vuex',
    namespaces: undefined
};

/**
 * Sets & unsets temporary value in to the browser local storage to test availlability.
 * @return {boolean}
 */
export function verify_localstorage_availlability() {
    try {
        const storage: Storage = window['localStorage'];

        storage.setItem('@@', '@');
        storage.removeItem('@@');

        return true;
    }

    catch (err) {
        if (config.dev_mode) console.error(err);

        return err instanceof DOMException && (
            err.code == 22   ||
            err.code == 1014 ||

            err.name == 'QuotaExceededError' ||
            err.name == 'NS_ERROR_DOM_QUOTA_REACHED'
        ) &&
        (localStorage && localStorage.length != 0);
    }
}

/**
 * Determines version difference, only returning true if the version difference is significant.
 * @param  {string}  version - Version which to compare against
 * @return {boolean}
 */
function discriminate_significant_version(version: string) {
    try {
        const greater_than = semver.gt(application_data.version, version);
        const difference = semver.diff(application_data.version, version);

        if (greater_than && difference != 'patch' && difference != 'prepatch' && difference != 'prerelease') return true;

        return false;
    }

    catch(err) {
        if (config.dev_mode) console.error(err);

        return false;
    }
}

export default function<State>(options?: PersistenceOptions): (store: Store<State>) => void {

    /**
     * Merged user & default persistence options.
     * @see {PersistenceOptions}
     */
    const storage_options = Object.assign(persistence_defaults, options);

    /**
     * Queue of callback functions which are **only** executed if we detect the end user having accepted cookie usage.
     * @type {Queue<void>}
     */
    const task_queue = new Queue<() => void>();

    /**
     * Gets and automatically parses **existing** state objects from the browser's local storage.
     * @param  {string}            key - Identifier key which is automatically converted to format `[application-name]-[key]`
     * @return {T | undefined}           Parsed object or `undefined` if object does not exist in storage
     */
    const get_state = (key: string) => localStorage.getItem(`${storage_options.application_name}-${key}`) != null ? JSON.parse(localStorage.getItem(`${storage_options.application_name}-${key}`) as string) : undefined;

    /**
     * Sets or overrides a persisted state object, with the name format `[application_name]-[key]`.
     * @param  {string} key   - Name of the state object which will be identified on disk by
     * @param  {T}      value - Object body that is automatically converted to type `string`
     */
    const set_state = <T>(key: string, value: T) => localStorage.setItem(`${storage_options.application_name}-${key}`, JSON.stringify(value));

    /**
     * Fetches the application metadata from the local storage if it exists.
     * @return {PersistenceMetadata | undefined} Parsed application metadata or `undefined` if object does not exist in storage
     */
    const fetch_metadata = () => localStorage.getItem(`metadata-${storage_options.application_name}`) != null ? JSON.parse(localStorage.getItem(`metadata-${storage_options.application_name}`) as string) : undefined;

    /**
     * Determines wether or not persistence is enabled by the existence of metadata cache.
     * @return {boolean}
     */
    const discriminate_persistence = () => fetch_metadata() != undefined ? true : false;

    /**
     * Fetches and merges all known state objects in to one object.
     * @param {PersistenceMetadata} - Metadata which to read all target objects from.
     */
    const fetch_state = (metadata: PersistenceMetadata) => metadata.known_namespaces.reduce((state, substate) => (substate != undefined && typeof substate == 'string' && get_state(substate) != undefined) ? Object.assign(state, { [substate]: get_state(substate) }) : state, {});

    // Validate storage availlability
    if (verify_localstorage_availlability() != true) throw new Error('LocalStorage API not supported');

    // Validate namespace names in dev mode
    if (storage_options.namespaces && config.dev_mode) for (const namespace of storage_options.namespaces) {
        /^[^0-9][a-zA-Z0-9$_]+$/.test(namespace) ? undefined : console.warn(`Invalid namespace key: ${namespace}`);
    }

    /**
     * Active application metadata.
     * @see {PersistenceMetadata}
     */
    let metadata: PersistenceMetadata = fetch_metadata();

    /**
     * Signals wether or not we have had a significant update.
     * @type {boolean}
     */
    let significant_update = false;

    // Create new metadata object when we're running for the first time
    if (!metadata) {
        const last_used_version = application_data.version;
        const application_name = storage_options.application_name;
        const known_namespaces: string[] = [...storage_options.namespaces ?? []];

        metadata = { last_used_version, known_namespaces, application_name  };

        task_queue.Enqueue(() => localStorage.setItem(`metadata-${storage_options.application_name}`, JSON.stringify(metadata)));
    }

    // Update metadata object, while also signalling end user when needed
    else {

        /**
         * Application current version which to update to.
         * @type {string}
         */
        const last_used_version = application_data.version;

        /**
         * Updated known namespaces.
         * @type {Array<string>}
         */
        let known_namespaces: string[] = metadata.known_namespaces;

        /**
         * Application display name.
         * @type {string}
         */
        const application_name = storage_options.application_name;

        /**
         * Enables or disables updating saved cache.
         * @type {boolean}
         */
        let should_update_cache = false;

        // Namespace updater
        if (metadata.known_namespaces != storage_options.namespaces) {
            known_namespaces = storage_options.namespaces ?? [];
            should_update_cache = true;
        }

        // Version checker & significant update discriminator
        if (metadata.last_used_version != application_data.version) {
            significant_update = discriminate_significant_version(metadata.last_used_version);

            should_update_cache = true;
        }

        // Persisted metadata updater
        if (should_update_cache) {
            metadata = { last_used_version, known_namespaces, application_name };

            task_queue.Enqueue(() => localStorage.setItem(`metadata-${storage_options.application_name}`, JSON.stringify(metadata)));
        }
    }

    /**
     * Active application state.
     * @see {State}
     */
    const state = fetch_state(metadata) as State;

    return function(store: Store<State>) {

        /**
         * Flag to stop exceeding maximum callstack errors.
         * @type {boolean}
         */
        let discriminated_successfully = false;

        /**
         * Detects wether or not we are allowed to save state to disk.
         * @return {boolean}
         */
        const allowed_to_persist = (target_store: Store<any>) => target_store?.state?.eventBusStore?.supports_data_persistence ?? false;

        // Set the state by merging existing and saved states
        store.replaceState(deepmerge(store.state, { ...state, __metaData: metadata } as State, { clone: false, arrayMerge: (current, saved) => saved }));

        if (significant_update) store.commit('eventBusStore/SIGNAL_SIGNIFICANT_UPDATE');

        /**
         * Subscriber callback which is responsible for reacting to state changes.
         * @see {Store.subscribe}
         */
        const subscriber = (mutation: MutationPayload, state: State) => {

            /**
             * Recursively persists known namespaces if they exist in the store state
             * @param {string} namespace - Name of the known namespace which to handle
             */
            const namespace_mapper = (namespace: string) => {
                const stripped_namespace = namespace.replace(`${storage_options.application_name}-`, '');

                if (stripped_namespace in store.state) {
                    const persistable_state = store.state as any;

                    task_queue.Enqueue(() => set_state(stripped_namespace, persistable_state[stripped_namespace]));
                }
            };

            // Do namespaces persistence
            if (metadata.known_namespaces.length >= 1) metadata.known_namespaces.map(namespace_mapper);

            // Do global persistence if no namespaces
            if (metadata.known_namespaces.length <= 0 && config.dev_mode) console.warn('Global object persistence is not currently supported.');

            // Keep on top of data persistence permission
            if (!discriminated_successfully && discriminate_persistence()) {
                discriminated_successfully = true;

                store.commit('eventBusStore/ENABLE_DATA_PERSISTENCE');
            }

            if (allowed_to_persist(store)) while (task_queue.length > 0) {
                const task = task_queue.Dequeue();

                if (!task) break;

                task();
            }
        };

        // Handle state activity
        store.subscribe(subscriber);
    };
}