import type { NFTSearchParams, NFT } from '@/types/nft'

export interface ClientNFTResponse {
  success: boolean
  data: NFT[]
  count: number
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
  error?: string
}

export async function fetchNFTsClient(params: NFTSearchParams = {}): Promise<ClientNFTResponse> {
  try {
    console.log('🔄 Client fetchNFTs called with params:', params)
    
    // Build query string
    const searchParams = new URLSearchParams()
    
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    
    // Add trait filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value)
        }
      })
    }
    
    const url = `/api/nfts?${searchParams.toString()}`
    console.log('📡 Fetching from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('📦 Client fetch result:', {
      success: result.success,
      dataLength: result.data?.length,
      count: result.count,
      hasMore: result.pagination?.hasMore
    })
    
    return result
    
  } catch (error) {
    console.error('💥 Client fetchNFTs error:', error)
    return {
      success: false,
      data: [],
      count: 0,
      pagination: {
        limit: params.limit || 20,
        offset: params.offset || 0,
        total: 0,
        hasMore: false
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}