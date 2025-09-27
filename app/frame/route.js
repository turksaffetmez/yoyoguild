export async function GET() {
  return Response.json({
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