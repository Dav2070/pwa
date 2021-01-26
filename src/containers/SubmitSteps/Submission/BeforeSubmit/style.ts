import styled from 'styled-components';
import { ReactComponent as BeforeSubmitSvg } from 'assets/images/beforeSubmit.svg';

export const BeforeSubmitLayout = styled.div`
  text-align: left;
  position: relative;
  
  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    margin: 0 auto;
  }
`;

export const BeforeSubmitTitle = styled.h1`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 142.69%;
  color: ${props => props.theme.colors.darkBlack};
  margin-bottom: 10px;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    line-height: 160%;
  }
`;

export const BeforeSubmitText = styled.p`
  font-family: 'Source Sans Pro';
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.colors.darkGray_70};
  margin: 0;
  @media screen and (${props => props.theme.breakpoints.tablet}){
  }
`;

export const BeforeSubmitError = styled(BeforeSubmitText)`
  color: ${props => props.theme.colors.red};
  text-align: center;
`;

export const BeforeSubmitInput = styled.input`
  height: 50px;
  border: 1px solid #E6E6E6;
  border-radius: 4px;
  width: 100%;
  font-family: 'Source Sans Pro';
  line-height: 24px;
  padding: 13px 14px;
  ::placeholder {
    color: ${props => props.theme.colors.placeholderGray};
  }
  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    padding: 13px 30px;
  }
`;

export const BeforeSubmitImage = styled(BeforeSubmitSvg)`
  width: calc(100% + 40px);
  height: auto;
  margin: -5px -20px 5px;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 714px;
    margin-top: -25px;
    margin-bottom: 0;
  }
`;

export const RecaptchaContainer = styled.div`
  margin: 20px 0;
  
  div {
    margin: auto;
  }
`;
