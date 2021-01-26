import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';
import useAxios from 'hooks/useAxios';

// Update Action
import { updateAction } from 'utils/wizard';

// Components
import ProgressIndicator from 'components/ProgressIndicator';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import OptionList from 'components/OptionList';
import WizardButtons from 'components/WizardButtons';
import {
  QuestionText, QuestionStepIndicator, GrayExtraInfo, TempBeforeSubmitError, TempReCaptchaContainer,
} from '../style';

const schema = Yup.object({
  currentMedicalCondition: Yup.object(),
}).defined();

type Step6Type = Yup.InferType<typeof schema>;

const Step6 = ({
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
  const { t, i18n } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  /* Delete after Contact info step is re-integrated */
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);
  const { isSubmitting } = formState;
  const axiosClient = useAxios();

  useEffect(() => {
    if (!captchaValue) {
      setSubmitError(null);
    }
  }, [captchaValue]);

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

  /*  */

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
    setTitle(t('questionary:headerText'));
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, t]);

  // Handlers
  // const onSubmit = async (values: Step6Type) => {
  //   if (values) {
  //     action(values);
  //     if (nextStep) {
  //       setActiveStep(false);
  //       history.push(nextStep);
  //     }
  //   }
  // };

  return (
    <>
      <ProgressIndicator currentStep={4} totalSteps={4} />

      <GrayExtraInfo>{t('questionary:caption')}</GrayExtraInfo>

      <QuestionText>
        {t('questionary:medical.question')}
      </QuestionText>
      <Controller
        control={control}
        name="currentMedicalCondition"
        defaultValue={{ selected: [], other: '' }}
        render={({ onChange, value }) => (
          <OptionList
            value={value}
            onChange={v => onChange(v)}
            items={[
              {
                value: 'chronicLungDisease',
                label: t('questionary:medical.options.chronicLung'),
              },
              {
                value: 'congestiveHeartFailure',
                label: t('questionary:medical.options.congestiveHeart'),
              },
              {
                value: 'coughFromOtherMedicalConditions',
                label: t('questionary:medical.options.cough'),
              },
              {
                value: 'extremeObesity',
                label: t('questionary:medical.options.obesity'),
              },
              {
                value: 'hivAidsOrImpairedImmuneSystem',
                label: t('questionary:medical.options.hiv'),
              },
              {
                value: 'pulmonaryFibrosis',
                label: t('questionary:medical.options.pulmonary'),
              },
              {
                value: 'pregnancy',
                label: t('questionary:medical.options.pregnancy'),
              },
              {
                value: 'valvularHeartDisease',
                label: t('questionary:medical.options.valvularHeart'),
              },
              {
                value: 'none',
                label: t('questionary:medical.options.none'),
              },
            ]}
            allowAddOther
            addOtherLabel={t('questionary:medical.options.addOther')}
            otherPlaceholder={t('questionary:medical.addOtherPlaceholder')}
            excludableValue="none"
          />
        )}
      />
      {/* Bottom Buttons */}
      <p><ErrorMessage errors={errors} name="name" /></p>
      {activeStep && (
        <Portal>
          {metadata && (
            <QuestionStepIndicator>
              {metadata.current} {t('questionary:stepOf')} {metadata.total}
            </QuestionStepIndicator>
          )}
          { /* ReCaptcha  */}
          <TempReCaptchaContainer>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
              onChange={setCaptchaValue}
              hl={i18n.language}
            />
          </TempReCaptchaContainer>
          {submitError && (
          <TempBeforeSubmitError>
            {submitError}
          </TempBeforeSubmitError>
          )}
          <WizardButtons
            invert
            // leftLabel={t('questionary:proceedButton')}
            leftLabel={isSubmitting ? t('questionary:submitting') : t('beforeSubmit:submitButton')}
            leftDisabled={!captchaValue || isSubmitting}
            leftHandler={handleSubmit(onSubmit)}
          />
        </Portal>
      )}
    </>
  );
};

export default React.memo(Step6);
