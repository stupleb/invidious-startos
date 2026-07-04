import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const uiId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'main')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })

  const uiReceipt = await uiMultiOrigin.export([
    sdk.createInterface(effects, {
      name: i18n('Web UI'),
      id: uiId,
      description: i18n('Web interface for Invidious'),
      type: 'ui',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    }),
  ])

  return [uiReceipt]
})
