import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { untrustedData } = body
  
  // Button 1: Play Game
  if (untrustedData.buttonIndex === 1) {
    return NextResponse.json({
      type: 'frame',
      frame: {
        version: 'next',
        image: `https://yoyoguild.vercel.app/images/page.png`,
        buttons: [
          {
            label: '🎮 Open Game',
            action: 'link',
            target: 'https://yoyoguild.vercel.app?source=farcaster'
          }
        ]
      }
    })
  }
  
  // Button 2: Leaderboard
  if (untrustedData.buttonIndex === 2) {
    return NextResponse.json({
      type: 'frame', 
      frame: {
        version: 'next',
        image: `https://yoyoguild.vercel.app/images/page.png`,
        buttons: [
          {
            label: '🏆 View Leaderboard',
            action: 'link', 
            target: 'https://yoyoguild.vercel.app?source=farcaster&tab=leaderboard'
          }
        ]
      }
    })
  }
}