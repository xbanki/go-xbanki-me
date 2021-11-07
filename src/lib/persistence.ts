import { Store, MutationPayload } from 'vuex';

import localForage from 'localforage';
import merge from 'deepmerge';

interface PresistenceOptions {
    prefectch?: boolean;
    overwrite?: boolean;
    name?: string;
}

interface Storage {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void
}

let configured = false;

export default function<State>(options?: PresistenceOptions): (store: Store<State>) => void {

    // Check wether we have configured localForage or not
    if (!configured) {
        localForage.config({ name: 'vuex' });
        configured = true;
    }

    const opts = options ?? {};

    const name = options?.name ?? 'storage';

    const storage = localForage.createInstance({ name });

    function getState<T>(key: string, storage: Storage): T | undefined {

        const value = storage.getItem(key);

        try {

            return (typeof value === 'string')
              ? JSON.parse(value) : (typeof value === 'object')
              ? value : undefined;
          
            }
            
            catch (err) { err; }
      
          return undefined;
    }

    const setState = (key: string, state: State, storage: Storage): void => storage.setItem(key, JSON.stringify(state));

    const fetchState = <T>(): T | undefined => getState(name, storage);

    const subscriber = (store: Store<State>) => (handler: (mutation: any, state: State) => void) => store.subscribe(handler);

    const filter = (mutation: MutationPayload) => true;

    function reducer(state: State, name: string): State {

        // Return whole state if the name is default
        if (name == 'vuex' || name == 'storage') return state;

        // Return the module object if name is supplied
        if (name in state) return state[name as keyof State] as unknown as State;

        return state;
      }

    let state: any;

    const prefectch = async () => {
        if (opts.prefectch) state = await fetchState();
        return;
    };

    prefectch();

    return async function(store: Store<State>) {

        // Do prefetch/ fetch of items
        await prefectch();
        if (!opts.prefectch && !state) state = await fetchState();

        if (typeof state == 'object' && state != null) {

            const final_state = opts.overwrite
                ? state
                : merge(store.state, state, { clone: false, arrayMerge: (store: any, saved: any) => saved });

            // Set the override or merge as state
            store.replaceState(final_state);
        }

        subscriber(store)((mutation, state) => {
            if (filter(mutation)) {
                setState(name, reducer(state, name), storage);
            }
        });
    };
}