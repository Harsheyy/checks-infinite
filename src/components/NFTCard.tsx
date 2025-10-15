'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { NFT } from '@/types/nft'
import { processNFTForDisplay } from '@/types/nft'

interface NFTCardProps {
  nft: NFT
  onClick?: (nft: NFT) => void
  className?: string
}

export default function NFTCard({ nft, onClick, className = '' }: NFTCardProps) {
  const processedNFT = processNFTForDisplay(nft)
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick(nft)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
        border border-gray-200 overflow-hidden group relative
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Image Section */}
      {processedNFT.hasImage && !imageError ? (
        <div className="relative h-48 bg-gray-100">
          <Image
            src={nft.image_url!}
            alt={processedNFT.displayName}
            fill
            className="object-cover"
            onError={handleImageError}
            unoptimized
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100"></div>
      )}

      {/* Check ID */}
      <div className="p-4 text-center">
        <h3 className="text-gray-900 font-bold text-lg">#{nft.token_id}</h3>
      </div>


    </div>
  )
}

// Loading skeleton component for when NFTs are being fetched
export function NFTCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse ${className}`}>
      {/* Header skeleton */}
      <div className="bg-gray-300 p-4">
        <div className="h-5 bg-gray-400 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-400 rounded w-1/2"></div>
      </div>

      {/* Traits skeleton */}
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="px-4 pb-4">
        <div className="border-t pt-3">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

// Error state component for when NFT data fails to load
export function NFTCardError({ 
  tokenId, 
  error, 
  onRetry,
  className = '' 
}: { 
  tokenId?: number
  error: string
  onRetry?: () => void
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-red-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-red-50 p-4 border-b border-red-200">
        <h3 className="text-red-800 font-bold text-lg">
          {tokenId ? `Checks #${tokenId}` : 'NFT'}
        </h3>
        <p className="text-red-600 text-sm">Failed to load</p>
      </div>

      {/* Error content */}
      <div className="p-4 text-center">
        <div className="text-red-500 text-sm mb-3">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}