import { NextResponse } from 'next/server'

export async function GET() {
  const miniappData = {
    name: "YoYo Guild Battle",
    description: "Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!",
    icon: "https://yoyoguild.vercel.app/images/yoyo.png",
    splash: "https://yoyoguild.vercel.app/images/page.png",
    splashBackground: "#000000",
    url: "https://yoyoguild.vercel.app",
    terms: "https://yoyoguild.vercel.app/api/terms",
    privacy: "https://yoyoguild.vercel.app/api/privacy",
    network: "base",
    category: "gaming",
    tags: ["gaming", "battle", "blockchain", "yoyo", "base"],
    version: "1.0.0"
  }

  return NextResponse.json(miniappData)
}