// 발행 시 Vercel 재빌드를 트리거하는 API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' })
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK
  if (!hookUrl) {
    return res.status(200).json({ success: false, message: 'VERCEL_DEPLOY_HOOK not set' })
  }

  try {
    await fetch(hookUrl, { method: 'POST' })
    return res.status(200).json({ success: true, message: 'Deploy triggered' })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
}
