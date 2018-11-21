import * as moment from 'moment';
import * as Sequelize from 'sequelize';

import Admin, { AdminInstance } from './Admin';
import db from './db';

interface OauthAccessTokenAttributes {
  id?: number;
  token?: string;
  expiresOn?: Date;
  adminId: number;
}

interface OauthAccessTokenInstance extends Sequelize.Instance<OauthAccessTokenAttributes>, OauthAccessTokenAttributes {
  admin?: AdminInstance;
}

interface OauthAccessToken extends Sequelize.Model<OauthAccessTokenInstance, OauthAccessTokenAttributes> {
  getAdminFromTokenString?: (token: string) => PromiseLike<AdminInstance>;
}

const attributes: SequelizeAttributes<OauthAccessTokenAttributes> = {
  token: {
    type: Sequelize.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  expiresOn: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: () => moment().add(2, 'months').toDate(),
  },
  adminId: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
};

const OauthAccessToken: OauthAccessToken =
  db.define<OauthAccessTokenInstance, OauthAccessTokenAttributes>('oauthAccessToken', attributes, {
    tableName: 'oauth-access-tokens',
  });

OauthAccessToken.belongsTo(Admin);

OauthAccessToken.getAdminFromTokenString = function getAdminFromTokenString(tokenString) {
  return OauthAccessToken.findOne({
    include: [
      {
        model: Admin,
        required: true,
      },
    ],
    where: {
      token: tokenString,
    },
  }).then(token => {
    if (!token) {
      return null;
    }

    return token.admin;
  });
};

export default OauthAccessToken;
