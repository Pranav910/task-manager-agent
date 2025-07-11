"use client"

import React from "react"
import './userchat.css'
import Image from "next/image"

function UserChatComponent({chat, fileURL}) {

    return (
        <main className="userchatmain">
            <div className="userchatsub">
                {
                    fileURL ? <Image src={fileURL} width={200} height={100} objectFit={"contain"} layout="responsive" alt="file"/> : null
                }
                <p>
                    {chat}
                </p>
            </div>
        </main>
    )
}

export default UserChatComponent;