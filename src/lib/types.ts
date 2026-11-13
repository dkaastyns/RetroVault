export interface Manufacturer { id: number; name: string; country: string; founded_year: number | null }
export interface Console { id: number; manufacturer_id: number; manufacturer_name?: string; name: string; release_year: number | null; image_url: string | null; game_count?: number }
export interface Game { id: number; console_id: number; console_name?: string; title: string; genre: string; release_year: number | null; image_url: string | null; description?: string | null }
export interface Transaction { id: number; game_id: number; status: 'Koleksi' | 'Wishlist' | 'Terjual'; purchase_price: string; purchase_date: string | null }
export interface GameReview { id: number; game_id: number; rating: number; status_tamat: boolean; review_text: string }
