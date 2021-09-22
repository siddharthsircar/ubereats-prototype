import React from 'react';
import { StyledBurger } from './Burgermenu.styled';
import { bool, func } from 'prop-types';

const Burger = ({ open, setOpen }) => {
    return (
        <div className='pa3'>
            <StyledBurger open={open} onClick={() => setOpen(!open)}>
                <div style={{ background: 'black' }} />
                <div style={{ background: 'black' }} />
                <div style={{ background: 'black' }} />
            </StyledBurger>
        </div>
    )
}
Burger.propTypes = {
    open: bool.isRequired,
    setOpen: func.isRequired
};
export default Burger;