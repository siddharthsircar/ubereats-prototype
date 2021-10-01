import React from 'react';
import { StyledMenu } from './Menu.styled';
import { bool } from 'prop-types';
import { Link } from 'react-router-dom';

const Menu = ({ open }) => {
    return (
        <StyledMenu open={open} className='border shadow-2'>
            <Link to="/user/login"><a href="/user/login" style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>Sign In</a></Link>
            <br />
            <Link to="/restaurant/register"><a href="/restaurant/register" className='pa3' style={{ color: 'black' }}>Add Your Restaurant</a></Link>
        </StyledMenu>
    )
}
Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu;