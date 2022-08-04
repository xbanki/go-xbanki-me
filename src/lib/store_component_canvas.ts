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
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        edit: false
    }
};

export default store;