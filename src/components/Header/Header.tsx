import logo from '../../assets/ac_logo.png'
import './Header.css'

const Header = () => {
    return (
        <div className="header">
            <div className="header-logo-section">
                <img className="header-logo-img" src={logo} />
                <p className="header-logo-text">ABU CHOHAN</p>
            </div>
            <div className="header-socials">
                <p>instagram</p>
            </div>
        </div>
    )
}

export default Header
