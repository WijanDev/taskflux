/**
 * Inline boot script for `<head>` (see `__root.tsx`).
 * Keep dataset logic in sync with `setRootThemeDataset` in `theme.ts`.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var stored=globalThis.localStorage.getItem('theme');var mode='auto';if(stored==='light'||stored==='dark'||stored==='auto'){mode=stored}var prefersDark=globalThis.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode;if(mode==='auto'){resolved=prefersDark?'dark':'light'}var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){delete root.dataset.theme}else{root.dataset.theme=mode}root.style.colorScheme=resolved;}catch(e){}})();`
