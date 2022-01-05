import { MutationPayload, Store } from 'vuex';

import semver from 'semver';

import application_data from '~/package.json';

import { ModuleState } from '@/lib/store_event_bus';
import Queue           from '@/lib/queue';

export interface PersistenceOptions {
    application_name: string;
    namespaces?: string[];
}

interface PersistenceMetadata {
    last_used_version: string;
}

const persistence_defaults: PersistenceOptions = {
    application_name: 'vuex',
    namespaces: undefined
};

function verify_localstorage_availlability() {
    try {
        const storage: Storage = window['localStorage'];

        storage.setItem('@@', '@');
        storage.removeItem('@@');

        return true;
    }

    catch (err) {
        return err instanceof DOMException && (
            err.code == 22   ||
            err.code == 1014 ||

            err.name == 'QuotaExceededError' ||
            err.name == 'NS_ERROR_DOM_QUOTA_REACHED'
        ) &&
        (localStorage && localStorage.length != 0);
    }
}

export default function<State>(options?: PersistenceOptions): (store: Store<State>) => void {

    const storage_options = Object.assign(persistence_defaults, options);
    const storage_test = verify_localstorage_availlability();
    const task_queue = new Queue<() => void>();


    let should_open_updates_panel = false;

    if (storage_test != true) {
        throw new Error('LocalStorage API not supported');
    }

    const application_metadata = localStorage.getItem(`${storage_options.application_name}-metadata`);

    if (application_metadata == null) {
        const new_metadata: PersistenceMetadata = { last_used_version: application_data.version };

        task_queue.Enqueue(() => localStorage.setItem(`${storage_options.application_name}-metadata`, JSON.stringify(new_metadata)));
    }

    else {
        const metadata = JSON.parse(application_metadata) as PersistenceMetadata;

        const semver_diff = semver.diff(application_data.version, metadata.last_used_version);
        const semver_gt   = semver.gt(application_data.version, metadata.last_used_version);

        if (semver_gt && semver_diff != 'patch' && semver_diff != 'prepatch' && semver_diff != 'prerelease') {
            should_open_updates_panel = true;
        }
    }

    return function(store: Store<State>) {
        const store_state = store.state as unknown as { eventBusStore: ModuleState };

        const mutation_subscriber = (mutation: MutationPayload, state: State) => {
            if (storage_options.namespaces != undefined) { /* */ }

            else {
                task_queue.Enqueue(() => localStorage.setItem(`${storage_options.application_name}`, JSON.stringify(store.state)));
            }

            if (store_state.eventBusStore.supports_data_persistence) while (task_queue.length > 0) {
                const task = task_queue.Dequeue();

                if (task != undefined) task();
                else break;
            }
        };

        store.subscribe(mutation_subscriber);
    };
}