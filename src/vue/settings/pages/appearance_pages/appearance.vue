<template>

    <!-- Appearance pages root element //-->
    <main class="component-appearance">

        <!-- Appearance pages titlebar //-->
        <section class="appearance-bar">

            <!-- Appearance title display itself //-->
            <span class="bar-title"> Appearance </span>
        </section>

        <!-- Appearance pages content wrapper //-->
        <section class="appearance-content">

            <!-- Application theme option section //-->
            <div class="content-item" v-if="!critical_only || critical_only && data.critical_categories['theme']" ref="Theme">
                <theme-page-component/>
            </div>

            <!-- Application background fit style //-->
            <div class="content-item" v-if="!critical_only || critical_only && data.critical_categories['background-fit']" ref="Background Fit">
                <background-fit-page-component/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./appearance.ts"></script>
<style lang="scss" src="./appearance.scss" scoped></style>