<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useSettingsStore from '../../../settings/application/settings.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
import LanguageSwitcher from './language-switcher.vue';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const iamStore = useIamStore();
const search = ref(typeof route.query.search === 'string' ? route.query.search : '');

function handleSignOut() {
  iamStore.signOut(router);
}

const mainMenuItems = [
  { label: 'layout.menu.items.analytics', to: '/analytics', icon: 'pi pi-th-large' },
  { label: 'layout.menu.items.laboratories', to: '/laboratories', icon: 'laboratory' },
  { label: 'layout.menu.items.history', to: '/history', icon: 'pi pi-history' },
  { label: 'layout.menu.items.alerts', to: '/alerts', icon: 'pi pi-bell' },
  { label: 'layout.menu.items.reports', to: '/reports', icon: 'pi pi-chart-bar' },
];

const systemMenuItems = [
  { label: 'layout.menu.items.settings', to: '/settings', icon: 'pi pi-cog' },
];

const pageTitle = computed(() => {
  if (route.meta.titleKey) return t(route.meta.titleKey);
  if (route.meta.title) return route.meta.title;
  const routeName = String(route.name ?? '').toLowerCase();
  return t(`layout.menu.items.${routeName}`);
});

const pageSubtitle = computed(() =>
  route.meta.subtitleKey ? t(route.meta.subtitleKey) : (route.meta.subtitle ?? '')
);

watch(
  () => route.query.search,
  (value) => {
    search.value = typeof value === 'string' ? value : '';
  }
);

watch(search, (value) => {
  const query = { ...route.query, search: value || undefined };
  router.replace({ query });
});

watch(
  [() => route.fullPath, locale, pageTitle],
  () => {
    const baseTitle = 'CryoVigil';
    document.title = pageTitle.value ? `${baseTitle} - ${pageTitle.value}` : baseTitle;
  },
  { immediate: true }
);
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-top">
        <router-link
          class="brand"
          to="/analytics"
        >
          <span class="brand-mark"><i
            class="pi pi-box"
            aria-hidden="true"
          /></span>
          <span class="brand-copy">
            <strong>{{ t('layout.brand.name') }}</strong>
            <small>{{ t('layout.brand.subtext') }}</small>
          </span>
        </router-link>

        <nav aria-label="Main navigation">
          <p class="nav-heading">
            {{ t('layout.menu.sections.main') }}
          </p>
          <ul class="nav-list">
            <li
              v-for="item in mainMenuItems"
              :key="item.to"
            >
              <router-link
                :to="item.to"
                class="nav-item"
                active-class="nav-item-active"
              >
                <svg
                  v-if="item.icon === 'laboratory'"
                  class="nav-icon laboratory-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 2.5h6M8.5 2.5v5L3.7 14.7a1.7 1.7 0 0 0 1.5 2.5h9.6a1.7 1.7 0 0 0 1.5-2.5L11.5 7.5v-5M6 13h8"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <i
                  v-else
                  :class="item.icon"
                  aria-hidden="true"
                />
                <span>{{ t(item.label) }}</span>
              </router-link>
            </li>
          </ul>

          <p class="nav-heading system-heading">
            {{ t('layout.menu.sections.system') }}
          </p>
          <ul class="nav-list">
            <li
              v-for="item in systemMenuItems"
              :key="item.to"
            >
              <router-link
                :to="item.to"
                class="nav-item"
                active-class="nav-item-active"
              >
                <i
                  :class="item.icon"
                  aria-hidden="true"
                />
                <span>{{ t(item.label) }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sidebar-footer">
        <section
          class="help-card"
          aria-label="Help"
        >
          <strong>{{ t('layout.help.title') }}</strong>
          <p>{{ t('layout.help.description') }}</p>
          <a href="mailto:support@topglobals.com">{{ t('layout.help.documentation') }}</a>
        </section>
        <div class="user-profile">
          <span class="user-copy">
            <strong>{{ iamStore.currentUsername || settingsStore.profile.name }}</strong>
            <small>{{ t('layout.profile.role') }}</small>
          </span>
          <button
            class="cryo-button cryo-button-link cryo-button-danger cryo-button-icon logout-button"
            type="button"
            :aria-label="t('layout.profile.logout')"
            @click="handleSignOut"
          >
            <i
              class="pi pi-sign-out"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="top-bar">
        <div class="header-titles">
          <h1>{{ pageTitle }}</h1>
          <p v-if="pageSubtitle">
            {{ pageSubtitle }}
          </p>
        </div>
        <div class="header-tools">
          <label class="search-box">
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
            <input
              v-model="search"
              type="search"
              :aria-label="t('layout.search.label')"
              :placeholder="t('layout.search.placeholder')"
            >
          </label>
          <LanguageSwitcher />
        </div>
      </header>

      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f7f9fc;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex: 0 0 256px;
  flex-direction: column;
  justify-content: space-between;
  width: 256px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e6ebf2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 80px;
  padding: 0 24px;
  color: #111c32;
  text-decoration: none;
  border-bottom: 1px solid #edf0f5;
}

