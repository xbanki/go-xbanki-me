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
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        has_image_loaded: false,
        has_image_load_failed: false
    },

    mutations: {
        UPDATE_IMAGE_LOADED_STATE: (state: any, payload: boolean): boolean => state.has_image_loaded = payload,

        UPDATE_IMAGE_LOAD_FAIL_STATE: (state: any, payload: boolean): boolean => state.has_image_load_failed = payload
    }
};

export default store;