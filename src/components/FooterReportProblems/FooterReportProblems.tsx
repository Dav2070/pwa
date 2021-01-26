import React from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Link from 'components/Link';

// Data
import { reportProblemForm } from 'data/reportProblemForm';

// Styles
import { FooterContainer } from './style';

interface FooterReportProblemsProps {
}

const FooterReportProblems = () => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language;

  return (
    <FooterContainer>
      {lang && (
        <Link to={reportProblemForm[lang as FeedbackLanguage]} target="_blank">
          { t('footerReportProblems:message')}
        </Link>
      )}
    </FooterContainer>
  );
};

export default React.memo(FooterReportProblems);
