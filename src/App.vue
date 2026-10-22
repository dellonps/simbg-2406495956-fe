<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const navigation = [
  { label: 'Beranda', to: '/home' },
  { label: 'Sekolah', to: '/sekolah' },
  { label: 'Anggaran', to: '/anggaran' },
  { label: 'Claim', to: '/claim' },
  { label: 'Invoice', to: '/invoice' },
]
</script>

<template>
  <div class="app-shell">
    <nav class="navbar" aria-label="Navigasi utama">
      <RouterLink class="brand" to="/home" aria-label="SIMBG Beranda"><span class="brand-mark">S</span><span>SIMBG</span></RouterLink>
      <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="nav-link">
        {{ item.label }}
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style>
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0f172a;
  background: #f5f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem max(2rem, calc((100% - 1180px) / 2));
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-right: 1.75rem;
  color: #172554;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 0.625rem;
  color: #fff;
  background: #2563eb;
}

.nav-link {
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  color: #475569;
  font-size: 0.925rem;
  font-weight: 600;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #1d4ed8;
  background: #eff6ff;
}

@media (max-width: 600px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem 0.25rem;
  }

  .brand {
    flex-basis: 100%;
    justify-content: center;
    margin: 0 0 0.25rem;
  }

  .nav-link {
    padding: 0.625rem 0.4rem;
    font-size: 0.8rem;
  }
}

.page {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 2.75rem 2rem 4rem;
}

.page.narrow {
  width: min(760px, 100%);
}

.page-header,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.page-header {
  margin: 0 0 1.75rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page h1 {
  margin: 0;
  color: #172554;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  letter-spacing: -0.035em;
}

.subtitle,
.section-heading p {
  margin: 0.5rem 0 0;
  color: #64748b;
}

.button {
  display: inline-flex;
  min-height: 2.625rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: 1px solid #2563eb;
  border-radius: 0.6rem;
  color: #fff;
  background: #2563eb;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}

.button:hover { border-color: #1d4ed8; background: #1d4ed8; }
.button:disabled { opacity: 0.6; cursor: wait; }
.button-secondary { border-color: #dbe3ef; color: #334155; background: #fff; }
.button-secondary:hover { border-color: #bfdbfe; color: #1d4ed8; background: #eff6ff; }
.header-actions { display: flex; flex-wrap: wrap; gap: 0.625rem; }
.back-link, .text-link { color: #2563eb; font-size: 0.9rem; font-weight: 600; text-decoration: none; }
.back-link { display: inline-block; margin-bottom: 1.5rem; }
.back-link:hover, .text-link:hover { color: #1e40af; text-decoration: underline; }
.count-chip { padding: 0.5rem 0.75rem; border-radius: 2rem; color: #475569; background: #eaf0f8; font-size: 0.85rem; font-weight: 650; }

.table-wrap { overflow-x: auto; border: 1px solid #e5eaf1; border-radius: 0.875rem; background: #fff; box-shadow: 0 6px 24px rgb(15 23 42 / 4%); }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: 0.9rem 1rem; border-bottom: 1px solid #edf0f5; vertical-align: middle; white-space: nowrap; }
th { color: #64748b; background: #f8fafc; font-size: 0.73rem; font-weight: 700; letter-spacing: 0.055em; text-transform: uppercase; }
td { color: #475569; font-size: 0.875rem; }
tbody tr:last-child td { border-bottom: 0; }
tbody tr:hover td { background: #fbfdff; }
tfoot th { color: #172554; background: #f8fafc; font-size: 0.85rem; text-transform: none; }
.strong { color: #172554; font-weight: 650; }
.mono, .mono-title { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.mono-title { font-size: clamp(1.4rem, 3vw, 2rem) !important; }
.pill { display: inline-flex; align-items: center; padding: 0.3rem 0.6rem; border-radius: 2rem; color: #475569; background: #eef2f7; font-size: 0.72rem; font-weight: 700; }
.pill-green { color: #047857; background: #d1fae5; }
.row-actions { display: flex; gap: 0.85rem; }
.empty { padding: 2rem; color: #94a3b8; text-align: center; }
.notice { padding: 1rem 1.125rem; border-radius: 0.75rem; color: #475569; background: #fff; }
.notice-error, .form-error { color: #b91c1c; background: #fef2f2; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; }
.summary-card, .detail-card, .form-card { padding: 1.25rem; border: 1px solid #e5eaf1; border-radius: 0.875rem; background: #fff; box-shadow: 0 6px 24px rgb(15 23 42 / 4%); }
.summary-card { display: flex; min-height: 7rem; flex-direction: column; justify-content: space-between; gap: 0.85rem; }
.summary-card > span { color: #64748b; font-size: 0.8rem; font-weight: 600; }
.summary-card strong { color: #172554; font-size: 1.25rem; }
.summary-card .small-value { font-size: 1rem; }
.section-block { margin-top: 2rem; }
.section-heading { margin-bottom: 1rem; }
.section-heading h2, .detail-card h2 { margin: 0; color: #172554; font-size: 1.1rem; }
.section-heading p { font-size: 0.875rem; }
.form-card { display: grid; gap: 1.125rem; }
.form-card label, .inline-form label { display: grid; gap: 0.45rem; color: #334155; font-size: 0.85rem; font-weight: 650; }
input, select, textarea { width: 100%; min-height: 2.75rem; padding: 0.65rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #172554; background: #fff; font: inherit; font-size: 0.9rem; }
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { border-color: #60a5fa; outline: 3px solid rgb(96 165 250 / 20%); }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.65rem; padding-top: 0.25rem; }
.form-error { margin: 0; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; }
.helper-text { margin: -0.5rem 0 0; color: #64748b; font-size: 0.85rem; }
.calculated-total { display: flex; justify-content: space-between; padding: 0.875rem 1rem; border-radius: 0.6rem; color: #475569; background: #f1f5f9; }
.calculated-total strong { color: #172554; }
.detail-card { margin-top: 1.25rem; }
.detail-card dl { display: grid; gap: 0.75rem; margin: 1rem 0 0; }
.detail-card dl div { display: grid; grid-template-columns: minmax(120px, 0.35fr) 1fr; gap: 1rem; }
.detail-card dt { color: #64748b; }
.detail-card dd { margin: 0; color: #172554; font-weight: 600; }
.description-box { margin: 1rem 0 0; padding: 1rem 1.125rem; border: 1px solid #e5eaf1; border-radius: 0.75rem; color: #475569; background: #fff; }
.description-box.rejected { border-color: #fecaca; color: #991b1b; background: #fef2f2; }
.inline-form { display: flex; flex-wrap: wrap; align-items: end; gap: 0.75rem; padding: 1rem; border: 1px solid #e5eaf1; border-radius: 0.875rem; background: #fff; }
.inline-form label { flex: 1 1 190px; }

@media (max-width: 720px) {
  .page { padding: 2rem 1rem 3rem; }
  .page-header { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .header-actions { width: 100%; }
  .form-grid { grid-template-columns: 1fr; }
  .section-heading { align-items: flex-start; flex-direction: column; }
  .table-wrap { margin-right: -0.25rem; }
}
</style>
