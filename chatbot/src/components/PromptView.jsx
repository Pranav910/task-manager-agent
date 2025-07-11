"use client"

import React, { useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import './prompt_view.css'
import up_arrow from '../../assets/up-arrow.svg'

function PromptView({ setUserChat, setLoadingState, setTasks }) {

    const [userInput, setUserInput] = useState("")
    const [file, setFile] = useState(null)
    const userInputRef = useRef(null)


    function updateUserInput(e) {
        setUserInput(e.target.value)
    }

    function sendUserInput(e) {
        if (e.key === "Enter") {
            if (!file && userInput.length)
                get_model_response()
            else if (userInput.length)
                get_model_response_with_file()
        }
    }

    async function get_model_response() {

        setUserChat(userInput)
        setUserInput("")
        setLoadingState(true)

        const response = await fetch(`http://localhost:5000/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'user', message: userInput })
        })

        let data = await response.json()
        console.log(data.response)
        
        setTasks(data.response)

        setLoadingState(false)
    }

    return (
        <main className="promptmain">
            <div className="promptsub">
                <textarea ref={userInputRef} className="promptinput" placeholder="Enter Prompt" onKeyDown={sendUserInput} value={userInput} onChange={updateUserInput} />
                <div className="up-arrow-main">
                    {
                        userInput.length ?
                            <Image className="up-arrow" width={30} height={30} alt="up-arrow" src={up_arrow} onClick={get_model_response} /> :
                            null
                    }
                </div>

            </div>
        </main>
    )
}

export default PromptView;