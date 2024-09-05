"use client"

import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import rock from "../../../public/image/rock.png";
import paper from "../../../public/image/paper.png";
import scissors from "../../../public/image/scissors.png";
import rock_checked from "../../../public/image/rock_checked.png";
import paper_checked from "../../../public/image/paper_checked.png";
import scissors_checked from "../../../public/image/scissors_checked.png";
import home_icon from "../../../public/image/home.png";

export default function Game({ params }: { params: { roomName: string } }) {
  const router = useRouter();
  const { roomName } = params;
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState<any>(undefined);
  const [rpsChoice, setRpsChoice] = useState(""); 
  const [showRematchButton, setShowRematchButton] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(9);

  const handleSendMessage = () => {
    socket.emit("message", message, roomName);
    setMessage(""); 
  }

  const handleMakeMove = (index: number) => {
    socket.emit("makeMove", index, roomName);
  }

  const handlePlayRPS = (choice: string) => { 
    setRpsChoice(choice);
    socket.emit("playRPS", choice, roomName);
  }

  const handleRematch = () => {
    const newRoomName = `${roomName}-re`;
    router.push(`/game/${newRoomName}`);
  };

  const renderCell = (cell: string, cellIndex: number) => {
    const oldestXIndex = gameState.playerSymbolQueues["X"].length >= 4 ? gameState.playerSymbolQueues["X"][0] : null;
    const oldestOIndex = gameState.playerSymbolQueues["O"].length >= 4 ? gameState.playerSymbolQueues["O"][0] : null;

    return (
      <div
        key={cellIndex}
        className={`border text-3xl px-4 py-2 w-12 h-12 flex items-center justify-center ${
          (oldestXIndex === cellIndex && cell === "X") ? "text-orange-800 animate-custom-pulse" :
          (oldestOIndex === cellIndex && cell === "O") ? "text-blue-800 animate-custom-pulse" : 
          cell === "X" ? "text-orange-400" : cell === "O" ? "text-blue-400" : ""
        }`}
        onClick={() => handleMakeMove(cellIndex)}
      >
        {cell}
      </div>
    );
  };

  useEffect(() => {
    const socket = io('https://port-0-hypertictactoe-server-1272llwkmw9kv.sel5.cloudtype.app/');
    setSocket(socket);

    socket.emit("joinRoom", roomName);

    socket.on("message", (message: string) => {
      setInbox((prevInbox) => [...prevInbox, message]);
      if (message === "** You win! **" || message === "** You lose! **") {
        setShowRematchButton(true);
      }
    });

    socket.on("gameState", (newGameState: any) => {
      setGameState(newGameState);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [inbox]);

  useEffect(() => {
    if (gameState && gameState.players[gameState.turn % 2] === socket.id) {
      setTurnTimeLeft(9); 
      const timerInterval = setInterval(() => {
        setTurnTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); 
      }, 1000);

      return () => clearInterval(timerInterval); 
    }
  }, [gameState]);

  return (
    <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
      <Image src={home_icon} alt="home icon" className='absolute top-4 left-5 w-6 ml-1 cursor-pointer' onClick={() => router.push("/")} />
      {gameState ? (
        gameState.rpsResult ? (
          <div className="flex flex-wrap justify-center">
            <div className='w-full text-center text-lg mb-4'>
              {gameState.players[gameState.turn % 2] === socket.id ? ( 
                  turnTimeLeft > 0 ? ( 
                    <>🤡 {gameState.players[0] === socket.id ? "X" : "O"}, your turn in {turnTimeLeft} seconds</>
                  ) : (
                    <>😱 {gameState.players[0] === socket.id ? "X" : "O"}, It's Your turn! Hurry up!</>
                  )
                ) : (
                  <>👺 Enemy's turn</>
              )}
            </div>
            <div className="grid grid-cols-5 gap-0">
              {gameState.board.map((cell: string, cellIndex: number) => renderCell(cell, cellIndex))}
            </div>
            {showRematchButton && (
              <div className="flex justify-center">
                <button className="w-40 mt-4" onClick={handleRematch}>Rematch</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-center w-full text-xl mb-6">Rock paper scissors to decide the first!</div>
            <div className="flex gap-2 align-center justify-center">
              <button onClick={() => handlePlayRPS("rock")}>
                <Image className="w-40" src={rpsChoice === "rock" ? rock_checked : rock} alt="rock" />
              </button>
              <button onClick={() => handlePlayRPS("paper")}>
                <Image className="w-40" src={rpsChoice === "paper" ? paper_checked : paper} alt="paper" />
              </button>
              <button onClick={() => handlePlayRPS("scissors")}>
                <Image className="w-40" src={rpsChoice === "scissors" ? scissors_checked : scissors} alt="scissors" />
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <p>Waiting for opponent...</p>
        </div>
      )}
      <div className='flex justify-center'>
        <div ref={messageListRef} className="flex flex-col gap-2 border rounded-lg p-10 w-[800px] max-h-[180px] overflow-y-auto justify-center"> 
          {inbox.map((message: string, index: number) => (
            <div key={index} className="border rounded px-4 py-2 mb-2 bg-zinc-900">{message}</div>
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        <div className="flex gap-2 align-center justify-center w-[800px]">
          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => { 
              if (e.key === 'Enter') handleSendMessage();
            }}
            type="text" 
            name="message" 
            placeholder="Type here" 
            className="flex-1 bg-black border rounded px-2 py-1"
          />
          <button className="ml-1" onClick={handleSendMessage}>Send Chat</button>
        </div>
      </div>
    </div>
  );
}