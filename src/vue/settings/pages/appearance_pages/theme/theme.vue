<template>

    <!-- Theme category page root element //-->
    <main class="component-theme" v-if="!critical_only || critical_only && data.is_critical">

        <!-- Theme component title display //-->
        <span class="theme-title"> Application Theme </span>

        <!-- Theme selections container //-->
        <section class="theme-selections">

            <!-- Light theme item container //-->
            <div class="selections-item">

                <!-- Theme selection icon //-->
                <input type="radio" name="item-light" id="settings-theme-light" value="THEME_LIGHT" v-on:change="update" v-model="state.selected_application_theme">
                
                <!-- Theme name descriptor //-->
                <label for="item-light"> Light </label>
            </div>

            <!-- Dark theme item container //-->
            <div class="selections-item">
                <!-- Theme selection icon //-->
                <input type="radio" name="item-dark" id="settings-theme-dark" value="THEME_DARK" v-on:change="update" v-model="state.selected_application_theme">
                
                <!-- Theme name descriptor //-->
                <label for="item-dark"> Dark </label>
            </div>

            <!-- OS matched theme item container //-->
            <div class="selections-item">
                
                <!-- Theme selection icon //-->
                <input type="radio" name="item-system" id="settings-theme-system" value="THEME_SYSTEM" v-on:change="update" v-model="state.selected_application_theme">
                
                <!-- Theme name descriptor //-->
                <label for="item-system"> Automatic </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./theme.ts"></script>
<style lang="scss" src="./theme.scss" scoped></style>