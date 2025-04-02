import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Vibe Surf School - Fort Lauderdale, Florida';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #005d8e, #0077b6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px 80px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <img 
            src="https://vibesurfschool.com/images/vibe-surfschool-logo.svg" 
            alt="Vibe Surf School Logo" 
            width={150}
            height={150}
            style={{ marginRight: 20 }}
          />
          <div style={{ fontSize: 70, fontWeight: 'bold', lineHeight: 1.2 }}>
            VIBE SURF SCHOOL
          </div>
        </div>
        <div style={{ fontSize: 40, opacity: 0.9, marginTop: 20 }}>
          Fort Lauderdale, Florida
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, marginTop: 20, maxWidth: 800 }}>
          Professional Surf Lessons • Paddleboarding • Snorkeling Adventures
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
