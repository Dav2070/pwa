import styled from 'styled-components';
import { ReactComponent as Logo } from 'assets/virufyLogo.svg';

export const ThankYouLayout = styled.div`
  text-align: left;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    margin: 0 auto;
  }
`;

export const ThankYouLogo = styled(Logo)`
  display: none;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    display: block;
    margin: 250px auto 50px;
    width: 112px;
  }
`;

export const ThankYouTitle = styled.h1`
  font-family: "Open Sans";
  font-weight: bold;
  font-size: 34px;
  line-height: 142.69%;
  text-align: left;
  color: ${props => props.theme.colors.darkBlack};
`;

export const BeforeSubmitText = styled.p`
  font-family: 'Source Sans Pro';
  font-size: 14px;
  line-height: 142.69%;
  color: ${props => props.theme.colors.darkBlack};
`;

export const ThankYouSubmissionId = styled.span`
  color: ${props => props.theme.colors.darkBlack};
  font-family: 'Source Sans Pro';
  line-height: 160.50%;
  font-size: 16px;
  font-weight: 700;
`;

export const InstallPwa = styled.button`
  color: ${props => props.theme.colors.green};
  background-color: transparent;
  border: 0;
  font-weight: 700;
  padding: 0;
`;
