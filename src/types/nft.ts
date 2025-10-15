// NFT trait interface based on the database schema
export interface NFTTraits {
  trait_colour_band?: string | null
  trait_gradient?: string | null
  trait_speed?: string | null
  trait_iri?: string | null
  trait_checks?: string | null
  trait_type?: string | null
  trait_day?: string | null
  trait_revealed?: string | null
}

// Main NFT interface matching the database table structure
export interface NFT {
  token_id: number
  wallet_address?: string | null
  last_seen_at: string
  image_url?: string | null
  // Spread all trait properties
  trait_colour_band?: string | null
  trait_gradient?: string | null
  trait_speed?: string | null
  trait_iri?: string | null
  trait_checks?: string | null
  trait_type?: string | null
  trait_day?: string | null
  trait_revealed?: string | null
}

// Processed NFT interface for display purposes
export interface ProcessedNFT extends NFT {
  // Add computed properties for display
  displayName: string
  traitCount: number
  hasImage: boolean
  traits: Array<{
    name: string
    value: string
    displayName: string
  }>
}

// API response types
export interface NFTListResponse {
  data: NFT[]
  count: number
  error?: string
}

export interface NFTDetailResponse {
  data: NFT | null
  error?: string
}

// Filter and search types
export interface NFTFilters {
  trait_colour_band?: string
  trait_gradient?: string
  trait_speed?: string
  trait_iri?: string
  trait_checks?: string
  trait_type?: string
  trait_day?: string
  trait_revealed?: string
}

export interface NFTSearchParams {
  search?: string
  filters?: NFTFilters
  sortBy?: 'token_id' | 'last_seen_at'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Loading and error states
export interface NFTLoadingState {
  isLoading: boolean
  error: string | null
  data: NFT[]
  hasMore: boolean
}

// Trait display configuration
export const TRAIT_DISPLAY_NAMES: Record<string, string> = {
  trait_colour_band: 'Colour Band',
  trait_gradient: 'Gradient',
  trait_speed: 'Speed',
  trait_iri: 'IRI',
  trait_checks: 'Checks',
  trait_type: 'Type',
  trait_day: 'Day',
  trait_revealed: 'Revealed'
} as const

// Helper function to process NFT data for display
export function processNFTForDisplay(nft: NFT): ProcessedNFT {
  const traits = Object.entries(TRAIT_DISPLAY_NAMES)
    .map(([key, displayName]) => {
      const value = nft[key as keyof NFT] as string | null
      return value ? {
        name: key,
        value,
        displayName
      } : null
    })
    .filter(Boolean) as Array<{
      name: string
      value: string
      displayName: string
    }>

  return {
    ...nft,
    displayName: `Checks #${nft.token_id}`,
    traitCount: traits.length,
    hasImage: Boolean(nft.image_url),
    traits
  }
}