import styled from "styled-components";

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 300px;
  text-align: left;
  padding: 2rem;
  position: fixed;
  z-index: 1;
  top: 8vh;
  left: 0;
  transition: transform 0.5s ease-in-out;
  background: white;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};

  a {
    text-transform: uppercase;
    top: 10vh;
    padding: 10px;
    font-weight: bold;
    letter-spacing: 0.5rem;
    text-decoration: none;
    transition: color 0.3s linear;
  }
`;
