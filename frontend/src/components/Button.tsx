import React from 'react'

const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return <button className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
        onClick={onClick}>
        {children}
    </button>
}

export default Button
