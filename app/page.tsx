"use client"
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from "../public/image/logo.png";
import Link from 'next/link';
import github_icon from "../public/image/github_icon.png"

export default function Home() {
  
  const [roomCounts, setRoomCounts] = useState({
    room1: 0,
    room2: 0,
    room3: 0,
  });

  const router = useRouter();
  const [socket, setSocket] = useState<any>(undefined);

  useEffect(() => {
    const socket = io('https://port-0-hypertictactoe-server-1272llwkmw9kv.sel5.cloudtype.app/');
    setSocket(socket);

    socket.emit("getRoomCounts");

    socket.on("roomCounts", (Counts: any) => {
      setRoomCounts(Counts);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoinRoom = (roomIndex: string) => {
    const roomName = `room${roomIndex}`;
    router.push(`/game/${roomName}`);
  };

  return (
    <div className="flex flex-col items-center">
      <Image className="mt-40 lg:max-w-4xl md:max-w-xl sm:max-w-md cursor-pointer" src={logo} alt="logo" onClick={() => window.location.reload()} />
      <div className="mt-4 mb-4 flex gap-4">
        <button className="w-24" onClick={() => handleJoinRoom("1")}>
          Room 1 <span className="text-xs">({typeof roomCounts.room1 === 'number' ? roomCounts.room1 : 0}/2)</span>
        </button>
        <button className="w-24" onClick={() => handleJoinRoom("2")}>
          Room 2 <span className="text-xs">({typeof roomCounts.room1 === 'number' ? roomCounts.room2 : 0}/2)</span>
        </button>
        <button className="w-24" onClick={() => handleJoinRoom("3")}>
          Room 3 <span className="text-xs">({typeof roomCounts.room1 === 'number' ? roomCounts.room3 : 0}/2)</span>
        </button>
      </div>
      <div className='flex justify-center'>
          <div className="flex flex-col gap-2 border rounded-lg p-10 mt-6  max-h-[180px] overflow-y-auto justify-center"> 
              <div className="border rounded px-4 py-2 mb-2 bg-zinc-900">{["hyper-tictactoe에 오신걸 환영합니다!"]}</div>
              <div className="border rounded px-4 py-2 mb-2 bg-zinc-900">{["룰 : 판에는 최대 4개의 말만 존재하며 가장 오래된 말은 사라집니다. Room에 들어가 상대보다 먼저 4줄을 채우세요!"]}</div>
          </div>
      </div>

      <Link href="https://github.com/nowaveosu" target="_blank">
        <div className='flex justify-center absolute top-4 right-5 text-stone-200 text-sm'>
          created by nowaveosu <Image src={github_icon} alt="github icon" className='w-6 ml-1' />
        </div>
      </Link>
    </div>
  );
}