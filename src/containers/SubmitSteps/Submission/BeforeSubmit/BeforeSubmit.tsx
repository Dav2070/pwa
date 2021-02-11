import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Components
import PhoneInput from 'components/PhoneInput';
import Recaptcha from 'components/Recaptcha';

// Update Action
import { resetStore } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';
import { getSpeechContext } from 'helper/stepsDefinitions';

// Styles
import WizardButtons from 'components/WizardButtons';
import { QuestionText } from 'containers/SubmitSteps/Questionary/style';
import ProgressIndicator from 'components/ProgressIndicator';
import useAxios from 'hooks/useAxios';
import {
  BeforeSubmitError,
  BeforeSubmitImage, BeforeSubmitInput, BeforeSubmitLayout, BeforeSubmitText, BeforeSubmitTitle,
} from './style';

const schema = Yup.object().shape({
  mobilePhoneNumber: Yup.string(),
  emailAddress: Yup.string().email(),
}).defined();

type Step6Type = Yup.InferType<typeof schema>;

const BeforeSubmit = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const { setDoGoBack, setTitle } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(resetStore());
  const axiosClient = useAxios();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!captchaValue) {
      setSubmitError(null);
    }
  }, [captchaValue]);

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors, isSubmitting } = formState;

  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  useEffect(() => {
    scrollToTop();
    setTitle(t('beforeSubmit:headText'));
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, t]);

  // Handlers
  const onSubmit = async (values: Step6Type) => {
    try {
      setSubmitError(null);
      if (values) {
        const {
          language,
          country,

          agreedConsentTerms,
          agreedPolicyTerms,
        } = state.welcome;

        const {
          recordYourCough,
          recordYourSpeech,

          testTaken,
          pcrTestDate,
          pcrTestResult,
          antigenTestDate,
          antigenTestResult,

          ageGroup,
          gender,
          biologicalSex,

          smokeLastSixMonths,
          currentSymptoms,
          symptomsStartedDate,
          currentRespiratoryCondition,
          currentMedicalCondition,

        } = state['submit-steps'];

        const {
          mobilePhoneNumber,
          emailAddress,
        } = values;

        const body = new FormData();

        body.append('language', language);
        body.append('country', country);

        body.append('agreedConsentTerms', agreedConsentTerms);
        body.append('agreedPolicyTerms', agreedPolicyTerms);

        body.append('cough', recordYourCough.recordingFile || recordYourCough.uploadedFile);
        body.append('voice', recordYourSpeech.recordingFile || recordYourSpeech.uploadedFile);

        body.append('testTaken', testTaken.join(','));

        if (testTaken.includes('pcr')) {
          body.append('pcrTestDate', pcrTestDate.toISOString());
          body.append('pcrTestResult', pcrTestResult);
        }

        if (testTaken.includes('antigen')) {
          body.append('antigenTestDate', antigenTestDate.toISOString());
          body.append('antigenTestResult', antigenTestResult);
        }

        if (ageGroup !== 'unselected') {
          body.append('ageGroup', ageGroup);
        }

        const genderSelected = gender.other || gender.selected[0];

        if (genderSelected) {
          body.append('gender', genderSelected);
        }

        if (biologicalSex) {
          body.append('biologicalSex', biologicalSex);
        }

        if (smokeLastSixMonths) {
          body.append('smokeLastSixMonths', smokeLastSixMonths);
        }

        if (currentSymptoms?.selected?.length > 0) {
          body.append('currentSymptoms', currentSymptoms.selected.join(','));
        }

        if (symptomsStartedDate) {
          body.append('symptomsStartedDate', symptomsStartedDate.toISOString());
        }

        if (currentRespiratoryCondition?.selected?.length > 0) {
          body.append('currentRespiratoryCondition', currentRespiratoryCondition.selected.join(','));
        }

        if (currentMedicalCondition?.selected?.length > 0) {
          body.append('currentMedicalCondition', currentMedicalCondition.selected.join(','));
        }

        if (currentSymptoms?.other) {
          body.append('otherSymptoms', currentSymptoms?.other);
        }

        if (currentRespiratoryCondition?.other) {
          body.append('otherRespiratoryConditions', currentRespiratoryCondition?.other);
        }

        if (currentMedicalCondition?.other) {
          body.append('otherMedicalConditions', currentMedicalCondition?.other);
        }

        if (mobilePhoneNumber) {
          body.append('mobilePhoneNumber', mobilePhoneNumber);
        }
        if (emailAddress) {
          body.append('emailAddress', emailAddress);
        }

        if (captchaValue) {
          body.append('captchaValue', captchaValue);
        }

        const response = await axiosClient.post('saveSurvey', body, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=SaveSurvey',
          },
        });

        action({});

        if (nextStep && response.data?.submissionId) {
          setActiveStep(false);
          history.push(nextStep, { submissionId: response.data.submissionId });
        }
      }
    } catch (error) {
      setSubmitError(t('beforeSubmit:submitError'));
    }
  };

  return (
    <>
      <ProgressIndicator currentStep={metadata?.progressCurrent || 4} totalSteps={metadata?.progressTotal || 4} />
      <BeforeSubmitLayout>
        <BeforeSubmitTitle>{t('beforeSubmit:title')}</BeforeSubmitTitle>
        <BeforeSubmitText>{t('beforeSubmit:paragraph1', { context: getSpeechContext() })}</BeforeSubmitText>
      </BeforeSubmitLayout>
      <BeforeSubmitImage />
      <BeforeSubmitLayout>
        <BeforeSubmitText>{t('beforeSubmit:paragraph2')}</BeforeSubmitText>

        <QuestionText extraSpace first rare>{t('beforeSubmit:phoneLabel')}</QuestionText>
        <Controller
          control={control}
          name="mobilePhoneNumber"
          defaultValue=""
          render={({ onChange, value }) => (
            <PhoneInput
              id="phone"
              value={value}
              onChange={onChange}
              country={state.welcome.country}
              placeholder={t('beforeSubmit:phonePlaceholder')}
            />

          )}
        />

        <QuestionText extraSpace first rare>{t('beforeSubmit:emailLabel')}</QuestionText>
        <Controller
          control={control}
          name="emailAddress"
          defaultValue=""
          render={({ onChange, value }) => (
            <BeforeSubmitInput
              value={value}
              onChange={onChange}
              type="text"
              id="email"
              placeholder={t('beforeSubmit:emailPlaceholder')}
            />
          )}
        />
      </BeforeSubmitLayout>
      <Recaptcha onChange={setCaptchaValue} />
      {/* Bottom Buttons */}
      {submitError && (
        <BeforeSubmitError>
          {submitError}
        </BeforeSubmitError>
      )}
      <p>
        <ErrorMessage errors={errors} name="name" />
      </p>
      {activeStep && (
        <Portal>
          <WizardButtons
            invert
            leftLabel={isSubmitting ? t('questionary:submitting') : t('questionary:nextButton')}
            leftHandler={handleSubmit(onSubmit)}
            leftDisabled={!captchaValue || isSubmitting}
          />
        </Portal>
      )}
    </>
  );
};

export default React.memo(BeforeSubmit);
