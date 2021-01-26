import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Components
import WizardButtons from 'components/WizardButtons';
import Link from 'components/Link';
import Checkbox from 'components/Checkbox';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Hooks
import useWindowSize from 'hooks/useWindowSize';
import useEmbeddedFile from 'hooks/useEmbeddedFile';

// Theme
import { colors } from 'theme';

// Utils
import { buildConsentFilePath } from 'helper/consentPathHelper';
import { scrollToTop } from 'helper/scrollHelper';

// Data
import { privacyPolicy } from 'data/privacyPolicy';

// Styles
import {
  WelcomeLogo,
  WelcomeTitle,
  WelcomeContent,
  WelcomeSubtitle,
  WelcomeStyledFormAlternative,
  WelcomeConsentForm,
} from '../style';

const schema = Yup.object().shape({
  agreedConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedPolicyTerms: Yup.boolean().required().default(false).oneOf([true]),
});

type Step3Type = Yup.InferType<typeof schema>;

const Step3 = (p: Wizard.StepProps) => {
  const { width } = useWindowSize();
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const [activeStep, setActiveStep] = React.useState(true);
  const { setDoGoBack } = useHeaderContext();

  const { state, action } = useStateMachine(updateAction(p.storeKey));
  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: state?.[p.storeKey],
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  const history = useHistory();
  const { isLoadingFile, file: consentFormContent } = useEmbeddedFile(
    buildConsentFilePath(state.welcome.country, state.welcome.language),
  );

  const onSubmit = async (values: Step3Type) => {
    if (values) {
      action(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

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
  const currentCountry: PrivacyPolicyCountry = state.welcome.country;

  return (
    <WelcomeStyledFormAlternative>
      <WelcomeLogo />

      <WelcomeTitle mt={width && width > 560 ? 38 : 12}>{t('consent:title')}</WelcomeTitle>

      <WelcomeContent>
        <WelcomeSubtitle fontWeight={400} mb={width && width > 560 ? 20 : 10} mt={width && width > 560 ? -5 : -22} textAlign="left" fontColor={colors.ultraDarkBlack}>
          <Trans i18nKey="consent:paragraph1">
            Virufy cares about your privacy and is advised by licensed data privacy experts.
            The information and recordings you provide will only be used for the
            purposes described in our <Link to={privacyPolicy[currentCountry]} target="_blank">Privacy Policy</Link> and Consent Form.
            Please read the consent form:
          </Trans>
        </WelcomeSubtitle>

        <WelcomeConsentForm dangerouslySetInnerHTML={{ __html: isLoadingFile ? 'Loading...' : consentFormContent }} />

        <WelcomeSubtitle fontWeight={400} mb={width && width > 560 ? 50 : 30} textAlign="left" mt={width && width > 560 ? 28 : 20}>
          <Trans i18nKey="consent:paragraph3">
            By checking the below boxes, you acknowledge that you have
            read and understood the Virufy <Link to={privacyPolicy[currentCountry]} target="_blank">Privacy Policy</Link>, and that
            you are providing your explicit consent to Virufy’s collection
            and processing of the categories of biometric and health information enumerated below.
            If you are located inside Brazilian national territory, and for the purposes of the
            General Personal Data Protection Law (“LGPD”), “consent”, in its free, informed,
            and unequivocal pronouncement, will be the legal basis on which we process sensitive personal data.
          </Trans>
        </WelcomeSubtitle>

        <Controller
          control={control}
          name="agreedConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              checkboxLeftOffsetPosition={width && width > 560 ? 64 : 32}
              fontWeight={width && width > 560 ? 400 : 700}
              id="Step2-ConsentTerms"
              label={t('consent:certify')}
              name="agreedConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedPolicyTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              checkboxLeftOffsetPosition={width && width > 560 ? 64 : 32}
              fontWeight={width && width > 560 ? 400 : 700}
              id="Step2-PolicyTerms"
              label={(
                <Trans i18nKey="consent:agree">
                  I agree to the terms of the Virufy
                  <Link to={privacyPolicy[currentCountry]} target="_blank">Privacy Policy</Link>
                </Trans>
              )}
              name="agreedPolicyTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <p><ErrorMessage errors={errors} name="name" /></p>
        {activeStep && (
          <Portal>
            <WizardButtons
              leftLabel={t('consent:nextButton')}
              leftHandler={handleSubmit(onSubmit)}
              leftDisabled={!isValid}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step3);
