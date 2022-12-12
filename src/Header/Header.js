import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header(props) {
    const navigate = useNavigate();

    function logMeOut() {
        axios({
        method: "POST",
        url:"/logout",
        })
        .then((response) => {
            props.removeToken()
            navigate('/');
        }).catch((error) => {
        if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })}

        return(
            <header className="header">
                <button className="btn" onClick={logMeOut}>
                    Logout
                </button>
            </header>
        )
}

export default Header;
