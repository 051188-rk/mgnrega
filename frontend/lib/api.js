import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
const client = axios.create({ baseURL, timeout: 15000 })

export async function getCurrent(code){ const {data}=await client.get(`/districts/${code}/current`); return data }
export async function getHistory(code){ const {data}=await client.get(`/districts/${code}/history`); return data }
export async function getCompare(code){ const {data}=await client.get(`/districts/${code}/compare`); return data }
export async function searchDistricts(state){ const {data}=await client.get(`/districts/search`, { params: { state } }); return data }
export async function systemStatus(){ const {data}=await client.get(`/system/status`); return data }
export async function detectByIp(){ const {data}=await client.get(`/location/detect-by-ip`); return data }
export async function reverseGeocode(latitude, longitude){ const {data}=await client.post(`/location/reverse-geocode`, { latitude, longitude }); return data }
export async function getStates(){ const {data}=await client.get(`/districts/states`); return data }

// Financial endpoints
export async function getWageStats(districtCode, months = 12) {
  const { data } = await client.get(`/financial/wage-stats/${districtCode}`, { 
    params: { months } 
  });
  return data;
}

export async function getFundUtilization(districtCode, months = 12) {
  const { data } = await client.get(`/financial/fund-utilization/${districtCode}`, { 
    params: { months }
  });
  return data;
}

export async function getTopExpenditures(stateCode, limit = 10) {
  const { data } = await client.get(`/financial/top-expenditures/${stateCode}`, {
    params: { limit }
  });
  return data;
}
