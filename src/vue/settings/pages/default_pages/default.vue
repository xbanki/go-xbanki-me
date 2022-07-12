<template>

    <!-- Default page component //-->
    <main class="component-default">

        <!-- Hint/ tip display wrappers //-->
        <section class="default-content">

            <!-- Hint title //-->
            <span class="content-title"> Quick Tip: </span>

            <!-- Rendered markdown hint //-->
            <h1 class="content-display" v-html="parse_hint(state.hint)" ref="hint"/>
        </section>

        <!-- Hint footer //-->
        <span class="default-label"> Click on a category to get started. </span>
    </main>
</template>

<script lang="ts" src="./default.ts"></script>
<style lang="scss" src="./default.scss" scoped></style>