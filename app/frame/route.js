import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({
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
  })
}

export async function POST(request) {
  return NextResponse.json({
    type: 'frame', 
    image: "https://yoyoguild.vercel.app/images/page.png",
    buttons: [
      {
        label: "🎮 Play YoYo Battle",
        action: "link",
        target: "https://yoyoguild.vercel.app"
      }
    ]
  })
}