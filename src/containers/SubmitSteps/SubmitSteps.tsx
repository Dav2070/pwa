import React from 'react';
import { createStore, setStorageType, useStateMachine } from 'little-state-machine';
import { useHistory } from 'react-router-dom';

// Wizard
import Wizard from 'components/Wizard';

setStorageType(window.localStorage);

const StoreKey = 'submit-steps';

createStore({
  [StoreKey]: {
    recordYourCough: {
      recordingFile: null,
      uploadedFile: null,
    },
    recordYourSpeech: {
      recordingFile: null,
      uploadedFile: null,
    },
  },
}, {
  name: 'VirufyWizard',
});

const baseUrl = '/submit-steps';
const baseComponentPath = 'SubmitSteps';
const middleComponentPathRecording = 'RecordingsSteps';
const middleComponentPathQuestionary = 'Questionary';
const middleComponentPathSubmission = 'Submission';
const recordYourCoughLogic = 'recordYourCough';
const recordYourSpeechLogic = 'recordYourSpeech';

const steps: Wizard.Step[] = [
  // Record Your Cough Steps
  {
    path: '/step-record/cough',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
    props: {
      storeKey: StoreKey,
      previousStep: '/welcome/step-4',
      nextStep: `${baseUrl}/step-listen/cough`,
      otherSteps: {
        manualUploadStep: `${baseUrl}/step-manual-upload/cough`,
      },
      metadata: {
        currentLogic: recordYourCoughLogic,
      },
    },
  },
  {
    path: '/step-manual-upload/cough',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-record/cough`,
      nextStep: `${baseUrl}/step-listen/cough`,
      metadata: {
        currentLogic: recordYourCoughLogic,
      },
    },
  },
  {
    path: '/step-listen/cough',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-record/cough`,
      nextStep: `${baseUrl}/step-record/speech`,
      metadata: {
        currentLogic: recordYourCoughLogic,
      },
    },
  },
  // Record Your Speech Steps
  {
    path: '/step-record/speech',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-listen/cough`,
      nextStep: `${baseUrl}/step-listen/speech`,
      otherSteps: {
        manualUploadStep: `${baseUrl}/step-manual-upload/speech`,
      },
      metadata: {
        currentLogic: recordYourSpeechLogic,
      },
    },
  },
  {
    path: '/step-manual-upload/speech',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-record/speech`,
      nextStep: `${baseUrl}/step-listen/speech`,
      metadata: {
        currentLogic: recordYourSpeechLogic,
      },
    },
  },
  {
    path: '/step-listen/speech',
    componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-record/speech`,
      nextStep: `${baseUrl}/questionary/step1a`,
      metadata: {
        currentLogic: recordYourSpeechLogic,
      },
    },
  },
  // Questionary
  {
    path: '/questionary/step1a',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1a`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/step-listen/speech`,
      nextStep: `${baseUrl}/questionary/step1b`,
      otherSteps: {
        noTestStep: `${baseUrl}/questionary/step2`,
      },
      metadata: {
        current: 1,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step1b',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1b`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step1a`,
      nextStep: `${baseUrl}/questionary/step2`,
      metadata: {
        current: 1,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step2',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step2`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step1b`,
      nextStep: `${baseUrl}/questionary/step3`,
      otherSteps: {
        noTestStep: `${baseUrl}/questionary/step1a`,
      },
      metadata: {
        current: 2,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step3',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step3`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step2`,
      nextStep: `${baseUrl}/questionary/step4a`,
      metadata: {
        current: 3,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step4a',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step4a`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step3`,
      nextStep: `${baseUrl}/questionary/step5`,
      otherSteps: {
        covidSymptomsStep: `${baseUrl}/questionary/step4b`,
      },
      metadata: {
        current: 4,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step4b',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step4b`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step4a`,
      nextStep: `${baseUrl}/questionary/step5`,
      metadata: {
        current: 4,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step5',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step5`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step4a`,
      nextStep: `${baseUrl}/questionary/step6`,
      metadata: {
        current: 5,
        total: 6,
      },
    },
  },
  {
    path: '/questionary/step6',
    componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step6`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/questionary/step5`,
      // nextStep: `${baseUrl}/before-submit`,
      nextStep: `${baseUrl}/thank-you`,
      metadata: {
        current: 6,
        total: 6,
      },
    },
  },
  // Submission
  // {
  //   path: '/before-submit',
  //   componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/BeforeSubmit`,
  //   props: {
  //     storeKey: StoreKey,
  //     previousStep: `${baseUrl}/questionary/step6`,
  //     nextStep: `${baseUrl}/thank-you`,
  //   },
  // },
  {
    path: '/thank-you',
    componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/ThankYou`,
    props: {
      storeKey: StoreKey,
      previousStep: `${baseUrl}/before-submit`,
      nextStep: '/welcome',
    },
  },
];

const SubmitSteps = () => {
  // Hooks
  const { state } = useStateMachine();
  const history = useHistory();

  // Effects
  React.useEffect(() => {
    const checkFileProblem = (file: File) => {
      if (file && file.size === undefined) {
        return true;
      }
      return false;
    };

    const checkFileConsistencyProblem = (inputState: Record<string, any>) => {
      let out = null;

      if (inputState[StoreKey]) {
        const { recordYourCough, recordYourSpeech } = inputState[StoreKey];
        const toTest = [];

        if (recordYourCough) {
          const { recordingFile, uploadedFile } = recordYourCough;
          if (recordingFile) {
            toTest.push({ file: recordingFile, route: '/step-record/cough' });
          }
          if (uploadedFile) {
            toTest.push({ file: uploadedFile, route: '/step-manual-upload/cough' });
          }
        }
        if (recordYourSpeech) {
          const { recordingFile, uploadedFile } = recordYourCough;
          if (recordingFile) {
            toTest.push({ file: recordingFile, route: '/step-record/speech' });
          }
          if (uploadedFile) {
            toTest.push({ file: uploadedFile, route: '/step-manual-upload/speech' });
          }
        }

        const itemWithProblem = toTest.find(toTestItem => checkFileProblem(toTestItem.file));
        if (itemWithProblem) {
          out = itemWithProblem.route;
        }
      }

      return out;
    };

    const problemRoute = checkFileConsistencyProblem(state);
    if (problemRoute) {
      history.push(`/${StoreKey}${problemRoute}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const WrapperSubmitSteps = () => (
  <Wizard
    steps={steps}
  >
    <SubmitSteps />
  </Wizard>
);

export default React.memo(WrapperSubmitSteps);
