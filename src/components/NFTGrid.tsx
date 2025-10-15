import React from 'react'
import NFTCard, { NFTCardSkeleton } from './NFTCard'
import type { NFT } from '@/types/nft'

interface NFTGridProps {
  nfts: NFT[]
  loading?: boolean
  error?: string | null
  onNFTClick?: (nft: NFT) => void
  onRetry?: () => void
  className?: string
  skeletonCount?: number
}

export default function NFTGrid({ 
  nfts, 
  loading = false, 
  error = null,
  onNFTClick,
  onRetry,
  className = '',
  skeletonCount = 12
}: NFTGridProps) {
  // Base grid classes for responsive design
  const gridClasses = `
    grid gap-6
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 
    2xl:grid-cols-5
    ${className}
  `

  // Loading state
  if (loading && nfts.length === 0) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <NFTCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    )
  }

  // Error state
  if (error && nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load NFTs</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find NFTs.</p>
        </div>
      </div>
    )
  }

  // Main grid with NFTs
  return (
    <div className={gridClasses}>
      {nfts.map((nft) => (
        <NFTCard
          key={nft.token_id}
          nft={nft}
          onClick={onNFTClick}
        />
      ))}
      
      {/* Show loading skeletons for additional items being loaded */}
      {loading && nfts.length > 0 && (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <NFTCardSkeleton key={`loading-skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  )
}

// Grid stats component to show total count and other metrics
export function NFTGridStats({ 
  totalCount, 
  displayedCount, 
  loading = false 
}: { 
  totalCount: number
  displayedCount: number
  loading?: boolean 
}) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{displayedCount}</span> of{' '}
          <span className="font-medium text-gray-900">{totalCount}</span> NFTs
        </div>
        {loading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading...
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: totalCount > 0 ? `${Math.min((displayedCount / totalCount) * 100, 100)}%` : '0%' 
          }}
        ></div>
      </div>
    </div>
  )
}

// Responsive grid container with proper spacing
export function NFTGridContainer({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`
      max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
      ${className}
    `}>
      {children}
    </div>
  )
}