'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import NFTCard from './NFTCard'
import type { NFT } from '@/types/nft'

interface InfiniteGridProps {
  nfts: NFT[]
  onNFTClick: (nft: NFT) => void
  loading?: boolean
  error?: string | null
}

const CARD_WIDTH = 280
const CARD_HEIGHT = 350
const GAP = 20
const BUFFER_MULTIPLIER = 2 // How many screens worth of content to render

export default function InfiniteGrid({ nfts, onNFTClick, loading, error }: InfiniteGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  // Calculate grid dimensions with fallback
  const effectiveWidth = containerSize.width || (typeof window !== 'undefined' ? window.innerWidth : 1200)
  const effectiveHeight = containerSize.height || (typeof window !== 'undefined' ? window.innerHeight : 800)
  const cols = Math.floor((effectiveWidth + GAP) / (CARD_WIDTH + GAP)) || 1
  const rows = Math.floor((effectiveHeight + GAP) / (CARD_HEIGHT + GAP)) || 1
  
  // Calculate how many NFTs we need to fill the screen plus buffer
  const visibleCards = cols * rows
  const bufferCards = visibleCards * BUFFER_MULTIPLIER
  const totalCardsNeeded = visibleCards + bufferCards

  // Create repeated NFT data for infinite effect
  const repeatedNFTs = useCallback(() => {
    if (nfts.length === 0) return []
    
    const result: NFT[] = []
    const repetitions = Math.ceil(totalCardsNeeded / nfts.length)
    
    for (let i = 0; i < repetitions; i++) {
      result.push(...nfts)
    }
    
    return result.slice(0, totalCardsNeeded)
  }, [nfts, totalCardsNeeded])

  const infiniteNFTs = repeatedNFTs()

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Handle scroll with infinite looping
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = target

    // Calculate the repeating pattern dimensions
    const patternWidth = cols * (CARD_WIDTH + GAP)
    const patternHeight = Math.ceil(nfts.length / cols) * (CARD_HEIGHT + GAP)

    // Create seamless infinite scrolling by wrapping around
    let newScrollX = scrollLeft
    let newScrollY = scrollTop

    // Horizontal wrapping
    if (scrollLeft <= 0) {
      newScrollX = patternWidth - 1
      target.scrollLeft = newScrollX
    } else if (scrollLeft >= patternWidth) {
      newScrollX = 1
      target.scrollLeft = newScrollX
    }

    // Vertical wrapping
    if (scrollTop <= 0) {
      newScrollY = patternHeight - 1
      target.scrollTop = newScrollY
    } else if (scrollTop >= patternHeight) {
      newScrollY = 1
      target.scrollTop = newScrollY
    }

    setScrollPosition({ x: target.scrollLeft, y: target.scrollTop })
  }, [cols, nfts.length])

  // Calculate visible items with infinite repetition
  const getVisibleItems = useCallback(() => {
    if (nfts.length === 0) {
      return []
    }

    const startCol = Math.floor(scrollPosition.x / (CARD_WIDTH + GAP))
    const endCol = startCol + cols + 2 // Add buffer
    const startRow = Math.floor(scrollPosition.y / (CARD_HEIGHT + GAP))
    const endRow = startRow + rows + 2 // Add buffer

    const visibleItems: Array<{ nft: NFT; index: number; x: number; y: number }> = []
    const nftRows = Math.ceil(nfts.length / cols)

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        // Calculate the NFT index with wrapping
        const wrappedRow = ((row % nftRows) + nftRows) % nftRows
        const wrappedCol = ((col % cols) + cols) % cols
        const nftIndex = wrappedRow * cols + wrappedCol
        
        if (nftIndex < nfts.length) {
          const x = col * (CARD_WIDTH + GAP)
          const y = row * (CARD_HEIGHT + GAP)
          visibleItems.push({
            nft: nfts[nftIndex],
            index: row * 1000 + col, // Unique key for positioning
            x,
            y
          })
        }
      }
    }

    return visibleItems
  }, [scrollPosition, nfts, cols, rows])

  const visibleItems = getVisibleItems()

  // Calculate content dimensions for infinite scrolling
  const patternWidth = cols * (CARD_WIDTH + GAP)
  const patternHeight = Math.ceil(nfts.length / cols) * (CARD_HEIGHT + GAP)
  const totalContentWidth = patternWidth * 3 // Triple width for seamless scrolling
  const totalContentHeight = patternHeight * 3 // Triple height for seamless scrolling

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NFTs...</p>
          <p className="mt-2 text-sm text-gray-500">Current NFTs: {nfts.length}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!loading && nfts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No NFTs found</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Checks Infinite</h1>
          <p className="text-sm text-gray-600">{nfts.length} NFTs loaded</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 right-4 z-10 bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
        Scroll in any direction • Click cards for details
      </div>

      {/* Infinite Grid Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-auto pt-20"
        onScroll={handleScroll}
        style={{
          scrollBehavior: 'auto'
        }}
      >
        {/* Virtual content area */}
        <div
          className="relative"
          style={{
            width: totalContentWidth,
            height: totalContentHeight,
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          {/* Rendered visible items */}
          {visibleItems.map(({ nft, index, x, y }) => (
            <div
              key={`${nft.token_id}-${index}`}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: CARD_WIDTH,
                height: CARD_HEIGHT
              }}
            >
              <NFTCard
                nft={nft}
                onClick={() => onNFTClick(nft)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}