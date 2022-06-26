import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import type { PersistenceMetadata } from '@/lib/persistence';

import { ModuleState as EventState }    from '@/lib/store_event_bus';
import { ModuleState as SettingsState } from '@/lib/store_settings';


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

        // Final assembled state objects

        const disabled: ComponentStateDisabled = {
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

                this.state.display.remove = DeleteButtonLabel.INITIAL;
            }
        },

        /**
         * Handles downloading all persisted data into a singular JSON file.
         */
        handle_click_backup() { this; },

        /**
         * Handles loading backup JSON file & setting the appropriate data.
         */
        handle_click_restore() { this; }
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