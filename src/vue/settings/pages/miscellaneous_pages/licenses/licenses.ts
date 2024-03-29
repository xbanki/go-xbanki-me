import { marked }          from 'marked';
import { defineComponent } from 'vue';

import dependency_licenses from 'virtual:licenses';

/**
 * License item which we should render in the component.
 */
interface ComponentStateLicense {

    /**
     * Denotes wether the dropdown item is active or not.
     * @type {boolean}
     */
    active: boolean;

    /**
     * Package author.
     * @type {string}
     */
    author?: string;

    /**
     * Un-rendered license data.
     * @type {string}
     */
    content: string;

    /**
     * Author contact email.
     * @type {string}
     */
    email?: string;

    /**
     * License object's home URL.
     * @type {string}
     */
    home?: string;

    /**
     * Name of the package this item is for.
     * @type {string}
     */
    name: string;

    /**
     * Repository URL for the source code.
     * @type {string}
     */
    repo?: string;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * A list of all licenses that we use.
     * @type {LicenseItem}
     */
    licenses: ComponentStateLicense[];
}

function prepare_license_data(): ComponentStateLicense[] {

    const result: ComponentStateLicense[] = [];

    for (const target of Object.values(dependency_licenses)) {

        if (!target.text || !target.license) continue;


        const content = target.text;

        const author = target.author;

        const email = target.email;

        const repo = target.repository;

        const name = target.name;

        const home = target.url;

        const active = false;

        result.push({ author, active, content, email, home, name, repo });
    }

    return result;
}

export default defineComponent({

    data() {

        const licenses: ComponentStateLicense[] = prepare_license_data();

        // Assembled state object

        const state: ComponentState = { licenses };

        return { state };
    },

    methods: {

        /**
         * Toggles given target dropdown state.
         */
        toggle_dropdown_state: (target: ComponentStateLicense) => target.active ? target.active = false : target.active = true,

        /**
         * Renders string into valid markdown HTML.
         */
        render_content: (content: string) => marked(content),

        /**
         * Appens author to string `By: `.
         */
        get_styled_author: (author: string) => `By: ${author}`
    }
});