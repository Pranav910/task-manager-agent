import React from "react";
import startLoader from "../../public/start-loader.gif"
import "./start-loader.css"
import Image from "next/image";

export default function StartLoader() {


    return (
        <main className="start-loader-main">
            <div>
                <Image src={startLoader} width={20} height={20} alt="start loader"/>
                <p>This service is hosted on a free tier platform. Server might take some time to load. Try refreshing the page.</p>
            </div>
        </main>
    )
}