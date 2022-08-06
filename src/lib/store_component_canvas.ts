/**
 * Canvas component VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Denotes wether or not we are in edit mode.
     * @type {boolean}
     */
    edit: boolean;

    /**
     * Denotes wether or not the canvas items are in their initial default state.
     * @type {boolean}
     */
    dirty: boolean;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        dirty: false,
        edit: false
    },

    mutations: {
        MARK_CANVAS_DIRTY: (state: ModuleState, payload: boolean) => state.dirty = payload,

        UPDATE_EDIT_MODE: (state: ModuleState, payload: boolean) => state.edit = payload
    }
};

export default store;