import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import useToken from '../useToken'
import './MenuPage.css'

function MenuPage() {
    const { removeToken } = useToken()

    // Navigation
    const navigate = useNavigate()

    return (
        <div id="menu-body" className="App">

            <div id="menu">
                <div id="title"> Algorithms Game</div>
                <div id="loginFrame">
                    <button
                        id="startBtn"
                        className="btn"
                        onClick={() => {
                            navigate('/SelectionPage')
                        }}
                    >
                        {' '}
                        Selection{' '}
                    </button>
                    <button
                        id="statsBtn"
                        className="btn"
                        onClick={() => {
                            navigate('/Profile')
                        }}
                    >
                        {' '}
                        Statistics{' '}
                    </button>
                    <Header className ="btn" removeToken={removeToken} />
                </div>
            </div>
        </div>
    )
}

export default MenuPage
