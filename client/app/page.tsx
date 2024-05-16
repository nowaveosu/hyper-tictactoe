"use client"

import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Image from 'next/image';

import logo from "../public/logo.png";
import rock from "../public/rock.png";
import paper from "../public/paper.png";
import scissors from "../public/scissors.png";
import rock_checked from "../public/rock_checked.png";
import paper_checked from "../public/paper_checked.png";
import scissors_checked from "../public/scissors_checked.png";

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined)
  const [inbox, setInbox] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [roomName, setRoomName] = useState("")
  const [gameState, setGameState] = useState<any>(undefined);
  const [rpsChoice, setRpsChoice] = useState(""); 
  const [joined, setJoined] = useState(false); 
  
  const handleSendMessage = () => {
    socket.emit("message",message, roomName)
  }
  
  const handleJoinRoom= () => {
    socket.emit("joinRoom", roomName)
    setJoined(true); 
  }

  const handleMakeMove = (index: number) => {
    socket.emit("makeMove", index, roomName);
  }

  const handlePlayRPS = (choice: string) => { 
    setRpsChoice(choice);
    socket.emit("playRPS", choice, roomName);
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
      {joined ? ( 
        gameState && gameState.rpsResult ? ( 
          <div className='flex flex-wrap justify-center'>
            <div className='w-full text-center text-lg mb-4'>
              {gameState.players[gameState.turn % 2] === socket.id ? "** 🤡 Your turn **" : "👺 Enemy's turn"}
            </div>
            {Array.from({ length: 12 }).map((_, rowIndex) => ( 
              <div key = {rowIndex} className='flex justify-center w-full'>
                {gameState.board.slice(rowIndex * 12, (rowIndex + 1) * 12).map((cell: string, cellIndex: number) => ( 
                  <div key={rowIndex * 12 + cellIndex} className = "border text-xl px-4 py-2 w-10 h-10 flex items-center justify-center" onClick={() => handleMakeMove(rowIndex * 12 + cellIndex)} >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          gameState && gameState.players.length === 2 ? ( 
            <div className="flex gap-2 align-center justify-center"> 
              <button onClick={() => handlePlayRPS("rock")}>
                <Image src={rpsChoice === "rock" ? rock_checked : rock} alt="rock" />
              </button>
              <button onClick={() => handlePlayRPS("paper")}>
                <Image src={rpsChoice === "paper" ? paper_checked : paper} alt="paper" />
              </button>
              <button onClick={() => handlePlayRPS("scissors")}>
                <Image src={rpsChoice === "scissors" ? scissors_checked : scissors} alt="scissors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center"> 
              <p>Waiting for another user...</p>
            </div>
          )
        )
      ) : (
        <div className="flex justify-center">
          <Image src={logo} alt="logo" />
        </div>
      )}

      <div className="flex flex-col gap-2 border rounded-lg p-10">
        {inbox.map((message: string, index: number) => (
          <div key={index} className="border rounded px-4 py-2">{message}</div>
        ))}
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setMessage(e.target.value)
        }} onKeyPress={(e) => { 
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }} type="text" name="message" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleSendMessage}>Send message</button>
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setRoomName(e.target.value)
        }} onKeyPress={(e) => { 
          if (e.key === 'Enter') {
            handleJoinRoom();
          }
        }} type="text" name="room" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleJoinRoom}>Join Room</button>
      </div>

    </div>
    </div>
  );
}
