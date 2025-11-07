import sequelize from '@/lib/database/config/database';

import { initAdmin, Admin } from './Admin';
import { initAssociate, Associate } from './Associate';
import { initForm, Form } from './Form';
import { initFormLink, FormLink } from './FormLink';
import { initCustomField, CustomField } from './CustomField';
import { initFieldLink, FieldLink } from './FieldLink';

initAdmin(sequelize);
initForm(sequelize);
initFormLink(sequelize);
initCustomField(sequelize);
initFieldLink(sequelize);
initAssociate(sequelize);

Admin.hasMany(Associate, { foreignKey: 'adminId', as: 'associates' });
Admin.hasMany(Form, { foreignKey: 'adminId', as: 'forms' });
Admin.hasMany(FormLink, { foreignKey: 'adminId', as: 'formLinks' });
Admin.hasMany(CustomField, { foreignKey: 'adminId', as: 'customFields' });
Admin.hasMany(FieldLink, { foreignKey: 'adminId', as: 'fieldLinks' });

Associate.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
Associate.belongsTo(Form, { foreignKey: 'formId', as: 'form' });
Associate.hasMany(FieldLink, { foreignKey: 'associateId', as: 'fieldLinks' });

Form.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
Form.hasMany(FormLink, { foreignKey: 'formId', as: 'links' });
Form.hasMany(Associate, { foreignKey: 'formId', as: 'associates' });

FormLink.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
FormLink.belongsTo(Form, { foreignKey: 'formId', as: 'form' });

CustomField.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
CustomField.hasMany(FieldLink, { foreignKey: 'customFieldId', as: 'links' });

FieldLink.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
FieldLink.belongsTo(CustomField, {
  foreignKey: 'customFieldId',
  as: 'customField',
});
FieldLink.belongsTo(Associate, { foreignKey: 'associateId', as: 'associate' });

//Remover em produção!!!!
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database sincronizado');
  });
}

export { sequelize, Admin, Associate, Form, FormLink, CustomField, FieldLink };
