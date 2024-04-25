import { Auth } from '../components/Auth'
import { Qoute } from '../components/Qoute'

export const SignIn = () => {
  return (
    <div className=''>
        <div className='grid grid-rows-2 md:grid-cols-2'> 
            <div>
                <Auth type='signin'/>
            </div>     
            <div>
                <Qoute />
            </div>
        </div>
    </div>
  )
}

