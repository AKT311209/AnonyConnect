import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import Admin2FASetupPanel from '../../components/Admin2FASetupPanel';

function Admin2FASetupPage() {
  return <Admin2FASetupPanel />;
}

export default withAdminPageAuth(Admin2FASetupPage);
