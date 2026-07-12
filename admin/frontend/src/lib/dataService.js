import { supabase } from './supabase';

/**
 * DataService provides clean, reusable methods for interacting with Supabase tables.
 */
export const DataService = {
  
  // --- ASSETS ---
  async getAssets() {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        asset_categories ( name, prefix, bookable )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map to match frontend UI expectations
    return data.map(asset => ({
      id: asset.id,
      tag: asset.asset_tag,
      name: asset.name,
      category: asset.asset_categories ? asset.asset_categories.name : 'Unknown',
      location: asset.location || 'Unassigned',
      status: asset.status,
      holder: '-', // Placeholder until we join allocations
      photo_url: null
    }));
  },

  async createAsset(assetData) {
    const { data, error } = await supabase
      .from('assets')
      .insert([assetData])
      .select();
      
    if (error) throw error;
    return data[0];
  },

  // --- CATEGORIES ---
  async getCategories() {
    const { data, error } = await supabase
      .from('asset_categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  },

  // --- DEPARTMENTS ---
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data.map(d => d.name);
  },

  // --- PROFILES (EMPLOYEES) ---
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        departments ( name )
      `)
      .order('name');
      
    if (error) throw error;
    return data;
  },

  // --- ALLOCATIONS ---
  async getAllocations() {
    const { data, error } = await supabase
      .from('allocations')
      .select(`
        *,
        assets ( asset_tag, name ),
        profiles ( name, email )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  // --- BOOKINGS ---
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        assets ( asset_tag, name ),
        profiles ( name )
      `)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    return data;
  },
  
  // --- MAINTENANCE ---
  async getMaintenanceRequests() {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        assets ( asset_tag, name ),
        profiles:requester_id ( name )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
