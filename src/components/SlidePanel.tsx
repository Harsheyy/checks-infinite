'use client'

import React from 'react'
import Image from 'next/image'
import type { NFT } from '@/types/nft'
import { processNFTForDisplay } from '@/types/nft'

interface SlidePanelProps {
  nft: NFT | null
  isOpen: boolean
  onClose: () => void
}

export default function SlidePanel({ nft, isOpen, onClose }: SlidePanelProps) {
  if (!nft) return null

  const processedNFT = processNFTForDisplay(nft)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Checks #{nft.token_id}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Image Section */}
          {processedNFT.hasImage ? (
            <div className="mb-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={nft.image_url!}
                  alt={processedNFT.displayName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">No image available</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Token ID</span>
                <span className="font-medium text-gray-900">#{nft.token_id}</span>
              </div>
              
              {nft.wallet_address && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-gray-600">Owner</span>
                  <span className="font-mono text-sm text-gray-900 break-all text-right max-w-48">
                    {nft.wallet_address}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Seen</span>
                <span className="text-sm text-gray-900">
                  {new Date(nft.last_seen_at).toLocaleString()}
                </span>
              </div>

              {nft.image_url && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-gray-600">Image URL</span>
                  <a 
                    href={nft.image_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 text-sm break-all text-right max-w-48 underline"
                  >
                    View Image
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Traits Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Traits {processedNFT.traitCount > 0 && (
                <span className="text-sm font-normal text-gray-500">({processedNFT.traitCount})</span>
              )}
            </h3>
            
            {processedNFT.traits.length > 0 ? (
              <div className="space-y-3">
                {processedNFT.traits.map((trait) => (
                  <div key={trait.name} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{trait.displayName}</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900 border">
                      {trait.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No traits available for this NFT</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}