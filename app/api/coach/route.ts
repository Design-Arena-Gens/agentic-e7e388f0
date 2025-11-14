export const runtime = 'edge'

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({})) as { message?: string; data?: unknown }
    const message = (body.message || '').toString().slice(0, 4000)
    const data = body.data ? JSON.stringify(body.data).slice(0, 8000) : ''

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response('OPENAI_API_KEY not configured', { status: 400 })
    }

    const system = `You are an expert productivity and health coach. Give specific, actionable suggestions balancing focus, rest, and wellbeing. When given user data JSON, summarize patterns and propose a plan.`
    const user = data
      ? `User message: ${message}\n\nRecent data (JSON): ${data}`
      : `User message: ${message}`

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    })

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(text || 'Upstream error', { status: 500 })
    }

    const json = await resp.json() as any
    const content = json.choices?.[0]?.message?.content || 'No content'

    return Response.json({ content })
  } catch (e: any) {
    return new Response(e?.message || 'Server error', { status: 500 })
  }
}
