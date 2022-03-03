<template>

    <!-- Dynamically rendered settings page component //-->
    <main class="component-pages">
        <component :is="state.active_category"/>
    </main>
</template>

<script lang="ts" src="./pages.ts"></script>
<style lang="scss" src="./pages.scss" scoped></style>