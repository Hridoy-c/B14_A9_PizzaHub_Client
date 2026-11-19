import React from 'react'
import { cn } from 'cn'

type GridRuleProps = {
  /** Number of columns between the vertical rules. */
  columns?: number
  /** Height + spacing overrides. */
  className?: string
}

/**
 * Full-bleed decorative strip of vertical rules on the cream background.
 * 6 columns = 5 rules, matching the brand grid.
 */
const GridRule = ({ columns = 6, className = '' }: GridRuleProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex h-20 w-full divide-x-2 divide-[#EADBC8] md:h-28',
        className,
      )}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="flex-1" />
      ))}
    </div>
  )
}

export default GridRule
