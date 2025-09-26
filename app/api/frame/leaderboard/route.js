import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
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
        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 30 }}>
          🏆 Leaderboard
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '80%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
            <span>🥇 Player1</span>
            <span>15,240 pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
            <span>🥈 Player2</span>
            <span>12,850 pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
            <span>🥉 Player3</span>
            <span>11,920 pts</span>
          </div>
        </div>
        
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 30 }}>
          Top 100 players earn $YOYO rewards!
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}