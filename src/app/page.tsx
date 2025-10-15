'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchNFTsClient } from '@/lib/client-nft-api'
import InfiniteGrid from '@/components/InfiniteGrid'
import SlidePanel from '@/components/SlidePanel'
import type { NFT } from '@/types/nft'

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  
  const addDebug = useCallback((message: string) => {
    try {
      console.log(message)
      setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
    } catch (err) {
      setRuntimeError(`Debug error: ${err}`)
    }
  }, [setDebugInfo, setRuntimeError])

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft)
    setIsPanelOpen(true)
    addDebug(`Selected NFT #${nft.token_id}`)
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    setSelectedNFT(null)
    addDebug('Closed slide panel')
  }
  
  const loadNFTs = useCallback(async () => {
      try {
        addDebug('Starting NFT fetch with client function...')
        setLoading(true)
        setError(null)
        
        const result = await fetchNFTsClient({
          limit: 1000, // Fetch all NFTs (should be more than enough for current collection)
          offset: 0
        })
        
        addDebug(`Client fetch result: ${JSON.stringify(result)}`)
        
        if (result.success && result.data) {
          setNfts(result.data)
          addDebug(`Loaded ${result.data.length} NFTs out of ${result.count} total`)
          addDebug(`Has more: ${result.pagination.hasMore}`)
        } else {
          setError(result.error || 'Unknown error')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        addDebug(`Error: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    }, [addDebug, setLoading, setError, setNfts])
  
  useEffect(() => {
    try {
      addDebug('🚀 useEffect triggered')
      loadNFTs()
    } catch (err) {
      setRuntimeError(`useEffect error: ${err}`)
    }
  }, [loadNFTs, addDebug])

  // Timer to verify React is working
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Show debug interface if there are errors or no NFTs loaded yet
  if (error || (nfts.length === 0 && !loading)) {
    return (
      <div className="h-screen w-full bg-gray-50 p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">NFT Debug Page</h1>
          
          <div className="mb-4">
            <p><strong>Current Time:</strong> {currentTime}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>NFTs Loaded:</strong> {nfts.length}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          </div>

          {runtimeError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Runtime Error:</strong> {runtimeError}
            </div>
          )}

          <button 
            onClick={loadNFTs}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load NFTs'}
          </button>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Debug Log:</h3>
            <div className="bg-gray-100 p-4 rounded max-h-64 overflow-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-sm font-mono">
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <InfiniteGrid
        nfts={nfts}
        onNFTClick={handleNFTClick}
        loading={loading}
        error={error}
      />
      
      <SlidePanel
        nft={selectedNFT}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </>
  )
}
