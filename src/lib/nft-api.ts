import { getSupabaseClient, DATABASE_CONFIG } from './supabase'
import type { 
  NFT, 
  NFTListResponse, 
  NFTDetailResponse, 
  NFTSearchParams,
  NFTFilters 
} from '@/types/nft'

/**
 * Fetch all NFTs with optional search and filtering
 */
export async function fetchNFTs(params: NFTSearchParams = {}): Promise<NFTListResponse> {
  try {
    console.log('🔄 fetchNFTs called with params:', params)
    const {
      search,
      filters,
      sortBy = 'token_id',
      sortOrder = 'asc',
      limit = 50,
      offset = 0
    } = params

    console.log('🔧 Getting Supabase client...')
    const supabase = getSupabaseClient()
    console.log('✅ Supabase client created successfully')
    let query = supabase
      .from(DATABASE_CONFIG.table)
      .select('*', { count: 'exact' })

    // Apply search filter (search by token_id)
    if (search) {
      const tokenId = parseInt(search)
      if (!isNaN(tokenId)) {
        query = query.eq('token_id', tokenId)
      }
    }

    // Apply trait filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching NFTs:', error)
      return {
        data: [],
        count: 0,
        error: error.message
      }
    }

    return {
      data: data || [],
      count: count || 0
    }
  } catch (error) {
    console.error('Unexpected error fetching NFTs:', error)
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Fetch a single NFT by token ID
 */
export async function fetchNFTById(tokenId: number): Promise<NFTDetailResponse> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(DATABASE_CONFIG.table)
      .select('*')
      .eq('token_id', tokenId)
      .single()

    if (error) {
      console.error('Error fetching NFT:', error)
      return {
        data: null,
        error: error.message
      }
    }

    return {
      data: data as NFT
    }
  } catch (error) {
    console.error('Unexpected error fetching NFT:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Get unique values for a specific trait (for filter dropdowns)
 */
export async function fetchTraitValues(traitName: keyof NFTFilters): Promise<string[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(DATABASE_CONFIG.table)
      .select(traitName)
      .not(traitName, 'is', null)
      .not(traitName, 'eq', '')

    if (error) {
      console.error(`Error fetching ${traitName} values:`, error)
      return []
    }

    // Extract unique values
    const uniqueValues = [...new Set(
      data
        .map((item: Record<string, unknown>) => item[traitName])
        .filter(Boolean)
    )] as string[]

    return uniqueValues.sort()
  } catch (error) {
    console.error(`Unexpected error fetching ${traitName} values:`, error)
    return []
  }
}

/**
 * Get NFT statistics (total count, trait distributions, etc.)
 */
export async function fetchNFTStats() {
  try {
    const supabase = getSupabaseClient()
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from(DATABASE_CONFIG.table)
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error fetching total count:', countError)
      return { totalCount: 0, traitStats: {} }
    }

    // Get trait statistics
    const traitFields = [
      'trait_colour_band',
      'trait_gradient', 
      'trait_speed',
      'trait_iri',
      'trait_checks',
      'trait_type',
      'trait_day',
      'trait_revealed'
    ]

    const traitStats: Record<string, Record<string, number>> = {}

    // Fetch distribution for each trait
    for (const trait of traitFields) {
      try {
        const { data, error } = await supabase
          .from(DATABASE_CONFIG.table)
          .select(trait)
          .not(trait, 'is', null)
          .not(trait, 'eq', '')

        if (!error && data) {
          const distribution: Record<string, number> = {}
          data.forEach((item: Record<string, unknown>) => {
            const value = item[trait] as string
            if (value) {
              distribution[value] = (distribution[value] || 0) + 1
            }
          })
          traitStats[trait] = distribution
        }
      } catch (error) {
        console.error(`Error fetching ${trait} distribution:`, error)
      }
    }

    return {
      totalCount: totalCount || 0,
      traitStats
    }
  } catch (error) {
    console.error('Unexpected error fetching NFT stats:', error)
    return { totalCount: 0, traitStats: {} }
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from(DATABASE_CONFIG.table)
      .select('token_id')
      .limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}