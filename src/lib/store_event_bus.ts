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

    /**
     * Denotes wether or not user has completed first time initialization.
     * @type {boolean}
     */
    is_user_initialized: boolean;

    /**
     * Category item state which controls display styles for
     * all sub-categories, giving visual feedback for items that
     * have been visited, are active and are yet to be visited in
     * critical-only mode.
     * @enum {CategoryItemState}
     */
    critical_only_categories_state: Record<string, CategoryItemState>;
}

/**
 * Internal state for all sub-category items.
 * @see {ModuleState}
 */
export enum CategoryItemState {
    INITIAL = 'STATE_INITIAL',
    VISITED = 'STATE_VISITED',
    ACTIVE = 'STATE_ACTIVE'
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        has_image_loaded: false,
        is_user_initialized: true,
        has_image_load_failed: false,
        supports_data_persistence: false,
        supports_system_theme_switch: true,
        critical_only_categories_state: { },
        version_change_significant_update: false
    },

    mutations: {
        UPDATE_CRITICAL_ONLY_CATEGORIES_STATE: (state: any, payload: Record<string, CategoryItemState>) => state.critical_only_categories_state = payload,

        DISABLE_SYSTEM_THEME_SWITCH_SUPPORT: (state: any) => state.supports_system_theme_switch = false,

        UPDATE_IMAGE_LOAD_FAIL_STATE: (state: any, payload: boolean) => state.has_image_load_failed = payload,

        SIGNAL_SIGNIFICANT_UPDATE: (state: any) => state.version_change_significant_update = true,

        START_USER_INITIALIZATION: (state: any) => state.is_user_initialized = false,

        UPDATE_IMAGE_LOADED_STATE: (state: any, payload: boolean) => state.has_image_loaded = payload,

        DISABLE_DATA_PERSISTENCE: (state: any) => state.supports_data_persistence = false,

        ENABLE_DATA_PERSISTENCE: (state: any) => state.supports_data_persistence = true
    },

    actions: {

        UpdateCategoriesState: (context: any, payload: { target: string, state: CategoryItemState }) => {

            if (!payload.target || !payload.state) return;

            context.commit('UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', Object.assign(context.state.critical_only_categories_state, { [payload.target]: payload.state }));
        }
    }
};

export default store;