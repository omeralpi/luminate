/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export const contentType = "image/png";

export async function GET(req: NextRequest) {
    try {
        const content = req.nextUrl.searchParams.get("content");

        const secretImage = await fetch(
            new URL("../../../public/secret.png", import.meta.url)
        ).then((res) => res.arrayBuffer());

        const earlyAdopterImage = await fetch(
            new URL("../../../public/early-adopter.png", import.meta.url)
        ).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div
                    style={{
                        fontFamily: "Rubik",
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
                        style={{ objectFit: "cover" }}
                    />
                    <div tw="absolute bottom-[0px] left-[16px] p-10 flex">
                        <img
                            src={earlyAdopterImage}
                            alt="early-adopter"
                            width={220}
                            height={220}
                        />
                    </div>
                    <div tw="absolute top-0 right-0 p-32 w-[750px] text-2xl">
                        {content}
                    </div>
                </div>
            ),
            {
            }
        );
    } catch (e) {
        console.error(e);
        return new Response("Failed to generate OG Image", { status: 500 });
    }
}