import PSPDFKit from 'pspdfkit'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      PSPDFKit
    }
  }
})