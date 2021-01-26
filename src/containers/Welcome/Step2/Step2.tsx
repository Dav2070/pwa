import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Components
import Link from 'components/Link';
import WizardButtons from 'components/WizardButtons';

// Hooks
import useWindowSize from 'hooks/useWindowSize';

// Theme
import { colors } from 'theme';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import {
  WelcomeLogo,
  WelcomeTitle,
  WelcomeContent,
  WelcomeSubtitle,
  WelcomeSubtitleBold,
  WelcomeStyledFormAlternative,
  WelcomeNote,
  WomanWithPhoneFront,
} from '../style';

const Step2 = (p: Wizard.StepProps) => {
  const { width } = useWindowSize();
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStep, setActiveStep] = useState(true);
  const { setDoGoBack } = useHeaderContext();

  const history = useHistory();

  const handleNext = React.useCallback(() => {
    if (p.nextStep) {
      history.push(p.nextStep);
    }
  }, [history, p.nextStep]);

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
  }, [doBack, setDoGoBack]);

  const { t } = useTranslation();

  return (
    <WelcomeStyledFormAlternative>
      <WelcomeLogo />

      <WelcomeTitle mt={width && width > 560 ? 38 : 12}>{t('helpVirufy:title')}</WelcomeTitle>

      <WomanWithPhoneFront />

      <WelcomeNote isBold>{t('helpVirufy:noteTitle')}</WelcomeNote>
      <WelcomeNote> {t('helpVirufy:noteContent')}</WelcomeNote>

      <WelcomeContent>
        <WelcomeSubtitle fontWeight={400} mt={-15} mb={0} textAlign="left" fontColor={colors.darkBlack}>
          <Trans i18nKey="helpVirufy:paragraph1">
            <WelcomeSubtitleBold>Virufy</WelcomeSubtitleBold>
            is a Stanford COVID-19 Response Innovation Lab project that
            <WelcomeSubtitleBold>is currently developing technology to predict COVID-19 infections within minutes,
              based on cough sounds.
            </WelcomeSubtitleBold>
            We are a team of 50+ enthusiastic and ambitious youth and students from 25+ universities,
            with a global reach spanning 15+ countries.
            Our work is backed by our own clinical studies,
            as well as research from institutions including Carnegie Mellon, MIT, and Cambridge.
            <Link to="https://virufy.org/research" target="_blank">Click here</Link> to learn more about our research.
          </Trans>
        </WelcomeSubtitle>

        <WelcomeSubtitle fontWeight={400} mt={20} mb={0} textAlign="left" fontColor={colors.darkBlack}>
          <Trans i18nKey="helpVirufy:paragraph2">Our goal is to make testing and healthcare more
            <WelcomeSubtitleBold> globally accesible.</WelcomeSubtitleBold> We need your help!
          </Trans>
        </WelcomeSubtitle>
        <WelcomeSubtitle fontWeight={400} mt={20} textAlign="left" fontColor={colors.darkBlack}>
          <Trans i18nKey="helpVirufy:paragraph3">
            <WelcomeSubtitleBold>
              Donate your cough and voice to help Virufy learn what COVID sounds like.
            </WelcomeSubtitleBold>
            {' '}Your time and contributions to this study can impact not only the people in your own community,
            but also hundreds of millions of lives across 190+ countries!
          </Trans>
        </WelcomeSubtitle>
      </WelcomeContent>

      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('helpVirufy:nextButton')}
            leftHandler={handleNext}
          />
        </Portal>
      )}

    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step2);
