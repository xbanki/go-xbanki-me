/**
 * Settings VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Is set to true when the background image has finished loading.
     * @type {boolean}
     */
    has_image_loaded: boolean;

    /**
     * Is set to true if the image load has failed.
     * @type {boolean}
     */
    has_image_load_failed: boolean;

    /**
     * Supports automatic theme matching based on OS theme.
     * @type {boolean}
     */
    supports_system_theme_switch: boolean;

    /**
     * Allows saving state to the browser's local storage.
     * @type {boolean}
     */
    supports_data_persistence: boolean;

    /**
     * Determines wether or not the application has updated significantly between last & current initialization.
     * @type {boolean}
     */
    version_change_significant_update: boolean;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        has_image_loaded: false,
        has_image_load_failed: false,
        supports_data_persistence: false,
        supports_system_theme_switch: true,
        version_change_significant_update: false
    },

    mutations: {
        DISABLE_SYSTEM_THEME_SWITCH_SUPPORT: (state: ModuleState) => state.supports_system_theme_switch = false,

        UPDATE_IMAGE_LOAD_FAIL_STATE: (state: ModuleState, payload: boolean) => state.has_image_load_failed = payload,

        SIGNAL_SIGNIFICANT_UPDATE: (state: ModuleState) => state.version_change_significant_update = true,

        UPDATE_IMAGE_LOADED_STATE: (state: ModuleState, payload: boolean) => state.has_image_loaded = payload,

        DISABLE_DATA_PERSISTENCE: (state: ModuleState) => state.supports_data_persistence = false,

        ENABLE_DATA_PERSISTENCE: (state: ModuleState) => state.supports_data_persistence = true
    }
};

export default store;