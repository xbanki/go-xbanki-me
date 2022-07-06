import { normalizePath, Plugin } from 'vite';
import { readFileSync }          from 'fs';

import dependency_licenses from './deps.json';

const PLUGIN_NAME = 'collect-package-licenses';
const RESOLVED_ID = '\0virtual:licenses';
const VIRTUAL_ID  = 'virtual:licenses';

function assembleLicenseData() {

    const results = { };

    for (const key of Object.keys(dependency_licenses)) {

        const target = dependency_licenses[key];

        const result: Record<string, any> = { };

        if (target.licenses != undefined && typeof target.licenses == 'string')
            result.license = target.licenses;

        if (target.repository != undefined)
            result.repository = target.repository;

        if (target.publisher != undefined)
            result.author = target.publisher;

        if (target.email != undefined)
            result.email = target.email;

        if (target.url != undefined)
            result.url = target.url;

        if (target.licenseFile != undefined)
            result.text = readFileSync(normalizePath(target.licenseFile), { encoding: 'utf-8' });

         result.name = key;

        results[`${key}`] = result;
    }

    return results;
}

export default function createLicensePlugin(): Plugin {

    return {
        name: PLUGIN_NAME,

        load(id) { if (id === RESOLVED_ID) return `export default ${JSON.stringify(assembleLicenseData())}`; },

        resolveId(id) { if (id === VIRTUAL_ID) return `\0${VIRTUAL_ID}`; }
    };
}