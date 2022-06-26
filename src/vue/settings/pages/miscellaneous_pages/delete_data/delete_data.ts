import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import application_data from '~/package.json';
import FileSaver        from 'file-saver';

import type { PersistenceMetadata } from '@/lib/persistence';

import { ModuleState as EventState }          from '@/lib/store_event_bus';
import { ModuleState as SettingsState }       from '@/lib/store_settings';
import { verify_localstorage_availlability  } from '@/lib/persistence';


import store from '@/lib/store';

/**
 * Delete button labels.
 */
enum DeleteButtonLabel {
    INITIAL = 'Delete Saved Data',
    CONFIRM = 'Confirm?'
}

/**
 * Backup button labels.
 */
enum BackupButtonLabel {
    INITIAL = 'Backup Saved Data',
    CONFIRM = 'Confirm?'
}

/**
 * Display label states.
 */
interface ComponentStateDisplay {

    /**
     * Delete data button label.
     * @enum {DeleteButtonLabel}
     */
    remove: DeleteButtonLabel;

    /**
     * Backup saved data button label.
     * @enum {BackupButtonLabel}
     */
    backup: BackupButtonLabel;

    /**
     * Restore backed up data button label.
     * @type {string}
     */
    restore: string;
}

/**
 * Button disable states.
 */
interface ComponentStateDisabled {

    /**
     * Delete button disable state.
     * @type {boolean}
     */
    disable_remove: boolean;

    /**
     * Disabled back up button.
     * @type {boolean}
     */
    disable_backup: boolean;

    /**
     * Disables restore button.
     * @type {boolean}
     */
    disable_restore: boolean;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Button label state.
     * @type {ComponentStateDisplay}
     */
    display: ComponentStateDisplay;

    /**
     * Button disabled states.
     * @type {ComponentStateDisabled}
     */
    disabled: ComponentStateDisabled;
}

export default defineComponent({

    data() {

        const typed_store = store as Store<{ eventBusStore: EventState, settingsStore: SettingsState }>;

        // Display state defaults

        const remove = DeleteButtonLabel.INITIAL;

        const backup = BackupButtonLabel.INITIAL;

        const restore = 'Restore Saved Data';

        // Disable state defaults

        const disable_remove = !(typed_store.state.eventBusStore.supports_data_persistence);

        const disable_backup = !(typed_store.state.eventBusStore.supports_data_persistence);

        const disable_restore = false;

        // Final assembled state objects

        const disabled: ComponentStateDisabled = {
            disable_restore,
            disable_backup,
            disable_remove
        };

        const display: ComponentStateDisplay = {
            restore,
            remove,
            backup
        };

        const state: ComponentState = {
            disabled,
            display
        };

        return { state };
    },

    methods: {

        /**
         * Handles deletion of all user-saved cookies.
         */
        handle_click_delete() {

            // This exists purely to guard users from deleting prematurely
            if (this.state.display.remove == DeleteButtonLabel.INITIAL)
                this.state.display.remove = DeleteButtonLabel.CONFIRM;

            else if (this.state.display.remove == DeleteButtonLabel.CONFIRM) {

                const metadata = this.__metaData as PersistenceMetadata;

                for (const item of metadata.known_namespaces)
                    localStorage.removeItem(`${metadata.application_name}-${item}`);

                localStorage.removeItem(`metadata-${metadata.application_name}`);

                this.state.disabled.disable_backup = true;
                this.state.disabled.disable_remove = true;

                this.state.display.remove = DeleteButtonLabel.INITIAL;
            }
        },

        /**
         * Handles downloading all persisted data into a singular JSON file.
         */
        handle_click_backup() {

            if (this.state.display.backup == BackupButtonLabel.INITIAL)
                this.state.display.backup = BackupButtonLabel.CONFIRM;

            else if (this.state.display.backup == BackupButtonLabel.CONFIRM) {

                const metadata: PersistenceMetadata = this.__metaData;

                const namespaces: Array<string> = metadata.known_namespaces;
                const version: string = metadata.last_used_version;
                const name: string = metadata.application_name;

                const data: Record<string, any> = { };

                for (const namespace of metadata.known_namespaces) {
                    const target = localStorage.getItem(`${metadata.application_name}-${namespace}`);

                    if (!target) continue;

                    data[namespace] = JSON.parse(target);
                }

                // Assemble final data object

                const meta = {
                    namespaces,
                    version,
                    name
                };

                const result = JSON.stringify({ meta, data }, undefined, 2);

                FileSaver.saveAs(new Blob([result], { type: 'application/json' }), `${metadata.application_name}-backup.json`);

                this.state.display.backup = BackupButtonLabel.INITIAL;
            }
        },

        /**
         * Handles loading backup JSON file & setting the appropriate data.
         */
        handle_click_restore() {

            if (!verify_localstorage_availlability()) {

                if (!this.state.disabled.disable_restore)
                    this.state.disabled.disable_restore = true;

                return;
            }

            const input = document.createElement('input');

            input.type = 'file';
            input.accept = '.json,application/json';

            input.onchange = async ev => {

                // To surpress TypeScript moaning
                if (ev) ev;

                if (input.files) for (const file of Array.from(input.files)) {
                   const raw_data = JSON.parse(await file.text());

                    const data = Object.assign(store.state as Record<any, any>, raw_data.data);

                    for (const namespace of raw_data.meta.namespaces)
                        localStorage.setItem(`${raw_data.meta.name}-${namespace}`, JSON.stringify(raw_data.data[namespace]));

                    const last_used_version = application_data.version;
                    const application_name  = raw_data.meta.name;
                    const known_namespaces  = raw_data.meta.namespaces;

                    localStorage.setItem(`metadata-${raw_data.meta.name}`, JSON.stringify({ last_used_version, application_name, known_namespaces }));

                    store.replaceState(data);
                }

                store.commit('eventBusStore/ENABLE_DATA_PERSISTENCE');

                // Clean up after ourselves
                input.remove();
            };

            input.click();
        },

        get_size_data: () => `Cache Size: ${(new Blob(Object.values(localStorage)).size / 1000).toString().slice(0, -1)}Kb`
    },

    watch: {
        'eventBusStore.supports_data_persistence': {
            handler(state) {
                this.state.disabled.disable_backup = !(state);
                this.state.disabled.disable_remove = !(state);
            },
            deep: true
        }
    },

    computed: mapState(['settingsStore', 'eventBusStore', '__metaData'])
});