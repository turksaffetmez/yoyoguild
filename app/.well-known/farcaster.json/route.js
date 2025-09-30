import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(
    'https://api.farcaster.xyz/miniapps/hosted-manifest/01999bd8-f007-9349-745c-f2da399795ef',
    307
  )
}