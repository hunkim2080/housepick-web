// Vercel Serverless Function for District Demand
// Returns the number of consultation requests in the last 7 days for a district

import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { district } = req.query

  if (!district) {
    return res.status(400).json({ error: 'district parameter is required' })
  }

  try {
    const reservationsPath = path.join(process.cwd(), 'data/reservations.json')
    let reservations = []

    try {
      reservations = JSON.parse(fs.readFileSync(reservationsPath, 'utf-8'))
    } catch {
      // 파일 없거나 파싱 실패 시 빈 배열
      reservations = []
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // 실제 데이터 카운트
    const count = reservations.filter(r => {
      if (!r.createdAt) return false
      const isRecent = new Date(r.createdAt) > sevenDaysAgo
      const isDistrict = r.district === district || r.city === district
      return isRecent && isDistrict
    }).length

    // 최소값 3 보정 (0이 나오지 않게)
    const displayCount = Math.max(count, 3)

    return res.status(200).json({
      district,
      count: displayCount,
      period: '7days'
    })
  } catch (error) {
    console.error('Error fetching district demand:', error)
    return res.status(500).json({
      error: 'Internal server error',
      district,
      count: 3,
      period: '7days'
    })
  }
}
