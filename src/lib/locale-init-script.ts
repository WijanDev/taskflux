import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from '@/lib/i18n/cookies'

/**
 * Inline boot script for `<head>` (see `__root.tsx`).
 * Sets `lang` on `<html>` (not a data-* attribute).
 */
export const LOCALE_INIT_SCRIPT = `(function(){try{var match=document.cookie.match(/${LOCALE_COOKIE_NAME}=([^;]+)/);var fromCookie=match&&match[1];var stored=globalThis.localStorage.getItem('${LOCALE_STORAGE_KEY}');var locale='en';if(stored==='en'||stored==='es'){locale=stored}else if(fromCookie==='en'||fromCookie==='es'){locale=fromCookie}document.documentElement.lang=locale}catch(e){}})();`
