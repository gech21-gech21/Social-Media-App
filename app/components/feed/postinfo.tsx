"use client"
import Image from 'next/image'
import React, { useState } from 'react'

const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false)
  
  // Assuming you have a deletePost function imported
  const deletePostWithId = () => {
    // Your delete post logic here
    console.log("Delete post with ID:", postId)
  }

  return (
    <div className='relative'>
      <Image
        src="/icons/more.png"
        width={20}
        height={20}
        alt="more options"
        className="cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      />
      {open && (
        <div className='absolute top-4 right-0 bg-white p-4 rounded-lg flex flex-col w-32 gap-2 text-xs shadow-lg z-30'> 
          <span className='cursor-pointer'>View</span>
          <span className='cursor-pointer'>Edit</span>
          <form action={deletePostWithId}>
            <button type="submit" className='text-red-500'>
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostInfo