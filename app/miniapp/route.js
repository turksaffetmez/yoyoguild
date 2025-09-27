import { NextResponse } from 'next/server'

export async function GET() {
  const miniAppData = {
    version: "1.0",
    name: "YoYo Guild Battle",
    iconUrl: "https://yoyoguild.vercel.app/images/yoyo.png",
    homeUrl: "https://yoyoguild.vercel.app",
    description: "Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!",
    termsOfServiceUrl: "https://yoyoguild.vercel.app/terms",
    privacyPolicyUrl: "https://yoyoguild.vercel.app/privacy",
    permissions: ["identity", "storage"],
    webhookUrl: "https://yoyoguild.vercel.app/api/webhook",
    supportedFarcasterVersions: ["vNext"]
  }

  return NextResponse.json(miniAppData, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}