<template>

    <!-- Privacy & safety category page root element //-->
    <main class="privacy-and-safety">

        <!-- Privacy & Safety section titlebar //-->
        <span class="privacy-and-safety-title"> Privacy & Safety </span>

        <!-- Privacy & Safety navigation buttons //-->
        <section class="privacy-and-safety-buttons">

            <!-- Cookie usage button //-->
            <button class="buttons-cookies" v-on:click="navigate_cookies"> Cookie Usage </button>

            <!-- FOSS licenses //-->
            <button class="buttons-licenses" v-on:click="navigate_licenses"> Licenses </button>
        </section>
    </main>
</template>

<script lang="ts" src="./privacy_and_safety.ts"></script>
<style lang="scss" src="./privacy_and_safety.scss" scoped></style>