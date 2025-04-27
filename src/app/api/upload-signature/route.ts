// app/api/upload-signature/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    const body = await req.json(); // bạn có thể custom folder

    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign: Record<string, string | number> = {
        timestamp,
        folder: body.folder ?? "product_image_description",
    };

    const sortedKeys = Object.keys(paramsToSign).sort();

    const signatureString = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join("&");

    const signature = crypto
        .createHash("sha1")
        .update(signatureString + process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!)
        .digest("hex");

    return NextResponse.json({
        timestamp,
        signature,
        folder: body.folder ?? "product_image_description",
    });
}
