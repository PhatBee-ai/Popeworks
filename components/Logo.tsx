import Image from 'next/image'

// Real Bearded Pope logo (raster — no vector supplied). White background was
// knocked out to transparency; white variants exist for dark surfaces.

type Variant = 'dark' | 'light'

export function LogoMark({
  className = '',
  variant = 'dark',
}: {
  className?: string
  variant?: Variant
}) {
  const src =
    variant === 'light'
      ? '/brand/bearded-pope-emblem-white.png'
      : '/brand/bearded-pope-emblem.png'
  return (
    <Image
      src={src}
      alt="Bearded Pope"
      width={815}
      height={815}
      className={className}
      priority
    />
  )
}

export function LogoFull({
  className = '',
  variant = 'dark',
}: {
  className?: string
  variant?: Variant
}) {
  const src =
    variant === 'light'
      ? '/brand/bearded-pope-full-white.png'
      : '/brand/bearded-pope-full.png'
  return (
    <Image
      src={src}
      alt="Bearded Pope"
      width={814}
      height={1215}
      className={className}
    />
  )
}
