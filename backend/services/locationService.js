const axios = require('axios');
const DistrictSnapshot = require('../models/DistrictSnapshot');

function normalizeIp(ip) {
  if (!ip) return '';
  const raw = (Array.isArray(ip) ? ip[0] : ip).split(',')[0].trim();
  if (raw === '::1' || raw === '127.0.0.1' || raw.startsWith('192.168.') || raw.startsWith('10.')) return '';
  return raw.replace('::ffff:', '');
}

/**
 * This is the new, smarter logic. It maps known city/municipality names
 * to their correct district names from your database.
 */
async function findDistrictByName(districtName) {
  if (!districtName) return null;

  // Clean the name from Nominatim
  let queryName = districtName.replace(/ district/i, '').trim();
  
  // 1. Create a "name map" for known mismatches (from your logs)
  const nameMap = {
    "Raurkela (M)": "SUNDARGARH",
    "Rourkela": "SUNDARGARH",
    "Bhubaneswar (M.Corp.)": "KHORDHA",
    "Bhubaneswar": "KHORDHA"
  };

  // 2. Check if the name is in our map
  if (nameMap[queryName]) {
    queryName = nameMap[queryName];
    console.log(`[LocationService] Name mapped to: "${queryName}"`);
  } else {
    // 3. If not, try cleaning municipality/corporation suffixes
    queryName = queryName.replace(/\s*\((M|M\.Corp\.)\)$/i, '').trim();
    console.log(`[LocationService] Cleaned name to: "${queryName}"`);
  }
  
  // 4. Search the DB with the mapped/cleaned name
  console.log(`[LocationService] Searching DB for district name: "${queryName}"`);
  const snap = await DistrictSnapshot.findOne({
    district_name: new RegExp(`^${queryName}$`, 'i')
  }).sort({ period_key: -1 }).lean();

  if (!snap) {
    console.warn(`[LocationService] No match found in DB for "${queryName}".`);
    return null;
  }
  
  console.log(`[LocationService] Found DB match:`, snap.district_name);
  return {
    district_code: snap.district_code,
    district_name: snap.district_name,
    state_name: snap.state_name
  };
}

async function detectByIp(ip) {
  try {
    const clientIp = normalizeIp(ip);
    const url = clientIp ? `https://ipapi.co/${clientIp}/json/` : 'https://ipapi.co/json/';
    
    console.log(`[LocationService] /detect-by-ip: Fetching coords from ipapi for IP: ${clientIp || 'default'}`);
    const { data } = await axios.get(url, { timeout: 8000 });

    const { latitude, longitude } = data;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.warn('[LocationService] IP API did not return valid coordinates.', data);
      return null;
    }
    
    console.log(`[LocationService] /detect-by-ip: Got coords ${latitude}, ${longitude}. Now reverse geocoding...`);
    return await reverseGeocode(latitude, longitude);

  } catch (e) {
    console.error('[LocationService] detectByIp error:', e.message);
    return null;
  }
}

async function reverseGeocode(latitude, longitude) {
  try {
    console.log(`[LocationService] /reverse-geocode: Fetching district name from Nominatim for ${latitude}, ${longitude}`);
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&format=json&zoom=10`;
    
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'mgnrega-dashboard/1.0 (dev@example.com)' },
      timeout: 8000
    });

    const address = data.address || {};
    const districtName = address.county || address.state_district || address.district;

    if (!districtName) {
      console.warn('[LocationService] Nominatim did not return a district name.', address);
      return null;
    }
    
    console.log(`[LocationService] Nominatim returned district name: "${districtName}"`);
    
    // Call our new, smarter find function
    return await findDistrictByName(districtName);

  } catch (e) {
    console.error('[LocationService] reverseGeocode error:', e.message);
    return null;
  }
}

module.exports = { detectByIp, reverseGeocode };

