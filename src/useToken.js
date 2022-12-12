import { useState } from 'react'

function useToken() {
    function getToken() {
        const userToken = localStorage.getItem('token')
        setToken(userToken)
        return token
    }

    const [token, setToken] = useState()

    function saveToken(userToken) {
        localStorage.setItem('token', userToken)
        setToken(userToken)
    }

    function removeToken() {
        localStorage.removeItem('token')
        setToken(null)
    }

    return {
        setToken: saveToken,
        token,
        removeToken,
    }
}

export default useToken
