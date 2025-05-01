// app/api/cloudinary/delete/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    const { public_id } = await req.json();

    if (!public_id) {
        return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto
        .createHash('sha1')
        .update(`public_id=${public_id}&timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

    const formData = new URLSearchParams();
    formData.append('public_id', public_id);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (res.ok) {
        return NextResponse.json({ success: true, result: data });
    } else {
        return NextResponse.json({ error: data }, { status: res.status });
    }
}
