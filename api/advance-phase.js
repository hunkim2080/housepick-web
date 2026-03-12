// Vercel Serverless Function for Phase Advancement
// This function is triggered weekly by Vercel Cron to advance the sitemap phase

import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // Cron secret verification
  const authHeader = req.headers['authorization']
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const settingsPath = path.join(process.cwd(), 'data/settings.json')
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))

    const now = new Date()
    const startDate = new Date(settings.phaseStartDate)
    const weeksPassed = Math.floor(
      (now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )

    // 3주마다 Phase 증가, 최대 6
    const targetPhase = Math.min(Math.floor(weeksPassed / 3) + 1, 6)

    if (targetPhase > settings.currentPhase) {
      settings.currentPhase = targetPhase
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))

      console.log(`Phase advanced: ${settings.currentPhase - 1} -> ${settings.currentPhase}`)

      return res.status(200).json({
        success: true,
        updated: true,
        previousPhase: settings.currentPhase - 1,
        currentPhase: settings.currentPhase,
        message: `Phase advanced to ${settings.currentPhase}. Rebuild required to update sitemap.`
      })
    }

    return res.status(200).json({
      success: true,
      updated: false,
      currentPhase: settings.currentPhase,
      targetPhase: targetPhase,
      message: 'Phase is already up to date'
    })
  } catch (error) {
    console.error('Error advancing phase:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
