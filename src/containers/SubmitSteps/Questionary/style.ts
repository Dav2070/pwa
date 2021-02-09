import styled from 'styled-components';
import { ReactComponent as WomanWithPhoneSvg } from 'assets/images/womanWithPhoneSide.svg';

/* Delete after Contact info step is re-integrated */
import { BeforeSubmitError } from 'containers/SubmitSteps/Submission/BeforeSubmit/style';

export const Title = styled.h1`
  font-family: "Open Sans";
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2.25rem;
  color: ${props => props.theme.colors.darkBlack};

  @media screen and (${props => props.theme.breakpoints.tablet}){
    margin-top: 40px;
  }
`;

export const WomanWithPhone = styled(WomanWithPhoneSvg)`
  width: calc(100% + 40px);
  height: auto;
  margin: 0 -20px;
  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 714px;
  }
`;

export const GrayExtraInfo = styled.h6`
  color: ${props => props.theme.colors.darkGray_70};
  font-family: "Source Sans Pro";
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  margin-top: 10px;
  text-align: left;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    margin-top: 15px;
    text-align: center;
  }
`;

export const QuestionText = styled.p<{extraSpace?: boolean; first?: boolean; rare?: boolean; }>`
  font-family: "Source Sans Pro";
  font-size: 1rem;
  line-height: 1.375rem;
  font-weight: 700;
  margin-top: ${props => (props.extraSpace ? 30 : 20)}px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.darkBlack};

  @media screen and (${props => props.theme.breakpoints.tablet}){
    margin-top: ${props => (props.extraSpace && !props.first ? 100 : 40)}px;
    margin-bottom: ${props => (props.rare ? 23 : 60)}px;
  }
`;
export const QuestionNote = styled.span`
  font-family: "Source Sans Pro";
  font-size: 12px;
  line-height: 142.69%;
  font-weight: normal;
  margin-top: 12px;
  color: ${props => props.theme.colors.black};
  display: block;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    font-size: 1rem;
    line-height: 1.375rem;
    margin-top: 0;
  }
`;

export const QuestionStepIndicator = styled.p`
  color: ${props => props.theme.colors.darkGray_50};
  font-family: "Source Sans Pro";
  font-size: 12px;
  line-height: 24px;
  text-align: center;
`;

export const QuestionRequiredIndicatorText = styled.span`
  color: ${props => props.theme.colors.red};
`;

/* Delete after Contact info step is re-integrated */
export const TempBeforeSubmitError = styled(BeforeSubmitError)`
  margin-bottom: 16px;
`;
