import { getUploadAuthParams } from "@imagekit/next/server"



export async function GET(req:Request){
    try {
        const { token , expire, signature} = getUploadAuthParams({
            privateKey: process.env.PRIVATE_KEY as string,
            publicKey: process.env.PUBLIC_KEY as string,
        });
        return Response.json({success: true, token, expire, signature, publicKey: process.env.PUBLIC_KEY});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return Response.json({success: false, message: err}, {status: 500});
    }
}