import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  numberOfQuizzes: number;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #63c5da;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const NavWrapper = styled.div`
  margin: 0 auto;
  padding: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  margin: 0;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    @media (max-width: 767px) {
      display: ${({ isOpen }) => (isOpen ? "block" : "none")};
      text-align: center;
    }
  }
  li {
    text-decoration: none;
    list-style: none;
    margin: 8px 20px;
    @media (max-width: 767px) {
      display: block;
      margin: 8px 0;
    }
  }
`;

const NavButton = styled.button`
  float: right;
  font-family: "Roboto", sans-serif;
`;

const NavItem = styled.li`
  margin: 0;
  padding: 5px;
  background-color: white;
  border-radius: 25px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled.a`
  display: block;
  padding: 5px;
  border-radius: 25px;
  text-decoration: none;
  color: black;
`;

const Spacer = styled.div`
  height: 50px;
`;

const QuizNav: React.FC<Props> = ({ numberOfQuizzes }) => {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    console.log("numberOfQuizzes", numberOfQuizzes);
  });
  return (
    <>
      <Container>
        <NavWrapper>
          <Nav isOpen={isOpen}>
            <ul>
              {Array(numberOfQuizzes)
                .fill(null)
                .map((_, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink href={`#question_${i + 1}`}>
                        Quiz {i + 1}
                      </NavLink>
                    </NavItem>
                  );
                })}
            </ul>
          </Nav>
        </NavWrapper>
        <NavButton onClick={() => setIsOpen(!isOpen)}>Toggle Nav</NavButton>
      </Container>
      <Spacer />
    </>
  );
};

export default QuizNav;