.brand-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  color: #fff;
  background: #08a67e;
  border-radius: 13px;
  box-shadow: 0 3px 7px #08a67e33;
  font-size: 19px;
}

.brand-copy,
.user-copy {
  display: flex;
  flex-direction: column;
}

.brand-copy strong {
  font-size: 19px;
  line-height: 1.1;
}

.brand-copy small {
  margin-top: 4px;
  color: #009b77;
  font-size: 10px;
  letter-spacing: 0.05em;
}

nav {
  padding: 18px 16px;
}

.nav-heading {
  margin: 11px 12px 14px;
  color: #8a9ab3;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.system-heading {
  margin-top: 30px;
}

.nav-list {
  display: grid;
  gap: 4px;
  padding: 0;
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 44px;
  padding: 0 13px;
  color: #40516c;
  border: 1px solid transparent;
  border-radius: 12px;
  text-decoration: none;
}

.nav-item > i {
  width: 17px;
  color: #8da0bb;
  font-size: 16px;
}

.nav-item .laboratory-icon {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  color: #8da0bb;
}

.nav-item:hover,
.nav-item-active > i,
.nav-item:hover > i {
  color: #008b68;
}

.nav-item-active .laboratory-icon,
.nav-item:hover .laboratory-icon {
  color: #008b68;
}

.sidebar-footer {
  padding: 16px;
}

.help-card {
  padding: 16px;
  color: white;
  background: linear-gradient(135deg, #079f79, #138d75);
  border-radius: 15px;
  box-shadow: 0 5px 12px #00785f26;
}

.help-card strong {
  font-size: 13px;
}

.help-card p {
  margin: 8px 0 12px;
  color: #e2fff6;
  font-size: 12px;
  line-height: 1.45;
}

.help-card a {
  display: block;
  padding: 8px;
  color: #fff;
  background: #ffffff26;
  border: 1px solid #ffffff55;
  border-radius: 8px;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf0f5;
}

.user-copy strong {
  font-size: 11px;
}

.user-copy small {
  color: #8b9ab1;
  font-size: 10px;
}

.logout-button {
  margin-left: auto;
}

.main-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.top-bar {
  position: sticky;
  z-index: 1;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 12px 32px;
  background: #fff;
  border-bottom: 1px solid #e6ebf2;
}

.header-titles h1 {
  margin: 0;
  color: #101b31;
  font-size: 20px;
  line-height: 1.25;
}

.header-titles p {
  margin: 3px 0 0;
  color: #6a7d99;
  font-size: 12px;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(288px, 36vw);
  height: 39px;
  padding: 0 13px;
  color: #8da0bb;
  background: #f8fafc;
  border: 1px solid #dfe6ef;
  border-radius: 13px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  padding: 0;
  color: #263650;
  background: transparent;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 13px;
}

.search-box input::placeholder {
  color: #98a8bf;
}

.content-area {
  flex: 1;
  padding: 24px 32px 40px;
}

@media (max-width: 900px) {
  .sidebar {
    flex-basis: 220px;
    width: 220px;
  }

  .content-area {
    padding: 20px;
  }
}

@media (max-width: 680px) {
  .sidebar {
    display: none;
  }

  .top-bar {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .header-tools {
    width: 100%;
  }

  .search-box {
    flex: 1;
    width: auto;
  }

  .content-area {
    padding: 16px;
  }
}
</style>
