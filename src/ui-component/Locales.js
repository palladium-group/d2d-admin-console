import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
import { IntlProvider } from 'react-intl';
import useConfig from 'hooks/useConfig';

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  const { locale } = useConfig();
  const [messages, setMessages] = useState();

  useEffect(() => {
    setMessages({});
  }, [locale]);

  return (
    <>
      {messages && (
        <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

Locales.propTypes = {
  children: PropTypes.node
};

export default Locales;
