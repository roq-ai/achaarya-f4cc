interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Teacher'],
  customerRoles: ['Guest'],
  tenantRoles: ['Teacher', 'Parent', 'Student'],
  tenantName: 'Provider',
  applicationName: 'Achaarya.',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'Read user information',
    'Read provider information',
    'Read textbook information',
    'Read study session information',
  ],
  ownerAbilities: ['Manage user information', 'Manage textbooks', 'Manage chapters', 'Manage study sessions'],
  getQuoteUrl: 'https://app.roq.ai/proposal/8e4a847a-0fb3-4250-9aee-995c0ecd1e4d',
};
