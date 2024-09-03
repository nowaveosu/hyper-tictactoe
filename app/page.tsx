"use client"
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from "../../public/image/logo.png";
import Link from 'next/link';

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
      <Image className="lg:max-w-4xl md:max-w-xl sm:max-w-md cursor-pointer" src={logo} alt="logo" onClick={() => window.location.reload()} />
      <div className="mt-4 mb-4 flex gap-4">
        <button className="w-24" onClick={() => handleJoinRoom("1")}>
          Room 1 <span className="text-xs">({roomCounts.room1}/2)</span>
        </button>
        <button className="w-24" onClick={() => handleJoinRoom("2")}>
          Room 2 <span className="text-xs">({roomCounts.room2}/2)</span>
        </button>
        <button className="w-24" onClick={() => handleJoinRoom("3")}>
          Room 3 <span className="text-xs">({roomCounts.room3}/2)</span>
        </button>
      </div>
      <Link href="https://github.com/nowaveosu" target="_blank">
        <div className='flex justify-center absolute top-4 right-5 text-stone-200 text-sm'>
          created by nowaveosu <Image src="../../public/image/github_icon.png" alt="github icon" className='w-6 ml-1' />
        </div>
      </Link>
    </div>
  );
}