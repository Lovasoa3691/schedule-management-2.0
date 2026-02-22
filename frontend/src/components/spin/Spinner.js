import React from "react";
import styled from "styled-components";

const Spinner = () => {
  return (
    <div className="flex justify-start items-center py-2">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader flex justify-center items-center py-6">
        <span className="bar bg-blue-500" />
        <span className="bar bg-blue-500" />
        <span className="bar bg-blue-500" />
      </div>
    </StyledWrapper>
  );
};

const Loader2 = () => {
  return (
    <StyledWrapper>
      <div className="loader flex justify-center items-start">
        <span className="bar bg-blue-500" />
        <span className="bar bg-blue-500" />
        <span className="bar bg-blue-500" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
  }

  .bar {
    display: inline-block;
    width: 3px;
    height: 20px;
    border-radius: 10px;
    animation: scale-up4 1s linear infinite;
  }

  .bar:nth-child(2) {
    height: 35px;
    margin: 0 5px;
    animation-delay: 0.25s;
  }

  .bar:nth-child(3) {
    animation-delay: 0.5s;
  }

  @keyframes scale-up4 {
    20% {
      background-color: #ffff;
      transform: scaleY(1.5);
    }

    40% {
      transform: scaleY(1);
    }
  }
`;

export { Spinner, Loader, Loader2 };
