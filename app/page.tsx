"use client"

import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import logo from "../public/logo.png"
import github_icon from "../public/github_icon.png"
import home_icon from "../public/home.png"



export default function Home() {
  const [socket, setSocket] = useState<any>(undefined)

  const [roomName, setRoomName] = useState("")

  const messageListRef = useRef<HTMLDivElement>(null);

  const [roomCounts, setRoomCounts] = useState({
    room1: 0,
    room2: 0,
    room3: 0,
  });

  const router = useRouter();

  const handleJoinRoom = (roomName: string) => {
    setRoomName(roomName);
    socket.emit("joinRoom", roomName);
    router.push(`/room/${roomName}`); 
  };

  
  useEffect(() =>{
    const socket = io('https://port-0-hypertictactoe-server-1272llwkmw9kv.sel5.cloudtype.app/')
    setSocket(socket);
    socket.emit("getRoomCounts");

    socket.on("roomCounts", (Counts: any) => {
      setRoomCounts(Counts);
    });
  },[])


  return (
    <div>
      <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">

        <div className="flex flex-col items-center">
            <Image className="lg:max-w-4xl md:max-w-xl sm:max-w-md" src={logo} alt="logo" onClick={() => window.location.reload()} />
            <div className="mt-4 mb-4 flex gap-4">
              <button className="w-24" onClick={() => handleJoinRoom("room1")}>
                Room 1 <span className="text-xs">({roomCounts.room1 ? roomCounts.room1 : 0}/2)</span> 
              </button>
              <button className="w-24" onClick={() => handleJoinRoom("room2")}>
                Room 2 <span className="text-xs">({roomCounts.room2 ? roomCounts.room2 : 0}/2)</span>
              </button>
              <button className="w-24" onClick={() => handleJoinRoom("room3")}>
                Room 3 <span className="text-xs">({roomCounts.room3 ? roomCounts.room3 : 0}/2)</span>
              </button>
            </div>
          </div>
      


          <div className='flex justify-center'>
          <div ref={messageListRef} className="flex flex-col gap-2 border rounded-lg p-10 mt-6 w-[800px] max-h-[270px] overflow-y-auto justify-center"> 
              <div className="border rounded px-4 py-2 mb-2 bg-zinc-900">{["hyper-tictactoe에 오신걸 환영합니다!"]}</div>
              <div className="border rounded px-4 py-2 mb-2 bg-zinc-900">{["룰 : 5턴이후 가장 오래된 말은 사라집니다, Room에 들어가 상대보다 먼저 4줄을 채우세요!"]}</div>
              <div className="border rounded px-4 py-2 mb-2 bg-zinc-900">{["게임 상대가 필요하다면 문자주세요! 010-7351-3804"]}</div>
              
          </div>
        </div>
  
      
      <Link href="https://github.com/nowaveosu" target="_blank">
        <div className='flex justify-center absolute top-4 right-5 text-stone-200 text-sm'> created by nowaveosu <Image src={github_icon} alt="github icon" className='w-6 ml-1' /></div>
      </Link>
      
    </div>
    </div>
  );
}