import styled from 'styled-components';
import { BlackText } from 'components/Texts';
import { colors } from 'theme';

export const MainContainer = styled.div`
  padding: 40px 0px;
`;

export const Text = styled(BlackText)`
  color: ${props => props.theme.colors.darkBlack};
  margin-bottom: 40px;
  text-align: left;
  font-weight: bold;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    margin: 0 auto;
    font-size: 16px;
  }

  @media screen and (${props => props.theme.breakpoints.tablet}){
    @media (orientation: portrait) {
      margin-bottom: 248px;
    }

    @media (orientation: landscape) {
      margin-bottom: 24px;
    }
  }
`;

export const MicContainer = styled.div``;

export const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: fit-content;
  margin: 0 auto;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    padding: 22px;
  }
`;

export const UploadImage = styled.img`
  cursor: pointer;
  width: 13px;
  height: 12px;
  margin-right: 7px;
`;

export const UploadText = styled.div`
  cursor: pointer;
  font-family: Source Sans Pro;
  font-weight: bold;
  font-size: 0.75rems;
  line-height: 24px;
  color: ${colors.darkBlack};
  text-transform: uppercase;

`;
