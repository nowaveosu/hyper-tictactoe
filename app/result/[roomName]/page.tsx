import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import home_icon from "../../../public/image/home.png";

export default function Result({ params }: { params: { roomName: string } }) {
  const router = useRouter();
  const { roomName } = params;
  
  const handleRematch = () => {
    const newRoomName = `${roomName}-re`;
    router.push(`/game/${newRoomName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={home_icon} alt="home icon" className='absolute top-4 left-5 w-6 ml-1 cursor-pointer' onClick={() => router.push("/")} />
      <div className="text-center">
        <h1 className="text-4xl mb-8">Game Over</h1>
        <p className="text-xl mb-4">You have finished the game in room {roomName}.</p>
        <button className="w-40 mt-4" onClick={handleRematch}>Rematch</button>
      </div>
    </div>
  );
}