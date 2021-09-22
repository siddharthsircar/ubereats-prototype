import React from 'react';
import { StyledMenu } from './Menu.styled';
import { bool } from 'prop-types';

const Menu = ({ open }) => {
    return (
        <StyledMenu open={open}>
            <a href="/" style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>Sign In</a>
            <br />
            <a href="/" className='pa3' style={{ color: 'black' }}>Add Your Restaurant</a>
        </StyledMenu>
    )
}
Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu;