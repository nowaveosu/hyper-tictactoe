"use client"

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(undefined)
  useEffect(() =>{
    const socket = io('http://localhost:3000')
  },[])
  return (
    <div>Hello</div>
  );
}
