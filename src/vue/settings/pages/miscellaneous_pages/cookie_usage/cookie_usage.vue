<template>

    <!-- Cookie usage explanation component //-->
    <main class="component-cookie-usage">

        <!-- Information rail about this statement //-->
        <section class="cookie-usage-rail">

            <!-- Statement revision version //-->
            <span class="rail-version"> {{ get_current_version(state.version) }} </span>

            <!-- Statement revision date //-->
            <span class="rail-date"> {{ get_revision_timestamp(state.revision) }} </span>
        </section>

        <!-- Rendered Markdown article //-->
        <section class="cookie-usage-article" v-html="state.content"/>

        <!-- Accept cookie usage button //-->
        <button class="cookie-usage-consent" v-if="componentSettingsStore.is_critical_only" v-on:click="accept_cookie_usage"> Accept & Continue </button>
    </main>
</template>

<script lang="ts" src="./cookie_usage.ts"></script>
<style lang="scss" src="./cookie_usage.scss" scoped></style>