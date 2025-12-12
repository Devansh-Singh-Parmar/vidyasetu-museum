import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    // Default to an OpenRouter vision-capable model (override via OPENROUTER_MODEL)
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // Extract mime type + data from data URL, fallback to jpeg
    let mimeType = 'image/jpeg'
    let base64Image = imageData
    const dataUrlMatch = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1]
      base64Image = dataUrlMatch[2]
    } else {
      base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    }

    if (!base64Image) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      )
    }

    // Call OpenRouter (OpenAI-compatible) for image analysis
    const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions'
    
    const prompt = `Analyze this image of an artifact, sculpture, painting, or historical object. Provide detailed information in the following JSON format:
{
  "name": "Full name of the artifact",
  "description": "Detailed description (2-3 sentences)",
  "period": "Historical period or date",
  "significance": "Cultural and historical significance (2-3 sentences)",
  "museum": "Museum or location where it's displayed (if known)",
  "materials": "Materials used (if identifiable)",
  "artist": "Artist or creator (if known)",
  "isArtifact": true/false
}

Focus on Indian artifacts, sculptures, and paintings. If it's not an artifact or historical object, set "isArtifact" to false. Be specific and accurate with historical details.`

    const response = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'Museum Guide India',
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to analyze image with Gemini API', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json() as any
    const textResponse =
      data?.choices?.[0]?.message?.content?.find?.((c: any) => c.type === 'text')?.text ||
      data?.choices?.[0]?.message?.content?.[0]?.text

    if (!textResponse) {
      return NextResponse.json(
        { error: 'No response from Gemini API' },
        { status: 500 }
      )
    }

    // Try to extract JSON from the response
    let artifactInfo
    try {
      // Look for JSON in the response (might be wrapped in markdown code blocks)
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        artifactInfo = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: create structured response from text
        artifactInfo = {
          name: 'Artifact Detected',
          description: textResponse,
          period: 'Unknown',
          significance: 'This appears to be a cultural or historical artifact.',
          isArtifact: true
        }
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      artifactInfo = {
        name: 'Artifact Detected',
        description: textResponse,
        period: 'Unknown',
        significance: 'This appears to be a cultural or historical artifact.',
        isArtifact: true
      }
    }

    return NextResponse.json(artifactInfo)
  } catch (error) {
    console.error('Error in identify route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
