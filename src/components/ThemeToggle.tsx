import { Computer, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { ThemeMode } from '@/lib/theme'
import {
  applyThemeMode,
  getInitialMode,
  getNextThemeMode,
  getThemeToggleLabel,
} from '@/lib/theme'

type ThemeModeIconProps = Readonly<{
  mode: ThemeMode
}>

function ThemeModeIcon({ mode }: ThemeModeIconProps) {
  if (mode === 'dark') {
    return <Moon className="size-4" aria-hidden />
  }
  if (mode === 'auto') {
    return <Computer className="size-4" aria-hidden />
  }
  return <Sun className="size-4" aria-hidden />
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = globalThis.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto', { animate: true })

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode = getNextThemeMode(mode)
    setMode(nextMode)
    applyThemeMode(nextMode, { animate: true })
    globalThis.localStorage.setItem('theme', nextMode)
  }

  const label = getThemeToggleLabel(mode)

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleMode}
      aria-label={label}
      title={label}
    >
      <ThemeModeIcon mode={mode} />
    </Button>
  )
}
