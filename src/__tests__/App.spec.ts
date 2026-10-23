import { describe, it, expect } from 'vitest'

import { mount, RouterLinkStub } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the main navigation', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          RouterView: true,
        },
      },
    })

    expect(wrapper.find('nav[aria-label="Navigasi utama"]').exists()).toBe(true)
    expect(wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))).toEqual([
      '/home',
      '/home',
      '/sekolah',
      '/anggaran',
      '/claim',
      '/invoice',
    ])
  })
})
