import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Frame data processing
    const { untrustedData } = body;
    
    if (untrustedData.buttonIndex === 1) {
      // "Play Now" butonu
      return NextResponse.json({
        type: 'frame',
        image: `${process.env.NEXT_PUBLIC_URL}/api/frame/image`,
        buttons: [
          {
            label: "🎮 Play Game",
            action: "link",
            target: process.env.NEXT_PUBLIC_URL
          },
          {
            label: "🏆 Leaderboard", 
            action: "post"
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame`
      });
    }
    
    // Default frame
    return NextResponse.json({
      type: 'frame',
      image: `${process.env.NEXT_PUBLIC_URL}/api/frame/image`,
      buttons: [
        {
          label: "🎮 Play YoYo Battle",
          action: "link", 
          target: process.env.NEXT_PUBLIC_URL
        },
        {
          label: "📊 My Stats",
          action: "post"
        }
      ]
    });
    
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Frame error' }, { status: 500 });
  }
}