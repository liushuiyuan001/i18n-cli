import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import cn from './cn'
import Tools from '../module/tools'

Vue.use(VueI18n)
let tools = new Tools()
const messages = {
  en, cn
}

// let locale = 'en'
// let locale = getLocale()
// if (!locale) {
//   locale = 'cn'
//   saveLocale(locale)
// }

let locale = tools.getCookie('lang')
if (!locale) {
  locale = 'cn'
}
const i18n = new VueI18n({
  locale,
  messages
})

export default i18n
