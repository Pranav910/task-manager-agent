'use client'

import React, { useState, useEffect, useRef } from "react";
import PromptView from "@/components/PromptView.jsx"
import UserChatComponent from "@/components/UserChatComponent";
import AIChatComponent from "@/components/AIChatComponent";
import { ToastContainer, toast } from "react-toastify";
import './page.css'
import Image from "next/image";
import loading from '../../assets/loading.gif'
import StartLoader from "@/components/StartLoader";

export default function Home() {

  const [chats, setChats] = useState([
    {
      'type': 'ai',
      'chat': `## Hello!, Sir
  How can I assist you today?`,
      'fileURL': null,
      'sources': null
    }
  ])
  const [loadingState, setLoadingState] = useState(false)
  const loadingRef = useRef(null)
  const promptViewRef = useRef(null)
  const [startLoadingState, setStartLoadingState] = useState(false)
  const [tasks, setTasks] = useState([])

  function setUserChat(userChat, fileURL = null) {
    setChats(p => [...p, {
      type: 'user',
      chat: userChat,
      fileURL
    }])

  }

  function setPromptViewWidth(length) {
    const height = 12 + (length / 73) * 2
    if (promptViewRef.current && height <= 25)
      promptViewRef.current.style.height = `${height}%`
  }

  // async function checkServerStatus() {

  //   const res = await fetch("https://chatbot-server-y23u.onrender.com")
    
  //   if(res.status == 200)
  //     return true
  // }

  // useEffect(() => {

  //   const serverStatus = checkServerStatus()

  //   if(serverStatus)
  //     setStartLoadingState(false)
  // }, [])

  // useEffect(() => {

  //   if (loadingState == true) {
  //     loadingRef.current.style.marginBottom = "60px"
  //     loadingRef.current.scrollIntoView()
  //   }

  // }, [loadingState])

  return (
    <main className="relative h-screen w-full">

    {
      startLoadingState ? <StartLoader/> : null
    }

      <h2 className="logo">
        TaskManager
      </h2>

      <ToastContainer toastStyle={{ backgroundColor: '#303030', color: 'white' }} theme="dark" />

      <div className="chats">

        {
          tasks?.map((val, index) => (
            <div className="task-content" key={index}>

              <p>{val.title}</p>
              <p>{val.status}</p>
              <p className="due-date">{val.dueDate}</p>
            </div>
          ))
        }

      </div>

      <div className="promptview" ref={promptViewRef}>
        <PromptView setUserChat={setUserChat} setChats={setChats} setLoadingState={setLoadingState} setPromptViewWidth={setPromptViewWidth} showToast={toast} setTasks={setTasks}/>
      </div>
    </main>
  );
}
