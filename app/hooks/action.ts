import axios from "axios";
const handleError = (err:any) => {
    return err instanceof Error ? err.message : 'Something went wrong';
}

export async function register(username:string, password:string, profile?:string, profileId?:string){
    try {
        const res = await axios.post("/api/auth/register", {
            username,
            password,
            profile,
            profileId,
        });
        if(res.status !== 200) throw new Error(res.data.message);
        if(res.status === 200) return res.data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function login(username:string, password:string){
    try {
        const req = await fetch("/api/auth/login", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await req.json();
        if(data.success) return data;
        if(!data.success) return data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function logout(){
    try {
        const req = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
        });
        const data = await req.json();
        if(data.success) return data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function getUser(id:string){
    try {
        const req = await fetch("/api/getuser", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({id})
        });
        const data = await req.json();
        if(data.success) return data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function deleteImage(fileId:string){
    try {
        const res = await axios.delete(`/api/auth/deleteImage?fileId=${fileId}`);
        if(res.status !== 200) return res.data;
        if(res.status === 200) return res.data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function uploadGame(gamename:string, version:string, link:string, gameimage:string, features:string[], imageId:string, creator:string, uploader:string, status?:string){
    try {
        const res = await fetch("/api/auth/uploadGame", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({gamename, version, status, link, gameimage, imageId, creator, features, uploader})
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message);
        if(res.ok) return data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function getGames(){
    try {
        const req = await axios.get("/api/getGames");
        if(req.status === 200) return req.data;
        if(req.status !== 200) return req.data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}

export async function updateGame(id:string, status:string){
    try {
        const req = await axios.post("/api/auth/updateGame",{
            id,
            status
        });
        if(req.status === 200) return req.data;
        if(req.status !== 200) return req.data;
    } catch (error) {
        return {success: false, message: handleError(error)}
    }
}