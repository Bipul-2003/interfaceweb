'use server';

import { signOut } from "@/auth";



export default async function logOut() {

    const session = await signOut({redirectTo: '/'});
    return session;
}