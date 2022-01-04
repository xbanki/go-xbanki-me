import { Store } from 'vuex';

interface PersistenceOptions {
    application_name: string;
}

const persistence_defaults: PersistenceOptions = {
    application_name: 'vuex'
};

function verify_localstorage_availlability() {
    try {
        const storage: Storage = window['localStorage'];

        storage.setItem('@@', '@');
        storage.removeItem('@@');

        return true;
    }

    catch (err) {
        return err instanceof DOMException && (
            err.code == 22   ||
            err.code == 1014 ||

            err.name == 'QuotaExceededError' ||
            err.name == 'NS_ERROR_DOM_QUOTA_REACHED'
        ) &&
        (localStorage && localStorage.length != 0);
    }
}

export default function<State>(options?: PersistenceOptions): (store: Store<State>) => void {

    const storage_options = Object.assign(persistence_defaults, options);
    const storage_test = verify_localstorage_availlability();

    if (storage_test != true) {
        throw new Error('LocalStorage API not supported');
    }

    return function(store: Store<State>) { };
}