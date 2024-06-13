import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SignUp} from "./pages/Signup"
import { Blog } from "./pages/Blog"
import { SignIn } from "./pages/Signin"
import { Blogs }from './pages/Blogs'
import { Publish } from './pages/Publish'
import { Profile } from './pages/Profile'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {

  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element= {<SignUp />}/>
          <Route path='/signin' element= {<SignIn />}/>
          <Route path='/blog/:id' element= {<Blog />}/>
          <Route path='/blogs' element= {<Blogs />}/>
          <Route path='/publish' element= {<Publish />}/>
          <Route path='/myProfile' element= {<Profile />}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
