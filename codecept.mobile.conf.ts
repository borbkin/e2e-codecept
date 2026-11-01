import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
import { createCodeceptConfig } from './src/config/codeceptConfig';
import { loadEnvironment } from './src/config/environment';

const environment = loadEnvironment(process.env, 'mobile');
setHeadlessWhen(environment.headless ? 'true' : undefined);
setCommonPlugins();

export const config: CodeceptJS.MainConfig = createCodeceptConfig(environment);
