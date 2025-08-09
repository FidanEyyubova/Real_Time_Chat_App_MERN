import React from 'react'

const RightSidebar = ({selectedUser}) => {
  return selectedUser && (
    <div>
      <div>
        <img src={selectedUser?.profilePic} alt="" className='w-20 aspect-[1/1] rounded-full' />
      <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
        <p className=''></p>
        {selectedUser.name}
      </h1>
      </div>
    </div>
  )
}

export default RightSidebar
