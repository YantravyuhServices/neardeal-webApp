import { Link } from 'react-router-dom';

const PackageSideBar = () => {

    const isActive = (path) => {
        return location.pathname === path ? 'active grey-active' : '';
    };

    return (
        <>
            <span><Link style={{textDecoration:'none'}} className={`${isActive('/create-package')}`} to="/create-package">Package Setup</Link></span>
            <span><Link style={{textDecoration:'none'}} className={`${isActive('/availability')}`} to="/availability">Availability</Link></span>
            <span><Link style={{textDecoration:'none'}} className={`${isActive('/limits')}`} to="/limits">Limits</Link></span>
        </>
    )
}

export default PackageSideBar