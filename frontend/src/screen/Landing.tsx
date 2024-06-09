import { useNavigate } from "react-router-dom"
import Button from "../components/Button"

const Landing = () => {

    const navigate = useNavigate()
    return (
        <div className="flex justify-center">
            <div className='pt-4 max-w-screen-lg'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='flex justify-center'>
                        <img src={"/chessBoard.jpeg"} alt='chess' className='max-w-96' />
                    </div>
                    <div className="flex justify-center items-center flex-col">
                        <h1 className='text-4xl font-bold text-white'>Play Chess Online</h1>
                        <div className='mt-4 flex justify-center'>
                            <Button onClick={() => navigate('/game')}>Play Online</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
