"use client"

import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Image from 'next/image';
import Link from 'next/link';

import logo from "../public/logo.png";
import rock from "../public/rock.png";
import paper from "../public/paper.png";
import scissors from "../public/scissors.png";
import rock_checked from "../public/rock_checked.png";
import paper_checked from "../public/paper_checked.png";
import scissors_checked from "../public/scissors_checked.png";
import github_icon from "../public/github_icon.png"

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined)
  const [inbox, setInbox] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [roomName, setRoomName] = useState("")
  const [gameState, setGameState] = useState<any>(undefined);
  const [rpsChoice, setRpsChoice] = useState(""); 
  const [joined, setJoined] = useState(false); 
  const [showRematchButton, setShowRematchButton] = useState(false);

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

  const handleRematch = () => {
    const newRoomName = roomName + "-re";
    setRoomName(newRoomName);
    socket.emit("joinRoom", newRoomName);
    setJoined(true);
    setShowRematchButton(false);
    setRpsChoice("");  
  };
  
  const renderCell = (cell: string, cellIndex: number) => {
    const currentPlayer = gameState.players[gameState.turn % 2];
    const isCurrentPlayer = currentPlayer === socket.id;

    const currentPlayerSymbol = currentPlayer === gameState.players[0] ? "X" : "O";
    const currentSymbolQueue = gameState.playerSymbolQueues[currentPlayerSymbol];
    const currentOldestIndex = currentSymbolQueue.length >= 4 ? currentSymbolQueue[0] : null;

    const isOldest = currentOldestIndex === cellIndex; 

    return (
      <div
        key={cellIndex}
        className={`border text-4xl px-4 py-2 w-16 h-16 flex items-center justify-center ${
          cell === "X" ? (isOldest ? "text-orange-800" : "text-orange-400") 
            : cell === "O" ? (isOldest ? "text-blue-800" : "text-blue-400")
            : ""
        }`}
        onClick={() => handleMakeMove(cellIndex)}
      >
        {cell}
      </div>
    );
  };
  
  useEffect(() => {
    const socket = io("https://hyper-tictactoe.com"); 
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
        socket.on("message", (message: string) => {
            setInbox((prevInbox) => [...prevInbox, message]);
            if (message === "** You win! **") {

                alert("You win!");
            } else if (message === "** You lose! **") {

                alert("You lose!");
            }
            if (message === "** You win! **" || message === "** You lose! **") {
              setShowRematchButton(true);
            }
        });
        
        socket.on("gameState", (newGameState: any) => {
          console.log("Client - received oldestIndex:", newGameState.oldestIndex);  
          setGameState((prevGameState:any) => ({
              ...prevGameState,
              ...newGameState,
              oldestIndex: newGameState.oldestIndex
          }));
      });
    }
}, [socket]);

  return (
    <div>
      <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
      {joined ? ( 
        gameState && gameState.rpsResult ? ( 
          <div className='flex flex-wrap justify-center'>
            <div className='w-full text-center text-lg mb-4'>
              {gameState.players[gameState.turn % 2] === socket.id ? "** 🤡 Your turn **" : "👺 Enemy's turn"}
            </div>
              <div className="grid grid-cols-4 gap-0">
                  {gameState.board.map((cell: string, cellIndex: number) => renderCell(cell, cellIndex))}  
              </div>
              {showRematchButton && (  
                  <div className="flex justify-center">
                      <button className="w-40" onClick={handleRematch}>Rematch</button>
                  </div>
              )}
          </div>

          
        ) : (
          gameState && gameState.players.length === 2 ? ( 
            <div>
              <div className='flex justify-center w-full text-xl mb-6'> Choose one </div>
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
            </div>
          ) : (
            <div className="flex justify-center"> 
              <p>Waiting for another user....</p>
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
        }} type="text" name="message" placeholder="" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleSendMessage}>Send message</button>
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setRoomName(e.target.value)
        }} onKeyPress={(e) => { 
          if (e.key === 'Enter') {
            handleJoinRoom();
          }
        }} type="text" name="room" placeholder="Type room1 and press enter (room1, room2...etc)" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40" onClick={handleJoinRoom}>Join Room</button>
      </div>
      
      <Link href="https://github.com/nowaveosu" target="_blank">
        <div className='flex justify-center absolute bottom-4 right-5 text-stone-200'> created by nowaveosu <Image src={github_icon} alt="github icon" className='w-7 ml-1' /></div>
      </Link>
      
    </div>
    </div>
  );
}
