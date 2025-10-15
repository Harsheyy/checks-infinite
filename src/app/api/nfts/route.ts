import { NextRequest, NextResponse } from 'next/server'
import { fetchNFTs } from '@/lib/nft-api'
import type { NFTSearchParams } from '@/types/nft'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 NFT API endpoint called')
    
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const params: NFTSearchParams = {
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as 'token_id' | 'last_seen_at') || 'token_id',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }
    
    // Parse trait filters
    const filters: Record<string, string> = {}
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('trait_') && value) {
        filters[key] = value
      }
    }
    
    if (Object.keys(filters).length > 0) {
      params.filters = filters as Record<string, string>
    }
    
    console.log('📋 API params:', JSON.stringify(params))
    
    // Fetch NFTs using the existing function
    const result = await fetchNFTs(params)
    
    console.log('📦 API result:', {
      dataLength: result.data?.length,
      count: result.count,
      error: result.error
    })
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count,
      pagination: {
        limit: params.limit || 20,
        offset: params.offset || 0,
        total: result.count,
        hasMore: ((params.offset || 0) + (params.limit || 20)) < result.count
      }
    })
    
  } catch (error) {
    console.error('💥 NFT API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}