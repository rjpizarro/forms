import React from 'react';
import styled, {css} from 'styled-components';

const setPadding = css`
  padding: ${({padding}) => (padding) ? padding : ''};
  padding: ${({paddingHorizontal}) => (paddingHorizontal) ?  '0' + paddingHorizontal + 'px' : ''};
  padding: ${({paddingVertical}) => (paddingVertical) ?  paddingVertical + 'px' + '0'  : ''};
  padding-top: ${({paddingTop}) => (paddingTop) ?  paddingTop : ''};
  padding-bottom: ${({paddingBottom}) => (paddingBottom) ?  paddingBottom : ''};
  padding-left: ${({paddingLeft}) => (paddingLeft) ?  paddingLeft : ''};
  padding-right: ${({paddingRight}) => (paddingRight) ?  paddingRight : ''};
`;

const BaseDiv = styled.div`
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  background: ${props => props.background};
  width: ${props => props.width};
`;

const Flex = BaseDiv.extend`
  display: flex;
  align-items: ${({align}) => (align) ? align : 'center'};  
  justify-content: ${({justify}) => (justify) ? justify : 'center'};
  flex-direction: ${({direction}) => (direction) ? direction : 'row'};
  flex: ${({flex}) => (flex) ? flex : 1};
`;

const FlexMainContainer = BaseDiv.extend`
  flex-grow: 1;
  display: flex; 
  position: relative;
  z-index: ${({zIndex}) => (zIndex) ? zIndex : 1};
  height: ${({screenHeight}) => screenHeight};
  flex-direction: ${({direction}) => (direction) ? direction : 'row'};
`;

const Container = BaseDiv.extend`   
`;

const MainContainer = BaseDiv.extend`
  height: 100vh;   
`;

export {
    MainContainer,
    Container,
    Flex,
    FlexMainContainer,
}