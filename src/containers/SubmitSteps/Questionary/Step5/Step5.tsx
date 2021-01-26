import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

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
  QuestionText, QuestionStepIndicator, GrayExtraInfo,
} from '../style';

const schema = Yup.object({
  currentRespiratoryCondition: Yup.object().required(),
}).defined();

type Step5Type = Yup.InferType<typeof schema>;

const Step5 = ({
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
  const onSubmit = async (values: Step5Type) => {
    if (values) {
      action(values);
      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
    }
  };

  return (
    <>
      <ProgressIndicator currentStep={3} totalSteps={4} />

      <GrayExtraInfo>{t('questionary:caption')}</GrayExtraInfo>

      <QuestionText>
        {t('questionary:respiration.question')}
      </QuestionText>
      <Controller
        control={control}
        name="currentRespiratoryCondition"
        defaultValue={{ selected: [], other: '' }}
        render={({ onChange, value }) => (
          <OptionList
            value={value}
            onChange={v => onChange(v)}
            items={[
              {
                value: 'asthma',
                label: t('questionary:respiration.options.asthma'),
              },
              {
                value: 'bronchitis',
                label: t('questionary:respiration.options.bronchitis'),
              },
              {
                value: 'copdEmphysema',
                label: t('questionary:respiration.options.emphysema'),
              },
              {
                value: 'pneumonia',
                label: t('questionary:respiration.options.pneumonia'),
              },
              {
                value: 'tuberculosis',
                label: t('questionary:respiration.options.tuberculosis'),
              },
              {
                value: 'none',
                label: t('questionary:respiration.options.none'),
              },
            ]}
            allowAddOther
            addOtherLabel={t('questionary:respiration.options.addOther')}
            otherPlaceholder={t('questionary:respiration.addOtherPlaceholder')}
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
          <WizardButtons
            invert
            leftLabel={t('questionary:nextButton')}
            leftHandler={handleSubmit(onSubmit)}
          />
        </Portal>
      )}
    </>
  );
};

export default React.memo(Step5);
