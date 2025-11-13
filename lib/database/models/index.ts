import sequelize from '@/lib/database/config/database';

import { initAdmin, Admin } from './Admin';
import { initAssociate, Associate } from './Associate';
import { initForm, Form } from './Form';
import { initFormLink, FormLink } from './FormLink';
import { initCustomField, CustomField } from './CustomField';
import { initFieldLink, FieldLink } from './FieldLink';
import { initOfficialForm, OfficialForm } from './OfficialForm';
import {
  initHistoricoFuncional,
  HistoricoFuncional,
} from './HistoricoFuncional';
import { initStatus, Status } from './Status';

export function initModels() {
  initAdmin(sequelize);
  initForm(sequelize);
  initFormLink(sequelize);
  initCustomField(sequelize);
  initFieldLink(sequelize);
  initAssociate(sequelize);
  initOfficialForm(sequelize);
  initHistoricoFuncional(sequelize);
  initStatus(sequelize);

  Admin.hasMany(Associate, { foreignKey: 'adminId', as: 'associates' });
  Admin.hasMany(Form, { foreignKey: 'adminId', as: 'forms' });
  Admin.hasMany(FormLink, { foreignKey: 'adminId', as: 'formLinks' });
  Admin.hasMany(CustomField, { foreignKey: 'adminId', as: 'customFields' });
  Admin.hasMany(FieldLink, { foreignKey: 'adminId', as: 'fieldLinks' });
  Admin.hasMany(OfficialForm, { foreignKey: 'adminId', as: 'officialForms' });
  Admin.hasMany(HistoricoFuncional, {
    foreignKey: 'adminId',
    as: 'historicosFuncionais',
  });
  Admin.hasMany(Status, { foreignKey: 'adminId', as: 'statuses' });

  Associate.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
  Associate.belongsTo(Form, { foreignKey: 'formId', as: 'form' });
  Associate.hasMany(FieldLink, { foreignKey: 'associateId', as: 'fieldLinks' });
  Associate.hasOne(OfficialForm, {
    foreignKey: 'associateId',
    as: 'officialForm',
  });
  Associate.hasOne(HistoricoFuncional, {
    foreignKey: 'associateId',
    as: 'historicoFuncional',
  });
  Associate.hasOne(Status, { foreignKey: 'associateId', as: 'status' });

  OfficialForm.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
  HistoricoFuncional.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
  Status.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
  OfficialForm.belongsTo(Associate, {
    foreignKey: 'associateId',
    as: 'associate',
  });
  HistoricoFuncional.belongsTo(Associate, {
    foreignKey: 'associateId',
    as: 'associate',
  });
  Status.belongsTo(Associate, { foreignKey: 'associateId', as: 'associate' });

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
  FieldLink.belongsTo(Associate, {
    foreignKey: 'associateId',
    as: 'associate',
  });

  //Remover em produção!!!!
  if (process.env.NODE_ENV === 'development') {
    sequelize.sync({ alter: true }).then(() => {
      console.log('Database sincronizado');
    });
  }
}

export {
  sequelize,
  Admin,
  Associate,
  Form,
  FormLink,
  CustomField,
  FieldLink,
  OfficialForm,
  HistoricoFuncional,
  Status,
};
