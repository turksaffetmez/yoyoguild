import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
          padding: 20
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 20 }}>
          🎮 YoYo Guild Battle
        </div>
        <div style={{ fontSize: 24, marginBottom: 10 }}>
          Blockchain NFT Battle Game
        </div>
        <div style={{ fontSize: 20, opacity: 0.8 }}>
          Play • Earn • Win $YOYO
        </div>
        <div style={{ fontSize: 16, opacity: 0.6, marginTop: 20 }}>
          yoyoguild.vercel.app
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}