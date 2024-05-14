"use client"

import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined)
  const [inbox, setInbox] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [roomName, setRoomName] = useState("")
  const [gameState, setGameState] = useState<any>(undefined);
  
  const handleSendMessage = () => {
    socket.emit("message",message, roomName)
  }
  
  const handleJoinRoom= () => {
    socket.emit("joinRoom", roomName)
  }

  const handleMakeMove = (index: number) => {
    socket.emit("makeMove", index, roomName);
  }
  
  useEffect(() =>{
    const socket = io('http://localhost:3000')
    setSocket(socket)
  },[])

  useEffect(() => {
    if (socket) {
      socket.on('message',(message: string) => {
        setInbox((prevInbox) => [...prevInbox, message]) 
      })

      socket.on('gameState', (gameState: any) => {
        setGameState(gameState);
      })
    }
  }, [socket]) 

  return (
    <div>
      <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
      <div className='flex flex-wrap justify-center'>
          {gameState && Array.from({ length: 3 }).map((_, rowIndex) => (
            <div key = {rowIndex} className='flex justify-center w-full'>
              {gameState.board.slice(rowIndex * 3, (rowIndex + 1) * 3).map((cell: string, cellIndex: number) => (
                <div key={rowIndex * 3 + cellIndex} className = "border rounded px-4 py-2 m-1 w-8 h-8 flex items-center justify-center" onClick={() => handleMakeMove(rowIndex * 3 + cellIndex)} >
                  {cell}
                </div>
              ))}
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-2 border rounded-lg p-10">
        {inbox.map((message: string, index: number) => (
          <div key={index} className="border rounded px-4 py-2">{message}</div>
        ))}
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setMessage(e.target.value)
        }}type="text" name="message" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleSendMessage}>Send message</button>
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setRoomName(e.target.value)
        }}type="text" name="room" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleJoinRoom}>Join Room</button>
      </div>

    </div>
    </div>
  );
}
