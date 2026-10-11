import './home.css'
import {Button} from './components/button/Button'

const Home = (props) => {
    console.log(props);

    return (
        <div className='home'>
        <h1>{props.title}</h1>
        <p>Welcome Home</p>
        </div>
    )
}

export default Home