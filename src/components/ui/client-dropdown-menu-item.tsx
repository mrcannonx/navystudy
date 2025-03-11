"use client"

import * as React from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ClientDropdownMenuItemProps extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuItem>, 'onClick'> {
  action?: () => void
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function ClientDropdownMenuItem({
  children,
  className,
  action,
  onClick,
  ...props
}: ClientDropdownMenuItemProps) {
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (action) action()
    if (onClick) onClick(e)
  }, [action, onClick])

  return (
    <DropdownMenuItem
      {...props}
      className={className}
      onClick={action || onClick ? handleClick : undefined}
    >
      {children}
    </DropdownMenuItem>
  )
}
