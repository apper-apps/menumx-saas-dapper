import React from 'react'

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    accent: 'bg-accent-100 text-accent-800'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default Badge