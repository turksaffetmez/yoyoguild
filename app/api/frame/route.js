import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { untrustedData } = body;
    
    if (untrustedData?.buttonIndex === 1) {
      return NextResponse.json({
        type: 'frame',
        image: `https://yoyoguild.vercel.app/api/frame/image`,
        buttons: [
          {
            label: "🎮 Play Game",
            action: "link",
            target: "https://yoyoguild.vercel.app"
          },
          {
            label: "🏆 Leaderboard", 
            action: "post"
          }
        ],
        postUrl: `https://yoyoguild.vercel.app/api/frame`
      });
    }
    
    if (untrustedData?.buttonIndex === 2) {
      return NextResponse.json({
        type: 'frame',
        image: `https://yoyoguild.vercel.app/api/frame/leaderboard`,
        buttons: [
          {
            label: "🎮 Back to Game",
            action: "post"
          },
          {
            label: "Play Now →",
            action: "link",
            target: "https://yoyoguild.vercel.app"
          }
        ]
      });
    }
    
    return NextResponse.json({
      type: 'frame',
      image: `https://yoyoguild.vercel.app/api/frame/image`,
      buttons: [
        {
          label: "🎮 Play YoYo Battle",
          action: "link", 
          target: "https://yoyoguild.vercel.app"
        },
        {
          label: "📊 View Leaderboard",
          action: "post"
        }
      ],
      postUrl: `https://yoyoguild.vercel.app/api/frame`
    });
    
  } catch (error) {
    return NextResponse.json({
      type: 'frame',
      image: `https://yoyoguild.vercel.app/api/frame/image`,
      buttons: [
        {
          label: "🎮 Play YoYo Battle",
          action: "link", 
          target: "https://yoyoguild.vercel.app"
        }
      ]
    });
  }
}