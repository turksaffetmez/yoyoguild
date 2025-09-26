import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    type: 'frame',
    image: "https://yoyoguild.vercel.app/images/page.png", // Yeni page.png
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
  });
}

export async function GET() {
  return NextResponse.json({
    type: 'frame',
    image: "https://yoyoguild.vercel.app/images/page.png", // Yeni page.png
    buttons: [
      {
        label: "🎮 Play YoYo Battle",
        action: "link",
        target: "https://yoyoguild.vercel.app"
      }
    ]
  });
}