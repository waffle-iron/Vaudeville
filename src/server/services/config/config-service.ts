import * as ConfigStore from 'configstore';

import { injectable } from 'inversify';

const packageJson = require('../../package.json');
const defaultJson = require('./default.json');

@injectable()
class ConfigService {
  private static config: ConfigStore = new ConfigStore(packageJson.name, defaultJson);


}