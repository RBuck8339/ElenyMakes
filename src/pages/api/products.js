import {supabase} from '../../logic/supabaseClient';

export default async function handler(req, res) {
  const { ids } = req.query; // Expecting a comma-separated string like ?ids=1,5,10

  try {
    let query = supabase.from('products').select('*').order('id', { ascending: true });

    if (ids) {
      const idList = ids.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      query = query.in('id', idList);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}