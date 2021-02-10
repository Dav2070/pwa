import React, { useEffect, useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';
import usePortal from 'react-useportal';

// Components
import SocialIcons from 'components/SocialIcons';
import WizardButtons from 'components/WizardButtons';
import Link from 'components/LinkGreen';

// Utils
import { resetStore } from 'utils/wizard';

// Utils
import { scrollToTop } from 'helper/scrollHelper';
import { getSpeechContext } from 'helper/stepsDefinitions';

// Data
import { feedbackForm } from 'data/feedbackForm';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';
import usePWAHelpers from 'hooks/usePWAHelpers';

import {
  BeforeSubmitText, ThankYouLayout, ThankYouLogo, ThankYouTitle, ThankYouSubmissionId, InstallPwa,
} from './style';

interface ThankYouLocation {
  submissionId: string
}

const installPwaButtonId = 'virufy-install-button';

const ThankYou = (p: Wizard.StepProps) => {
  const { t } = useTranslation();
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });

  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle } = useHeaderContext();
  const { state, action } = useStateMachine(resetStore());
  const { handlePrompt, isInstalled, setIsInstalled } = usePWAHelpers(installPwaButtonId);

  const lang: FeedbackLanguage = state.welcome.language;
  const history = useHistory();
  const location = useLocation<ThankYouLocation>();

  const submissionId = location.state?.submissionId;

  const handleNext = React.useCallback(() => {
    action({});
    if (p.nextStep) {
      history.push(p.nextStep);
    }
  }, [action, history, p.nextStep]);

  const handleDoBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickInstall = React.useCallback(() => {
    if (handlePrompt) {
      const promise = handlePrompt();
      if (promise) {
        promise.then((userChoiceResult: any) => {
          if (userChoiceResult && userChoiceResult.outcome === 'accepted') {
            setIsInstalled(true);
          }
        });
      }
    }
  }, [handlePrompt, setIsInstalled]);

  useEffect(() => {
    scrollToTop();
    setTitle('');
    setDoGoBack(null);
  }, [handleDoBack, setDoGoBack, setTitle]);

  return (
    <ThankYouLayout>
      <Link to="http://www.virufy.org" target="_blank">
        <ThankYouLogo />
      </Link>
      <ThankYouTitle>{t('thankyou:title')}</ThankYouTitle>
      <BeforeSubmitText>{t('thankyou:paragraph1', { context: getSpeechContext() })}</BeforeSubmitText>
      {submissionId && (
      <BeforeSubmitText>{t('thankyou:paragraph2')}{' '}
        <ThankYouSubmissionId>{submissionId}</ThankYouSubmissionId>
      </BeforeSubmitText>
      )}
      <BeforeSubmitText>
        <Trans i18nKey="thankyou:paragraph3">
          If you later develop symptoms such as cough, fever,
          or shortness of breath, please come back to resubmit your latest cough sounds.
        </Trans>
        {' '}
        { !isInstalled
          && (
            <Trans i18nKey="thankyou:downloadApp">
              Download this app <InstallPwa id={installPwaButtonId} onClick={handleClickInstall}>here.</InstallPwa>
            </Trans>
          )}

      </BeforeSubmitText>
      <BeforeSubmitText>
        <Trans i18nKey="thankyou:paragraph4">
          Provide <Link to={feedbackForm[lang]} target="_blank" isBold>feedback</Link> for us to improve our application
          and check out our <Link to="http://www.virufy.org" target="_blank" isBold>website</Link>!
        </Trans>
      </BeforeSubmitText>
      <BeforeSubmitText>
        <Trans i18nKey="thankyou:paragraph5">
          Learn more about Virufy with our <Link to="https://virufy.org/press" target="_blank" isBold>news</Link>!
        </Trans>
      </BeforeSubmitText>
      <SocialIcons />

      {/* Bottom Buttons */}
      <Portal>
        <WizardButtons
          invert
          leftLabel={t('thankyou:returnButton')}
          leftHandler={handleNext}
        />
      </Portal>
    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
