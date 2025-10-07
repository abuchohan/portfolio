import './App.css'
import Header from './components/Header/Header'
import avatar from './assets/animoji.png'

function App() {
    return (
        <>
            <Header />
            <div className="grid">
                <div
                    className="card"
                    style={{
                        gridColumn: '1',
                        gridRow: '1 / span 2',
                        background: 'linear-gradient(135deg, #4a90e2, #5aa6f7)', // darker baby blue
                    }}
                />
                <div
                    className="card"
                    style={{
                        gridColumn: '2',
                        gridRow: '1 / span 2',
                        background: 'linear-gradient(135deg, #ff944d, #ffad66)', // darker orange
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="tag">About Me</div>
                        <p>
                            I’m a dedicated developer, committed to delivering
                            clean, efficient code and exceptional results.
                        </p>
                    </div>

                    <img src={avatar} style={{ width: 240, height: 'auto' }} />
                </div>
                <div
                    className="card"
                    style={{
                        gridColumn: '3',
                        gridRow: '1 / span 3',
                        background: 'linear-gradient(135deg, #9b6de5, #b185f6)', // lilac tone
                    }}
                />
                <div
                    className="card"
                    style={{
                        gridColumn: '1 / span 2',
                        gridRow: '3',
                        background: 'linear-gradient(135deg, #f2c94c, #f5d76e)', // deeper yellow
                    }}
                />
            </div>
        </>
    )
}

export default App
