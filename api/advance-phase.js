/**
 * Vercel Cron Job API: Phase 자동 전환
 * 매주 월요일 오전 9시 실행 (vercel.json에서 설정)
 * 3주마다 phase를 1씩 증가 (최대 4)
 */

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Cron 요청 검증 (Vercel Cron은 Authorization 헤더로 검증)
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  // 개발 환경에서는 검증 스킵, 프로덕션에서는 필수
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);

    const now = new Date();
    const startDate = new Date(settings.phaseStartDate);
    const weeksPassed = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));

    // 3주마다 phase 증가 (최대 6)
    const targetPhase = Math.min(Math.floor(weeksPassed / 3) + 1, 6);

    let updated = false;
    if (targetPhase > settings.currentPhase) {
      settings.currentPhase = targetPhase;
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      updated = true;
      console.log(`Phase advanced to ${targetPhase}`);
    }

    res.status(200).json({
      success: true,
      currentPhase: settings.currentPhase,
      targetPhase: targetPhase,
      weeksPassed: weeksPassed,
      updated: updated,
      message: updated ? `Phase advanced to ${targetPhase}` : 'No phase change needed'
    });
  } catch (error) {
    console.error('Error advancing phase:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
