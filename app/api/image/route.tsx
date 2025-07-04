/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const contentType = "image/png";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function loadGoogleFont(font: string, text: string) {
    const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(url, { cache: 'no-store' })).text()
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

    if (resource) {
        const response = await fetch(resource[1], { cache: 'no-store' })
        if (response.status == 200) {
            return await response.arrayBuffer()
        }
    }

    throw new Error('failed to load font data')
}

export async function GET(req: NextRequest) {
    try {
        const content = req.nextUrl.searchParams.get("content");

        const secretImage = await fetch(
            new URL("../../../public/secret.png", import.meta.url),
            { cache: 'no-store' } // Disable cache for image fetch
        ).then((res) => res.arrayBuffer());

        const response = new ImageResponse(
            (
                <div
                    style={{
                        fontFamily: "Dancing Script",
                        fontWeight: "bolder",
                    }}
                    tw="w-full h-full flex items-center justify-center relative"
                >
                    <img
                        src={secretImage}
                        width={100}
                        height={100}
                        alt="background"
                        tw="w-full h-full"
                    />
                    <div tw="absolute top-0 right-0 p-32 w-[100%] text-5xl text-center text-white text-shadow-2xl">
                        {content}
                    </div>
                </div>
            ),
            {
                fonts: [
                    {
                        name: 'Dancing Script',
                        data: await loadGoogleFont('Dancing Script', content || ''),
                        style: 'normal',
                    },
                ],
            }
        );

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');

        return response;

    } catch (e) {
        console.error(e);
        return new Response("Failed to generate OG Image", { status: 500 });
    }
}