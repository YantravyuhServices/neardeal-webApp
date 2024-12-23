import { Link } from 'react-router-dom';

const PackageSideBar = () => {

    const isActive = (path) => {
        return location.pathname === path ? 'active grey-active' : '';
    };

    return (
        <>
            <span><Link style={{textDecoration:'none'}} className={`${isActive('/create-coupon')}`} to="/create-coupon">Coupon Setup</Link></span>
            <span>Analytics (soon)</span>
        </>
    )
}

export default PackageSideBar