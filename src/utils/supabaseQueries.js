const fetchFilteredPosts = async (filters) => {
  let query = supabase.from('posts').select('*');

  if (filters.purpose) {
    query = query.eq('purpose', filters.purpose);
  }

  if (filters.district_id) {
    query = query.eq('district_id', filters.district_id);
  }

  if (filters.project_name) {
    query = query.ilike('project_name', `%${filters.project_name}%`);
  }

  if (filters.price_min) {
    query = query.gte('price', filters.price_min);
  }

  if (filters.price_max) {
    query = query.lte('price', filters.price_max);
  }

  if (filters.area_min) {
    query = query.gte('area', filters.area_min);
  }

  if (filters.area_max) {
    query = query.lte('area', filters.area_max);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered posts:', error);
    return [];
  }

  return data;
};

export { fetchFilteredPosts };