import { NextResponse } from 'next/server'
import { testConnection, fetchNFTs } from '@/lib/nft-api'

export async function GET() {
  try {
    console.log('🧪 Testing API connection...')
    
    // Test basic connection
    const connectionTest = await testConnection()
    console.log('🔗 Connection test result:', connectionTest)
    
    // Test fetching NFTs
    const nftResult = await fetchNFTs({ limit: 5 })
    console.log('📦 NFT fetch result:', {
      dataLength: nftResult.data?.length,
      count: nftResult.count,
      error: nftResult.error,
      firstNFT: nftResult.data?.[0]?.token_id
    })
    
    return NextResponse.json({
      connection: connectionTest,
      nfts: {
        count: nftResult.count,
        dataLength: nftResult.data?.length,
        error: nftResult.error,
        sample: nftResult.data?.slice(0, 2)
      }
    })
  } catch (error) {
    console.error('💥 API test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}