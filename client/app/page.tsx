"use client"

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(undefined)
  const [inbox, setInbox] = useState<any>(["hello", "nice"])
  useEffect(() =>{
    const socket = io('http://localhost:3000')
  },[])
  return (
    <div><div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
      
      <div className="flex flex-col gap-2 border rounded-lg p-10">
        {inbox.map((message: string, index: number) => (
          <div key={index} className="border rounded px-4 py-2">Hello</div>
        ))}
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input type="text" name="message" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40">Send message</button>
      </div>
      
      <div className="flex gap-2 align-center justify-center">
        <input type="text" name="message" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className="w-40">Join Room</button>
      </div>

    </div>
    </div>
  );
}
