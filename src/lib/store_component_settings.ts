/**
 * Internal state for all sub-category items.
 * @see {ModuleState}
 */
export enum CategoryItemState {
    INITIAL = 'STATE_INITIAL',
    VISITED = 'STATE_VISITED',
    ACTIVE = 'STATE_ACTIVE'
}

/**
 * Settings VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Category item state which controls display styles for
     * all sub-categories, giving visual feedback for items that
     * have been visited, are active and are yet to be visited in
     * critical-only mode.
     * @enum {CategoryItemState}
     */
    critical_only_categories_state: Record<string, CategoryItemState>;

    /**
     * The last clicked category.
     * @type {string}
     */
    last_clicked_category: string | undefined;

    /**
     * Denotes wether or not the settings component is in initialization
     * mode or not.
     * @type {boolean}
     */
    is_critical_only: boolean;

    /**
     * Denotes wether or not the settings component is rendered or not.
     * @type {boolean}
     */
    is_rendering: boolean;

    /**
     * Denotes wether or not the user is searching or not.
     * @type {boolean}
     */
    is_searching: boolean;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        critical_only_categories_state: { },
        last_clicked_category: undefined,
        is_critical_only: false,
        is_rendering: false,
        is_searching: false
    },

    mutations: {
        UPDATE_CRITICAL_ONLY_CATEGORIES_STATE: (state: ModuleState, payload: Record<string, CategoryItemState>) => state.critical_only_categories_state = payload,

        UPDATE_LAST_CLICKED_CATEGORY: (state: ModuleState, payload?: string) => state.last_clicked_category = payload,

        UPDATE_SEARCHING_STATE: (state: ModuleState, payload: boolean) => state.is_searching = payload,

        UPDATE_CRITICAL_ONLY: (state: ModuleState, payload: boolean) => state.is_critical_only = payload,

        UPDATE_RENDER_STATE: (state: ModuleState, payload: boolean) => state.is_rendering = payload
    },

    actions: {

        /**
         * Merges the current critical-only (initialization) category state with new items.
         */
        UpdateCategoriesState: (context: any, payload: { target: string, state: CategoryItemState }) => {

            if (!payload.target || !payload.state) return;

            context.commit('UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', Object.assign(context.state.critical_only_categories_state, { [payload.target]: payload.state }));
        }
    }
};

export default store;