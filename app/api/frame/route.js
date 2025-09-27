import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const frameData = {
      type: 'frame',
      image: "https://yoyoguild.vercel.app/images/page.png",
      buttons: [
        {
          label: "🎮 Play Game",
          action: "link", 
          target: "https://yoyoguild.vercel.app"
        },
        {
          label: "🏆 Leaderboard",
          action: "link",
          target: "https://yoyoguild.vercel.app?tab=leaderboard"
        }
      ]
    }

    return NextResponse.json(frameData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Frame generation failed' }, { status: 500 })
  }
}

export async function POST(request) {
  const frameData = {
    type: 'frame',
    image: "https://yoyoguild.vercel.app/images/page.png", 
    buttons: [
      {
        label: "🎮 Play YoYo Battle",
        action: "link",
        target: "https://yoyoguild.vercel.app"
      }
    ]
  }

  return NextResponse.json(frameData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}