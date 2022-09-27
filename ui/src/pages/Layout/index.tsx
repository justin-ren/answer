import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  userInfoStore,
  siteInfoStore,
  interfaceStore,
  toastStore,
} from '@answer/stores';
import { Header, AdminHeader, Footer, Toast } from '@answer/components';

import { useSiteSettings } from '@/services/api';
import Storage from '@/utils/storage';

let isMounted = false;
const Layout: FC = () => {
  const { siteInfo, update: siteStoreUpdate } = siteInfoStore();
  const { update: interfaceStoreUpdate } = interfaceStore();
  const { data: siteSettings } = useSiteSettings();
  useEffect(() => {
    if (siteSettings) {
      siteStoreUpdate(siteSettings.general);
      interfaceStoreUpdate(siteSettings.interface);
    }
  }, [siteSettings]);
  const updateUser = userInfoStore((state) => state.update);
  const { msg: toastMsg, variant, clear: toastClear } = toastStore();
  const { i18n } = useTranslation();

  const closeToast = () => {
    toastClear();
  };
  if (!isMounted) {
    isMounted = true;
    const user = Storage.get('userInfo');
    const lang = Storage.get('LANG');
    if (user) {
      updateUser(user);
    }
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }

  return (
    <>
      <Helmet>
        {siteInfo ? (
          <meta name="description" content={siteInfo.description} />
        ) : null}
      </Helmet>
      <Header />
      <AdminHeader />
      <div className="position-relative page-wrap">
        <Outlet />
      </div>
      <Toast msg={toastMsg} variant={variant} onClose={closeToast} />
      <Footer />
    </>
  );
};

export default Layout;
