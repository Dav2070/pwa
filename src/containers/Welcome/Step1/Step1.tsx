import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

// Components
import WizardButtons from 'components/WizardButtons';
import Dropdown from 'components/Dropdown';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Data
import { languageData } from 'data/lang';
import { countryData } from 'data/country';

// Hooks
import useWindowSize from 'hooks/useWindowSize';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import {
  WelcomeLogo, WelcomeTitle, WelcomeContent, WelcomeSubtitle, WelcomeStyledForm, WelcomeRequiredFieldText,
} from '../style';

const schema = Yup.object().shape({
  country: Yup.string().required(),
  language: Yup.string().required(),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step1 = (p: Wizard.StepProps) => {
  const { width } = useWindowSize();

  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const [activeStep, setActiveStep] = React.useState(true);
  const { doGoBack, setDoGoBack } = useHeaderContext();

  const { state, action } = useStateMachine(updateAction(p.storeKey));
  const {
    control,
    formState,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: state?.[p.storeKey],
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const history = useHistory();
  const { isValid } = formState;

  const onSubmit = async (values: Step1Type) => {
    if (values) {
      action(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  useEffect(() => {
    scrollToTop();

    // Hide back arrow in header if neccesary
    if (doGoBack) setDoGoBack(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t, i18n } = useTranslation();

  const lang = watch('language');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  const countrySelectOptions = useMemo(() => [{ name: t('main:selectCountry'), consentFormUrl: '', val: '' },
    ...countryData], [t]);

  return (
    <WelcomeStyledForm>
      <WelcomeLogo />

      <WelcomeTitle fontSize={width && width > 560 ? 42 : 34}>{t('main:title')}</WelcomeTitle>
      <WelcomeContent>
        <WelcomeSubtitle fontWeight={400} mb={width && width > 560 ? 50 : 30} mt={width && width > 560 ? 0 : -14}>
          {t('main:paragraph1')}
        </WelcomeSubtitle>

        <Controller
          control={control}
          name="language"
          defaultValue={i18n.language.split('-')[0] || languageData[0].code}
          render={({ onChange, value }) => (
            <Dropdown onChange={e => onChange(e.currentTarget.value)} value={value}>
              {languageData.map(({ code, label }) => <option key={code} id={code} value={code}>{label}</option>)}
            </Dropdown>
          )}
        />

        <WelcomeSubtitle
          mt={width && width > 560 ? 50 : 35}
          mb={width && width > 560 ? 50 : 29}
          fontWeight={400}
          textAlign="left"
        >
          {t('main:paragraph2')}
          <WelcomeRequiredFieldText> *</WelcomeRequiredFieldText>
        </WelcomeSubtitle>

        <Controller
          control={control}
          name="country"
          defaultValue={countrySelectOptions[0].val}
          render={({ onChange, value }) => (
            <Dropdown onChange={e => onChange(e.currentTarget.value)} value={value}>
              {countrySelectOptions.map(({ name, val }) => <option key={name} id={name} value={val}>{name}</option>)}
            </Dropdown>
          )}
        />

        {activeStep && (
          <Portal>
            <WizardButtons
              leftLabel={t('main:nextButton')}
              leftHandler={handleSubmit(onSubmit)}
              leftDisabled={!isValid}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledForm>
  );
};

export default React.memo(Step1);